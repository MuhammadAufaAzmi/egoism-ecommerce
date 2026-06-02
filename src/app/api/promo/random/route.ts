import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Ensure it's not cached so we get a random one each time

export async function GET() {
  try {
    // Cari semua promo code yang aktif dan belum expired
    const activePromos = await prisma.promoCode.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
    });

    if (activePromos.length === 0) {
      return NextResponse.json({ success: false, message: "No active promo codes available" });
    }

    // Pilih 1 promo code secara acak
    const randomPromo = activePromos[Math.floor(Math.random() * activePromos.length)];

    return NextResponse.json({
      success: true,
      promo: {
        code: randomPromo.code,
        discountType: randomPromo.discountType,
        discountValue: randomPromo.discountValue,
        minOrder: randomPromo.minOrder,
      }
    });
  } catch (error) {
    console.error("Error fetching random promo:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
