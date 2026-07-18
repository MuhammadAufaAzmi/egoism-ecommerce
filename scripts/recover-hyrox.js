const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { Jimp } = require('jimp');

const prisma = new PrismaClient();

const sourceDirs = [
  "C:\\Users\\Budiman\\Downloads\\HYROX-20260610T100215Z-3-001\\HYROX"
];
const destDir = path.join(__dirname, "..", "public", "products");

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const COLOR_MAP = {
  "Black": { r: 26, g: 26, b: 26 },
  "White": { r: 245, g: 245, b: 245 },
  "Navy": { r: 27, g: 42, b: 74 },
  "Light Blue": { r: 96, g: 165, b: 250 },
  "Maroon": { r: 107, g: 39, b: 55 },
  "Sage Green": { r: 120, g: 140, b: 120 },
  "Fuschia": { r: 220, g: 50, b: 150 },
  "Grey": { r: 136, g: 136, b: 136 },
  "Dusty Peach": { r: 212, g: 165, b: 165 },
  "Red": { r: 192, g: 57, b: 43 },
  "Olive": { r: 107, g: 124, b: 62 },
  "Brown": { r: 120, g: 53, b: 15 },
  "Beige": { r: 212, g: 184, b: 150 },
  "Lilac": { r: 200, g: 162, b: 200 },
  "Pink": { r: 244, g: 114, b: 182 }
};

function colorDistance(c1, c2) {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
}

function getClosestColorName(r, g, b) {
  let closest = "Unknown";
  let minDistance = Infinity;
  for (const [name, rgb] of Object.entries(COLOR_MAP)) {
    const dist = colorDistance({r, g, b}, rgb);
    if (dist < minDistance) {
      minDistance = dist;
      closest = name;
    }
  }
  return closest;
}

