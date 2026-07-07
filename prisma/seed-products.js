const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productsData = [
  {
    name: "REGULAR T-SHIRT",
    slug: "regular-t-shirt",
    price: 175000,
    category: "unisex",
    image: "", // Placeholder or you can update later
    description: "Regular fit\nCombed 30s",
    sizes: JSON.stringify({
      "regular": ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"]
    }),
    fitType: JSON.stringify(["regular"]),
    colors: JSON.stringify([{ name: "BLACK", image: "" }, { name: "WHITE", image: "" }]),
    priceOverrides: JSON.stringify({
      "regular": {
        "XXL": 180000,
        "3XL": 180000,
        "4XL": 190000,
        "5XL": 195000
      }
    }),
    isNew: true
  },
  {
    name: "OVERSIZED T-SHIRT",
    slug: "oversized-t-shirt",
    price: 225000,
    category: "unisex",
    image: "",
    description: "Oversize\nMaterial : 24s combed",
    sizes: JSON.stringify({
      "oversize": ["M", "L", "XL", "XXL"]
    }),
    fitType: JSON.stringify(["oversize"]),
    colors: JSON.stringify([{ name: "BLACK", image: "" }]),
    priceOverrides: JSON.stringify({
      "oversize": {
        "XXL": 235000
      }
    }),
    isNew: true
  },
  {
    name: "MUSCLE TANK MALE",
    slug: "muscle-tank-male",
    price: 175000,
    category: "men",
    image: "",
    description: "Muscle tank man\nMaterial : Cotton Combed 30S",
    sizes: JSON.stringify({
      "muscle-tank": ["M", "L", "XL", "XXL", "3XL", "4XL"]
    }),
    fitType: JSON.stringify(["muscle-tank"]),
    colors: JSON.stringify([{ name: "BLACK", image: "" }]),
    priceOverrides: JSON.stringify({
      "muscle-tank": {
        "XXL": 180000,
        "3XL": 180000,
        "4XL": 190000
      }
    }),
    isNew: true
  },
  {
    name: "MUSCLE TANK FEMALE",
    slug: "muscle-tank-female",
    price: 175000,
    category: "women",
    image: "",
    description: "Muscle tank female\nMaterials : Cotton combed 30s",
    sizes: JSON.stringify({
      "women-tank": ["S", "M"]
    }),
    fitType: JSON.stringify(["women-tank"]),
    colors: JSON.stringify([{ name: "WHITE", image: "" }]),
    priceOverrides: JSON.stringify({}),
    isNew: true
  },
  {
    name: "CROP TANK",
    slug: "crop-tank",
    price: 165000,
    category: "women",
    image: "",
    description: "Crop tank\nMaterials : Cotton combed 24s",
    sizes: JSON.stringify({
      "crop-tank": ["S", "M", "L"]
    }),
    fitType: JSON.stringify(["crop-tank"]),
    colors: JSON.stringify([{ name: "BLACK", image: "" }]),
    priceOverrides: JSON.stringify({}),
    isNew: true
  },
  {
    name: "CROP OVERSIZE",
    slug: "crop-oversize",
    price: 170000,
    category: "women",
    image: "",
    description: "Crop oversize\nMaterial: Cotton Combed 30s",
    sizes: JSON.stringify({
      "crop-oversize": ["M", "L", "XL"]
    }),
    fitType: JSON.stringify(["crop-oversize"]),
    colors: JSON.stringify([{ name: "WHITE", image: "" }]),
    priceOverrides: JSON.stringify({}),
    isNew: true
  },
  {
    name: "CROP REGULAR",
    slug: "crop-regular",
    price: 165000,
    category: "women",
    image: "",
    description: "Crop REG tshirt\nMaterial: Cotton Combed 30s",
    sizes: JSON.stringify({
      "crop": ["S", "M", "L", "XL", "XXL"]
    }),
    fitType: JSON.stringify(["crop"]),
    colors: JSON.stringify([{ name: "BLACK", image: "" }]),
    priceOverrides: JSON.stringify({}),
    isNew: true
  },
  {
    name: "LONG SLEEVE",
    slug: "long-sleeve",
    price: 180000,
    category: "unisex",
    image: "",
    description: "Long Sleeve\nMaterial : Cotton combed 30s",
    sizes: JSON.stringify({
      "long-sleeve": ["S", "M", "L", "XL"]
    }),
    fitType: JSON.stringify(["long-sleeve"]),
    colors: JSON.stringify([{ name: "BLACK", image: "" }]),
    priceOverrides: JSON.stringify({}),
    isNew: true
  }
];

async function main() {
  console.log("🌱 Seeding Egoism products...");

  for (const product of productsData) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { slug: product.slug },
        data: product
      });
      console.log(`Updated ${product.name}`);
    } else {
      await prisma.product.create({
        data: product
      });
      console.log(`Created ${product.name}`);
    }
  }

  console.log(`✅ ${productsData.length} products seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
