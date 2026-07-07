import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, message: "Kode promo tidak valid." });
    }

    const { getSession } = require("@/lib/session");
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Harap login untuk menggunakan voucher." });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        usages: {
          where: { userId }
        }
      }
    });

    if (!promo) {
      return NextResponse.json({ success: false, message: "Kode promo tidak ditemukan." });
    }

    if (promo.usages && promo.usages.length > 0) {
      return NextResponse.json({ success: false, message: "Anda sudah pernah menggunakan kode promo ini." });
    }


    if (!promo.isActive) {
      return NextResponse.json({ success: false, message: "Kode promo sudah tidak aktif." });
    }

    // Cek expired
    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return NextResponse.json({ success: false, message: "Kode promo sudah kadaluarsa." });
    }

    // Cek max uses
    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ success: false, message: "Kode promo sudah mencapai batas penggunaan." });
    }

    // Cek minimum order
    if (orderTotal < promo.minOrder) {
      const formattedMin = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(promo.minOrder);
      return NextResponse.json({
        success: false,
        message: `Minimum pembelian ${formattedMin} untuk menggunakan kode ini.`,
      });
    }

    // Hitung diskon
    let discountAmount = 0;
    if (promo.discountType === "percent") {
      discountAmount = Math.round((orderTotal * promo.discountValue) / 100);
    } else {
      discountAmount = promo.discountValue;
    }

    // Pastikan diskon tidak melebihi total order
    discountAmount = Math.min(discountAmount, orderTotal);

    return NextResponse.json({
      success: true,
      message: `Kode promo berhasil! Diskon ${promo.discountType === "percent" ? promo.discountValue + "%" : "Rp " + promo.discountValue.toLocaleString("id-ID")} diterapkan.`,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Promo validate error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." });
  }
}
