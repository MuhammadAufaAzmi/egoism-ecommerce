import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    const order = await (prisma as any).order.findUnique({
      where: { orderNumber: orderId },
      select: {
        userId: true,
        orderNumber: true,
        items: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // IDOR Check
    if (session.role !== "ADMIN" && order.userId !== session.userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden." },
        { status: 403 }
      );
    }

    // Exclude userId from response if needed, but not strictly required
    const { userId, ...orderData } = order;

    return NextResponse.json({ success: true, order: orderData });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
