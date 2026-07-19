const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixColors() {
    const products = await prisma.product.findMany();
    const productsDir = path.join(__dirname, '../public/products');
    const files = fs.readdirSync(productsDir);

    for (const product of products) {
        // Group files by color for this product
        const productFiles = files.filter(f => f.startsWith(product.slug + '_'));
        const colorsMap = new Map();

        productFiles.forEach(file => {
            // filename format: slug_fittype_color_timestamp_index.jpg
            const parts = file.replace(product.slug + '_', '').split('_');
            if (parts.length >= 2) {
                const colorStr = parts[1].toUpperCase().replace(/-/g, ' ');
                if (!colorsMap.has(colorStr)) {
                    colorsMap.set(colorStr, `/products/${file}`);
                }
            }
        });

        const newColorsArray = [];
        colorsMap.forEach((imgPath, colorName) => {
            newColorsArray.push({ name: colorName, image: imgPath });
        });

        if (newColorsArray.length > 0) {
            await prisma.product.update({
                where: { id: product.id },
                data: { colors: JSON.stringify(newColorsArray) }
            });
            console.log(`Updated colors for ${product.name}`);
        }
    }
    console.log("Done fixing colors!");
}

fixColors().catch(console.error).finally(() => prisma.$disconnect());
