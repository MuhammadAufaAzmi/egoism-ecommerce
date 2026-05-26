import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const shippingZones = [
  // JABODETABEK — Rp 10.000, 1-2 hari
  { zone: "JABODETABEK", province: "DKI Jakarta",  cost: 10000, etd: "1-2 hari" },
  { zone: "JABODETABEK", province: "Banten",       cost: 10000, etd: "1-2 hari" },

  // JAWA — Rp 20.000, 2-4 hari
  { zone: "JAWA", province: "Jawa Barat",    cost: 20000, etd: "2-4 hari" },
  { zone: "JAWA", province: "Jawa Tengah",   cost: 20000, etd: "2-4 hari" },
  { zone: "JAWA", province: "Jawa Timur",    cost: 20000, etd: "2-4 hari" },
  { zone: "JAWA", province: "DI Yogyakarta", cost: 20000, etd: "2-4 hari" },

  // BALI & NUSA TENGGARA — Rp 30.000, 3-5 hari
  { zone: "BALI & NUSA TENGGARA", province: "Bali",                    cost: 30000, etd: "3-5 hari" },
  { zone: "BALI & NUSA TENGGARA", province: "Nusa Tenggara Barat",     cost: 30000, etd: "3-5 hari" },
  { zone: "BALI & NUSA TENGGARA", province: "Nusa Tenggara Timur",     cost: 30000, etd: "3-5 hari" },

  // SUMATERA — Rp 30.000, 3-5 hari
  { zone: "SUMATERA", province: "Aceh",                    cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Sumatera Utara",          cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Sumatera Barat",          cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Riau",                    cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Kepulauan Riau",          cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Jambi",                   cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Sumatera Selatan",        cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Bengkulu",                cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Lampung",                 cost: 30000, etd: "3-5 hari" },
  { zone: "SUMATERA", province: "Kepulauan Bangka Belitung", cost: 30000, etd: "3-5 hari" },

  // KALIMANTAN — Rp 35.000, 3-5 hari
  { zone: "KALIMANTAN", province: "Kalimantan Barat",   cost: 35000, etd: "3-5 hari" },
  { zone: "KALIMANTAN", province: "Kalimantan Tengah",  cost: 35000, etd: "3-5 hari" },
  { zone: "KALIMANTAN", province: "Kalimantan Selatan", cost: 35000, etd: "3-5 hari" },
  { zone: "KALIMANTAN", province: "Kalimantan Timur",   cost: 35000, etd: "3-5 hari" },
  { zone: "KALIMANTAN", province: "Kalimantan Utara",   cost: 35000, etd: "3-5 hari" },

  // SULAWESI — Rp 35.000, 4-6 hari
  { zone: "SULAWESI", province: "Sulawesi Utara",    cost: 35000, etd: "4-6 hari" },
  { zone: "SULAWESI", province: "Sulawesi Tengah",   cost: 35000, etd: "4-6 hari" },
  { zone: "SULAWESI", province: "Sulawesi Selatan",  cost: 35000, etd: "4-6 hari" },
  { zone: "SULAWESI", province: "Sulawesi Tenggara", cost: 35000, etd: "4-6 hari" },
  { zone: "SULAWESI", province: "Gorontalo",         cost: 35000, etd: "4-6 hari" },
  { zone: "SULAWESI", province: "Sulawesi Barat",    cost: 35000, etd: "4-6 hari" },

  // MALUKU & PAPUA — Rp 40.000, 5-7 hari
  { zone: "MALUKU & PAPUA", province: "Maluku",           cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Maluku Utara",     cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Papua",            cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Papua Barat",      cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Papua Selatan",    cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Papua Tengah",     cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Papua Pegunungan", cost: 40000, etd: "5-7 hari" },
  { zone: "MALUKU & PAPUA", province: "Papua Barat Daya", cost: 40000, etd: "5-7 hari" },
];

async function main() {
  console.log("🌱 Seeding shipping zones...");

  // Hapus data lama
  await (prisma as any).shippingZone.deleteMany();

  // Insert semua zona
  for (const zone of shippingZones) {
    await (prisma as any).shippingZone.create({ data: zone });
  }

  console.log(`✅ ${shippingZones.length} provinsi berhasil di-seed!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
