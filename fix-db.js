const { PrismaClient } = require('@prisma/client');

// Force use DIRECT_URL to bypass PgBouncer
process.env.DATABASE_URL = process.env.DIRECT_URL;

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if column exists first
    const check = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'provider';
    `;
    
    console.log("Column check result:", check);
    
    if (check.length === 0) {
      console.log("Column 'provider' does NOT exist. Adding it now...");
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT DEFAULT 'CREDENTIALS';`;
      console.log("SUCCESS: Column 'provider' added!");
    } else {
      console.log("Column 'provider' already EXISTS in this DB.");
    }
    
    // Also make password nullable
    await prisma.$executeRaw`ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;`;
    console.log("SUCCESS: password column is now nullable!");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
