const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function cleanBlanks() {
  const slugsToDelete = [
    'regular-t-shirt', 
    'oversized-t-shirt', 
    'muscle-tank-male', 
    'muscle-tank-female', 
    'crop-tank', 
    'crop-oversize', 
    'crop-regular', 
    'long-sleeve'
  ];
  
  const result = await prisma.product.deleteMany({
    where: {
      slug: { in: slugsToDelete }
    }
  });
  console.log(`Deleted ${result.count} blank template products.`);
  await prisma.$disconnect();
}
cleanBlanks();
