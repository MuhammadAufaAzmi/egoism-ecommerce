const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function cleanBlanks() {
  const products = await prisma.product.findMany();
  const blanks = products.filter(r => !r.slug.includes('hyrox') && !r.slug.includes('sled') && !r.slug.includes('wallballs'));
  
  for (const b of blanks) {
    await prisma.product.delete({ where: { id: b.id } });
  }
  
  console.log(`Deleted ${blanks.length} blank template products.`);
  await prisma.$disconnect();
}
cleanBlanks();
