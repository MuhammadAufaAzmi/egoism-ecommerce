const { PrismaClient } = require('@prisma/client');

// Simulate what Vercel production does - use the production DATABASE_URL with pgbouncer
// We force it to use the direct URL to check
const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres.brvpretwjqyqpslaxgfe:M6tK%23Nih3jtHfY2@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
});

async function main() {
  try {
    const check = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'User';
    `;
    
    console.log("Columns via PgBouncer (port 6543):");
    check.forEach(row => console.log("- " + row.column_name));
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
