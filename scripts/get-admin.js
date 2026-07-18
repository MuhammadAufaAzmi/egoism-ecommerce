const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function getAdmin() {
  const u = await prisma.user.findUnique({where:{email:'admin@egoism.local'}});
  console.log(u);
  await prisma.$disconnect();
}
getAdmin();
