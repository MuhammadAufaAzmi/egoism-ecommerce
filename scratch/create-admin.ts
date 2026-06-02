import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@egoism.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log("Admin already exists!");
    return;
  }

  const password = await bcrypt.hash("admin123", 10);
  
  await prisma.user.create({
    data: {
      email,
      password,
      firstName: "EGOISM Admin",
      role: "ADMIN"
    }
  });
  
  console.log("✅ Admin created successfully: admin@egoism.local / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
