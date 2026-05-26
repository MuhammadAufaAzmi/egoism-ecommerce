import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/shipping/zones — ambil semua zona pengiriman
// GET /api/shipping/zones?province=Banten — ambil zona untuk provinsi tertentu
export async function GET(req: NextRequest) {
  try {
    const province = req.nextUrl.searchParams.get("province");

    if (province) {
      // Cari zona berdasarkan nama provinsi
      const zone = await (prisma as any).shippingZone.findUnique({
        where: { province },
      });

      if (!zone) {
        return NextResponse.json(
          { success: false, message: "Provinsi tidak ditemukan." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, zone });
    }

    // Ambil semua zona (untuk dropdown provinsi)
    const zones = await (prisma as any).shippingZone.findMany({
      orderBy: { province: "asc" },
    });

    return NextResponse.json({ success: true, zones });
  } catch (error) {
    console.error("Shipping Zone Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
