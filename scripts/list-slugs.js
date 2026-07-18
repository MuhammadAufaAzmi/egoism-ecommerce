const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function list() {
  const products = await prisma.product.findMany();
  console.log(products.map(p => p.slug));
  await prisma.$disconnect();
}
list();
