const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ALLOWED_COLORS = new Set([
  'BLACK', 'WHITE', 'NAVY', 'MAROON', 'GREY', 'LIGHT BLUE', 
  'PINK', 'HOT PINK', 'RED', 'BROWN', 'GREEN', 'BLUE'
]);

async function cleanColors() {
    const products = await prisma.product.findMany();

    for (const product of products) {
        let colors = [];
        try {
            colors = JSON.parse(product.colors);
        } catch(e) {}

        if (!Array.isArray(colors)) continue;

        let filteredColors = [];

        // Special handling for "in platform we trust" as requested by user
        if (product.name.toLowerCase() === 'in platform we trust') {
            filteredColors = colors.filter(c => c.name === 'BLACK' || c.name === 'WHITE');
            
            // If we don't have the black image mapped properly, let's fix it manually based on what we saw
            const hasBlack = filteredColors.some(c => c.name === 'BLACK');
            if (!hasBlack) {
                // Find any image that has black in the name
                filteredColors.push({
                    name: 'BLACK',
                    image: '/products/in-platform-we-trust_regular-tshirt_black_1784298138812_0.png'
                });
            }
        } else {
            // General cleanup: remove any color not in the allowed list
            filteredColors = colors.filter(c => ALLOWED_COLORS.has(c.name));
        }

        // Deduplicate by name
        const uniqueColorsMap = new Map();
        filteredColors.forEach(c => uniqueColorsMap.set(c.name, c));
        const finalColors = Array.from(uniqueColorsMap.values());

        if (finalColors.length !== colors.length || JSON.stringify(finalColors) !== JSON.stringify(colors)) {
            await prisma.product.update({
                where: { id: product.id },
                data: { colors: JSON.stringify(finalColors) }
            });
            console.log(`Cleaned colors for ${product.name}: ${finalColors.map(c=>c.name).join(', ')}`);
        }
    }
    console.log("Database colors cleaned successfully!");
}

cleanColors().catch(console.error).finally(() => prisma.$disconnect());
