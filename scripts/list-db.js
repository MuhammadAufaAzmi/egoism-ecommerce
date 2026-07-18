const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function list() {
  const p = await prisma.product.findMany();
  console.log(p.map(x => x.name));
  await prisma.$disconnect();
}
list();
