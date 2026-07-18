const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllProducts() {
  try {
    const deleted = await prisma.product.deleteMany({});
    console.log(`Successfully deleted ${deleted.count} products from the database.`);
  } catch (error) {
    console.error("Failed to delete products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllProducts();
