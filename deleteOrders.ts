import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const orderCount = await prisma.order.count();
  console.log(`Ditemukan ${orderCount} pesanan.`);

  if (orderCount > 0) {
    const deleted = await prisma.order.deleteMany({});
    console.log(`Berhasil menghapus ${deleted.count} pesanan.`);
  } else {
    console.log('Tidak ada pesanan yang perlu dihapus.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
