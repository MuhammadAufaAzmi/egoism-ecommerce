const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findMany();
  const colors = new Set();
  p.forEach(x => {
    try {
      JSON.parse(x.colors).forEach(c => colors.add(c.toUpperCase()));
    } catch(e) {}
  });
  console.log(Array.from(colors));
}
main().finally(() => prisma.$disconnect());
