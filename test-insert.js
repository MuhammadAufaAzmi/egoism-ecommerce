const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test_google_oauth_123@example.com",
        firstName: "Google User",
        provider: "GOOGLE",
        role: "USER"
      }
    });
    console.log("Successfully created:", user);
    
    await prisma.user.delete({ where: { id: user.id } });
    console.log("Cleanup successful");
  } catch (error) {
    console.error("Prisma Error:", error);
  }
}

main().finally(() => prisma.$disconnect());
