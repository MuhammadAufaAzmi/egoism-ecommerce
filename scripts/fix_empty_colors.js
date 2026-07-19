const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { Jimp } = require('jimp');

const prisma = new PrismaClient();
const destDir = path.join(__dirname, "..", "public");

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
  let closest = "Black";
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

async function detectShirtColor(imagePath) {
  try {
    const fullPath = path.join(destDir, imagePath);
    if (!fs.existsSync(fullPath)) return "BLACK";
    
    const image = await Jimp.read(fullPath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    const bgPixel = image.getPixelColor(10, 10);
    const bgRgba = { r: (bgPixel >> 24) & 255, g: (bgPixel >> 16) & 255, b: (bgPixel >> 8) & 255, a: bgPixel & 255 };
    
    const points = [
      { x: Math.floor(width * 0.3), y: Math.floor(height * 0.3) },
      { x: Math.floor(width * 0.7), y: Math.floor(height * 0.3) },
      { x: Math.floor(width * 0.25), y: Math.floor(height * 0.7) },
      { x: Math.floor(width * 0.75), y: Math.floor(height * 0.7) }
    ];
    
    let validColors = [];
    for (const p of points) {
      const hex = image.getPixelColor(p.x, p.y);
      const rgba = { r: (hex >> 24) & 255, g: (hex >> 16) & 255, b: (hex >> 8) & 255, a: hex & 255 };
      if (colorDistance(rgba, bgRgba) > 15) validColors.push(rgba);
    }
    
    if (validColors.length === 0) {
      const fallbackHex = image.getPixelColor(Math.floor(width * 0.2), Math.floor(height * 0.5));
      validColors.push({ r: (fallbackHex >> 24) & 255, g: (fallbackHex >> 16) & 255, b: (fallbackHex >> 8) & 255, a: fallbackHex & 255 });
    }
    
    let sumR = 0, sumG = 0, sumB = 0;
    for (const c of validColors) { sumR += c.r; sumG += c.g; sumB += c.b; }
    return getClosestColorName(sumR / validColors.length, sumG / validColors.length, sumB / validColors.length).toUpperCase();
  } catch (error) {
    return "BLACK";
  }
}

async function fixEmptyColors() {
    const products = await prisma.product.findMany({ where: { colors: '[]' } });
    for (const product of products) {
        const images = [];
        if (product.image) images.push(product.image);
        try {
            const extra = JSON.parse(product.images);
            if (Array.isArray(extra)) images.push(...extra);
        } catch(e) {}
        
        const newColors = [];
        const colorSet = new Set();
        
        for (const imgUri of images) {
            const detected = await detectShirtColor(imgUri);
            if (!colorSet.has(detected)) {
                colorSet.add(detected);
                newColors.push({ name: detected, image: imgUri });
            }
        }
        
        if (newColors.length > 0) {
            await prisma.product.update({
                where: { id: product.id },
                data: { colors: JSON.stringify(newColors) }
            });
            console.log(`Restored colors for ${product.name}: ${newColors.map(c=>c.name).join(', ')}`);
        }
    }
    console.log("Empty colors fixed!");
}

fixEmptyColors().catch(console.error).finally(() => prisma.$disconnect());
