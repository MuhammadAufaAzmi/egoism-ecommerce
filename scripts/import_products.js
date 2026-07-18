const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SOURCE_DIR = 'C:\\Users\\Budiman\\Desktop\\Organized_Egoism_Products_Final';
const DEST_DIR = path.join(__dirname, '../public/products');

// Create DEST_DIR if it doesn't exist
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  const gens = fs.readdirSync(SOURCE_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  
  for (const gen of gens) {
    const genPath = path.join(SOURCE_DIR, gen.name);
    const designs = fs.readdirSync(genPath, { withFileTypes: true }).filter(d => d.isDirectory());
    
    for (const design of designs) {
      const designName = design.name;
      const slug = slugify(designName);
      const designPath = path.join(genPath, designName);
      
      const fitTypes = fs.readdirSync(designPath, { withFileTypes: true }).filter(d => d.isDirectory());
      
      const productColors = new Set();
      const productFitTypes = new Set();
      const productImages = [];
      
      for (const fitType of fitTypes) {
        const fitTypeName = fitType.name;
        productFitTypes.add(fitTypeName.toLowerCase());
        const fitTypePath = path.join(designPath, fitTypeName);
        
        const colors = fs.readdirSync(fitTypePath, { withFileTypes: true }).filter(d => d.isDirectory());
        for (const color of colors) {
          const colorName = color.name;
          productColors.add(colorName.toUpperCase());
          const colorPath = path.join(fitTypePath, colorName);
          
          const files = fs.readdirSync(colorPath, { withFileTypes: true }).filter(f => f.isFile() && (f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.jpeg')));
          
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(colorPath, file.name);
            const ext = path.extname(file.name).toLowerCase();
            // generate unique name based on attributes
            const newFileName = `${slug}_${slugify(fitTypeName)}_${slugify(colorName)}_${Date.now()}_${i}${ext}`;
            const destFilePath = path.join(DEST_DIR, newFileName);
            
            // copy file
            fs.copyFileSync(filePath, destFilePath);
            
            productImages.push(`/products/${newFileName}`);
          }
        }
      }
      
      if (productImages.length > 0) {
        const mainImage = productImages[0];
        const colorsArr = Array.from(productColors);
        const fitTypesArr = Array.from(productFitTypes);
        
        console.log(`Upserting product: ${designName}`);
        
        await prisma.product.upsert({
          where: { slug: slug },
          update: {
            name: designName,
            images: JSON.stringify(productImages),
            image: mainImage,
            colors: JSON.stringify(colorsArr),
            fitType: JSON.stringify(fitTypesArr),
            sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
          },
          create: {
            slug: slug,
            name: designName,
            price: 150000,
            category: "Tshirt",
            image: mainImage,
            images: JSON.stringify(productImages),
            description: `High quality ${designName} t-shirt by Egoism.`,
            sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
            colors: JSON.stringify(colorsArr),
            fitType: JSON.stringify(fitTypesArr),
            activity: JSON.stringify(["lifestyle", "gym"]),
            isNew: true
          }
        });
      } else {
         console.log(`No images found for: ${designName}`);
      }
    }
  }
  
  console.log("Import completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
