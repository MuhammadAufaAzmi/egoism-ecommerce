const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRICE_MAP = {
  "regular tshirt": {
    "sizes": ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"],
    "prices": {
      "S": 175000, "M": 175000, "L": 175000, "XL": 175000,
      "XXL": 180000, "3XL": 180000,
      "4XL": 190000,
      "5XL": 195000
    }
  },
  "oversized tshirt": {
    "sizes": ["M", "L", "XL", "XXL"],
    "prices": {
      "M": 225000, "L": 225000, "XL": 225000,
      "XXL": 235000
    }
  },
  "muscle tank female": {
    "sizes": ["S", "M"],
    "prices": {
      "S": 175000, "M": 175000
    }
  },
  "muscle tank male": {
    "sizes": ["M", "L", "XL", "XXL"],
    "prices": {
      "M": 175000, "L": 175000, "XL": 175000,
      "XXL": 180000
    }
  },
  "muscle tank": { // Fallback if no gender specified
    "sizes": ["M", "L", "XL", "XXL"],
    "prices": {
      "M": 175000, "L": 175000, "XL": 175000,
      "XXL": 180000
    }
  },
  "crop tank": {
    "sizes": ["S", "M", "L"],
    "prices": {
      "S": 165000, "M": 165000, "L": 165000
    }
  },
  "crop oversize": {
    "sizes": ["M", "L", "XL"],
    "prices": {
      "M": 170000, "L": 170000, "XL": 170000
    }
  },
  "crop oversized tshirt": { // Alias based on folder name
    "sizes": ["M", "L", "XL"],
    "prices": {
      "M": 170000, "L": 170000, "XL": 170000
    }
  },
  "crop regular": {
    "sizes": ["M", "L", "XL", "XXL"],
    "prices": {
      "M": 165000, "L": 165000, "XL": 165000, "XXL": 170000
    }
  },
  "crop regular fit": { // Alias based on folder name
    "sizes": ["M", "L", "XL", "XXL"],
    "prices": {
      "M": 165000, "L": 165000, "XL": 165000, "XXL": 170000
    }
  },
  "long sleeve": {
    "sizes": ["S", "M", "L", "XL"],
    "prices": {
      "S": 180000, "M": 180000, "L": 180000, "XL": 180000
    }
  }
};

async function main() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    let fitTypes = [];
    try {
      fitTypes = JSON.parse(product.fitType);
    } catch(e) {
      fitTypes = [];
    }
    
    let basePrice = Infinity;
    const priceOverrides = {};
    const productSizesObj = {};
    
    for (const fitType of fitTypes) {
      const normalizedFit = fitType.toLowerCase().trim();
      
      let mapping = PRICE_MAP[normalizedFit];
      if (!mapping) {
         // Try finding fallback
         if (normalizedFit.includes("regular")) mapping = PRICE_MAP["regular tshirt"];
         else if (normalizedFit.includes("oversize") && !normalizedFit.includes("crop")) mapping = PRICE_MAP["oversized tshirt"];
         else if (normalizedFit.includes("crop") && normalizedFit.includes("oversize")) mapping = PRICE_MAP["crop oversize"];
         else if (normalizedFit.includes("crop") && (normalizedFit.includes("regular") || normalizedFit.includes("fit"))) mapping = PRICE_MAP["crop regular"];
         else if (normalizedFit.includes("muscle") || normalizedFit.includes("tank")) mapping = PRICE_MAP["muscle tank male"];
         else mapping = PRICE_MAP["regular tshirt"]; // absolute fallback
      }
      
      priceOverrides[normalizedFit] = mapping.prices;
      productSizesObj[fitType] = mapping.sizes;
      
      for (const size in mapping.prices) {
         const p = mapping.prices[size];
         if (p < basePrice) {
            basePrice = p;
         }
      }
    }
    
    if (basePrice === Infinity) {
       basePrice = 175000;
    }
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        price: basePrice,
        sizes: JSON.stringify(productSizesObj),
        priceOverrides: JSON.stringify(priceOverrides)
      }
    });
    
    console.log(`Updated ${product.name}: Base Price -> ${basePrice}`);
  }
  
  console.log("Pricing updated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
