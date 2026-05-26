import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Auto-cancel orders yang statusnya masih "MENUNGGU PEMBAYARAN" setelah 24 jam
export async function POST() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const expiredOrders = await (prisma as any).order.updateMany({
      where: {
        status: "MENUNGGU PEMBAYARAN",
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
      data: {
        status: "DIBATALKAN",
      },
    });

    return NextResponse.json({
      success: true,
      cancelled: expiredOrders.count,
      message: `${expiredOrders.count} pesanan otomatis dibatalkan karena tidak dibayar dalam 24 jam.`,
    });
  } catch (error) {
    console.error("Auto-cancel error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

// GET endpoint juga tersedia untuk kemudahan pemanggilan
export async function GET() {
  return POST();
}