// Advanced Color Detection skipping background
async function detectShirtColor(imagePath) {
  try {
    const image = await Jimp.read(imagePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Get background color from top-left corner
    const bgPixel = image.getPixelColor(10, 10);
    const bgRgba = { r: (bgPixel >> 24) & 255, g: (bgPixel >> 16) & 255, b: (bgPixel >> 8) & 255, a: bgPixel & 255 };
    
    // Sample points on the shirt (avoiding center graphic and background)
    // For a standard mockup, shoulders and lower belly are good.
    const points = [
      { x: Math.floor(width * 0.3), y: Math.floor(height * 0.3) }, // Left shoulder
      { x: Math.floor(width * 0.7), y: Math.floor(height * 0.3) }, // Right shoulder
      { x: Math.floor(width * 0.25), y: Math.floor(height * 0.7) }, // Lower left belly
      { x: Math.floor(width * 0.75), y: Math.floor(height * 0.7) }  // Lower right belly
    ];
    
    let validColors = [];
    
    for (const p of points) {
      const hex = image.getPixelColor(p.x, p.y);
      const rgba = { r: (hex >> 24) & 255, g: (hex >> 16) & 255, b: (hex >> 8) & 255, a: hex & 255 };
      
      // If color is too close to background, skip
      if (colorDistance(rgba, bgRgba) > 15) {
         validColors.push(rgba);
      }
    }
    
    // If we couldn't find a non-bg color, just fallback to center left
    if (validColors.length === 0) {
      const fallbackHex = image.getPixelColor(Math.floor(width * 0.2), Math.floor(height * 0.5));
      validColors.push({ r: (fallbackHex >> 24) & 255, g: (fallbackHex >> 16) & 255, b: (fallbackHex >> 8) & 255, a: fallbackHex & 255 });
    }
    
    // Average the valid colors
    let sumR = 0, sumG = 0, sumB = 0;
    for (const c of validColors) {
      sumR += c.r; sumG += c.g; sumB += c.b;
    }
    const avgR = sumR / validColors.length;
    const avgG = sumG / validColors.length;
    const avgB = sumB / validColors.length;
    
    // Fallback heuristic: Sometimes filenames have color codes or names
    const lowerPath = imagePath.toLowerCase();
    if (lowerPath.includes('black')) return "Black";
    if (lowerPath.includes('white')) return "White";
    if (lowerPath.includes('navy')) return "Navy";
    if (lowerPath.includes('maroon')) return "Maroon";
    if (lowerPath.includes('sage')) return "Sage Green";
    
    return getClosestColorName(avgR, avgG, avgB);
  } catch (error) {
    console.error(`Error processing image ${imagePath}:`, error.message);
    return "Black"; // Safe fallback
  }
}

const keywordToFitType = [
  { key: "crop oversize", val: "Crop Oversize" },
  { key: "ovscrop", val: "Crop Oversize" },
  { key: "crop", val: "Crop Regular Fit" },
  { key: "longsleeve", val: "Long Sleeve" },
  { key: "long sleeve", val: "Long Sleeve" },
  { key: "muscle", val: "Muscle Tank" },
  { key: "tank", val: "Muscle Tank" },
  { key: "ovs", val: "Oversized Tshirt" },
  { key: "oversize", val: "Oversized Tshirt" },
  { key: "oversized", val: "Oversized Tshirt" },
  { key: "regular", val: "Regular Tshirt" },
  { key: "specialist tshirt", val: "Regular Tshirt" }
];

function determineFitType(text) {
  text = text.toLowerCase();
  for (const map of keywordToFitType) {
    if (text.includes(map.key)) return map.val;
  }
  return "Regular Tshirt";
}

function textMatchFitType(text) {
  text = text.toLowerCase();
  return keywordToFitType.some(m => text.includes(m.key));
}

const fitTypeSizing = {
  "Regular Tshirt": ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"],
  "Oversized Tshirt": ["M", "L", "XL", "XXL"],
  "Muscle Tank": ["M", "L", "XL", "XXL", "3XL", "4XL"],
  "Crop Tank": ["S", "M", "L"],
  "Crop Oversize": ["M", "L", "XL"],
  "Crop Regular Fit": ["S", "M", "L", "XL", "XXL"],
  "Long Sleeve": ["S", "M", "L", "XL"]
};

const defaultPrices = {
  "Regular Tshirt": 175000,
  "Oversized Tshirt": 225000,
  "Muscle Tank": 175000,
  "Crop Tank": 165000,
  "Crop Oversize": 170000,
  "Crop Regular Fit": 165000,
  "Long Sleeve": 180000
};

const priceOverridesRules = {
  "Regular Tshirt": { "XXL": 180000, "3XL": 180000, "4XL": 190000, "5XL": 195000 },
  "Oversized Tshirt": { "XXL": 235000 },
  "Muscle Tank": { "XXL": 180000, "3XL": 180000, "4XL": 190000 }
};

const fitTypeToSlug = {
  "Regular Tshirt": "regular",
  "Oversized Tshirt": "oversize",
  "Muscle Tank": "muscle-tank",
  "Crop Tank": "crop-tank",
  "Crop Oversize": "crop-oversize",
  "Crop Regular Fit": "crop",
  "Long Sleeve": "long-sleeve"
};

async function main() {
  console.log("🚀 Starting Recovery of HYROX Products...");
  
  let allFiles = [];

  function scanDir(currentDir, rootDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath, rootDir);
      } else if (item.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const relativePath = path.relative(rootDir, currentDir);
        const pathParts = relativePath.split(path.sep);
        const category = pathParts[0] || "Uncategorized";
        let productName = pathParts[pathParts.length - 1] || "Unknown";
        
        if (pathParts.length > 2 && textMatchFitType(productName)) {
           productName = pathParts[pathParts.length - 2];
        } else if (pathParts.length === 2 && textMatchFitType(productName)) {
           productName = pathParts[0];
        }
        
        // Use directory name as product name since these are top-level folders
        productName = category; 
        
        const fitType = determineFitType(item) || determineFitType(currentDir);
        
        // Clean product name
        productName = productName.replace(/_/g, ' ').toUpperCase();

        allFiles.push({ path: fullPath, filename: item, category, productName, fitType });
      }
    }
  }

  for (const dir of sourceDirs) {
    if (fs.existsSync(dir)) scanDir(dir, dir);
  }

  const productGroups = {};
  for (const file of allFiles) {
    const pName = file.productName;
    if (!productGroups[pName]) {
      productGroups[pName] = {
        name: pName,
        category: file.category,
        files: []
      };
    }
    productGroups[pName].files.push(file);
  }

  const groupedKeys = Object.keys(productGroups);

  let processedCount = 0;

  for (const key of groupedKeys) {
    const group = productGroups[key];
    console.log(`\nProcessing: ${group.name} (${group.files.length} images)`);
    
    let colorsArray = [];
    let imagesArray = [];
    let colorSet = new Set();
    
    let fitTypesSet = new Set();
    let sizesMap = {};
    let prodOverrides = {};
    let basePrice = 999999;
    
    for (const file of group.files) {
      fitTypesSet.add(file.fitType);
      
      const detectedColor = await detectShirtColor(file.path);
      
      const destFilename = `${group.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${file.fitType.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}_${file.filename.replace(/[^a-z0-9.]/gi, '_')}`;
      const destPath = path.join(destDir, destFilename);
      fs.copyFileSync(file.path, destPath);
      
      const imageUri = `/products/${destFilename}`;
      imagesArray.push(imageUri);
      
      if (!colorSet.has(detectedColor)) {
        colorSet.add(detectedColor);
        colorsArray.push({ name: detectedColor.toUpperCase(), image: imageUri });
      }
    }
    
    const fitTypesArr = Array.from(fitTypesSet);
    const fitTypeSlugs = [];
    
    for (const ft of fitTypesArr) {
      sizesMap[ft] = fitTypeSizing[ft] || ["S", "M", "L", "XL"];
      if (defaultPrices[ft] && defaultPrices[ft] < basePrice) {
        basePrice = defaultPrices[ft];
      }
      if (priceOverridesRules[ft]) {
        prodOverrides[ft] = priceOverridesRules[ft];
      }
      fitTypeSlugs.push(fitTypeToSlug[ft] || "regular");
    }
    if (basePrice === 999999) basePrice = 175000;
    
    const slug = group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const dbProduct = {
      name: group.name,
      slug: slug,
      price: basePrice,
      category: "unisex", // Defaulting to unisex for HYROX
      image: imagesArray[0] || "",
      images: JSON.stringify(imagesArray.slice(1)),
      sizes: JSON.stringify(sizesMap),
      fitType: JSON.stringify(fitTypeSlugs),
      colors: JSON.stringify(colorsArray),
      priceOverrides: JSON.stringify(prodOverrides),
      isNew: true, // Marking as new just like they probably were
      description: `Premium graphic tee: ${group.name} by Egoism`
    };

    const existingProduct = await prisma.product.findUnique({ where: { slug: slug } });

    if (existingProduct) {
      await prisma.product.update({ where: { slug: slug }, data: dbProduct });
    } else {
      await prisma.product.create({ data: dbProduct });
    }
    
    processedCount++;
  }

  console.log(`\n🎉 RECOVERED ${processedCount} HYROX PRODUCTS!`);
}

main()
  .catch((e) => {
    console.error("❌ Import error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
