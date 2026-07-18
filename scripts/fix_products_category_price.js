const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    let category = "Tshirt";
    const lowerName = product.name.toLowerCase();
    const fitTypes = product.fitType.toLowerCase();
    
    if (lowerName.includes("tank") || fitTypes.includes("tank")) {
      category = "Tank Top";
    } else if (lowerName.includes("crop") || fitTypes.includes("crop")) {
      category = "Crop Top";
    } else if (lowerName.includes("hoodie") || fitTypes.includes("hoodie")) {
      category = "Hoodie";
    }
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        price: 0,
        category: category
      }
    });
    
    console.log(`Updated ${product.name}: Price -> 0, Category -> ${category}`);
  }
  console.log("All products updated successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
