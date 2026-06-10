const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Lokasi folder asal HYROX
const HYROX_DIR = 'C:\\Users\\Budiman\\Downloads\\HYROX-20260610T100215Z-3-001\\HYROX';

// Direktori tujuan lokal (di dalam Next.js public/uploads)
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads', 'hyrox');

const defaultPrice = 150000;
const defaultSizes = JSON.stringify(['S', 'M', 'L', 'XL']);
const defaultColors = JSON.stringify(['BLACK', 'WHITE']);

// Pastikan folder uploads/hyrox ada
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Fungsi untuk copy file gambar secara lokal
function copyToLocal(filePath, design, fitType, fileName) {
  try {
    // Buat struktur folder di dalam uploads jika perlu (opsional, tapi biar rapi disatukan)
    const folderName = `${design.replace(/\s+/g, '-')}/${fitType.replace(/\s+/g, '-')}`;
    const targetFolder = path.join(UPLOADS_DIR, folderName);
    
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const ext = path.extname(fileName);
    const uniqueFileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
    const targetPath = path.join(targetFolder, uniqueFileName);
    
    // Copy file
    fs.copyFileSync(filePath, targetPath);
    
    // Return relative path untuk disimpan ke database
    return `/uploads/hyrox/${folderName}/${uniqueFileName}`;
  } catch (error) {
    console.error(`Gagal copy ${filePath}:`, error);
    return null;
  }
}

// Helper untuk membuat slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now();
}

async function main() {
  console.log('Mulai proses import data HYROX (Lokal)...');

  if (!fs.existsSync(HYROX_DIR)) {
    console.error(`Folder tidak ditemukan: ${HYROX_DIR}`);
    return;
  }

  const designs = fs.readdirSync(HYROX_DIR).filter(file => {
    return fs.statSync(path.join(HYROX_DIR, file)).isDirectory();
  });

  for (const design of designs) {
    const designDir = path.join(HYROX_DIR, design);
    console.log(`\nMemproses desain: ${design}`);

    const fitTypes = fs.readdirSync(designDir).filter(file => {
      return fs.statSync(path.join(designDir, file)).isDirectory();
    });

    for (const fitType of fitTypes) {
      const fitTypeDir = path.join(designDir, fitType);
      console.log(`  -> Memproses fit type: ${fitType}`);

      const files = fs.readdirSync(fitTypeDir);
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
      });

      if (images.length === 0) {
        console.log(`     Tidak ada gambar di ${fitTypeDir}, skip.`);
        continue;
      }

      const uploadedImages = [];

      for (const img of images) {
        const imgPath = path.join(fitTypeDir, img);
        console.log(`     Menyalin: ${img}...`);
        
        const url = copyToLocal(imgPath, design, fitType, img);
        if (url) {
          uploadedImages.push(url);
        }
      }

      if (uploadedImages.length > 0) {
        const productName = `${design} - ${fitType}`;
        const slug = createSlug(productName);
        const mainImage = uploadedImages[0];
        
        try {
          const product = await prisma.product.create({
            data: {
              name: productName,
              slug: slug,
              price: defaultPrice,
              category: 'T-Shirt',
              image: mainImage,
              images: JSON.stringify(uploadedImages),
              description: `Produk edisi khusus HYROX. Desain: ${design}, Fit: ${fitType}.`,
              sizes: defaultSizes,
              colors: defaultColors,
              fitType: JSON.stringify([fitType.toLowerCase()]),
              activity: JSON.stringify(['hyrox']),
              isNew: true,
            }
          });
          console.log(`     ✅ Berhasil disimpan ke DB: ${product.name}`);
        } catch (dbError) {
          console.error(`     ❌ Gagal menyimpan ke DB: ${productName}`, dbError);
        }
      }
    }
  }

  console.log('\nSelesai memproses semua data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
