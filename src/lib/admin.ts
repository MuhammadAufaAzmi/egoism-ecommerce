"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { sendOrderStatusEmail } from "@/lib/email";

// Fungsi keamanan untuk memastikan hanya ADMIN yang bisa mengeksekusi
async function verifyAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  return user?.role === "ADMIN";
}

export async function getAdminAnalytics() {
  if (!(await verifyAdmin())) return null;

  const orders = await (prisma as any).order.findMany();
  
  const totalOrders = orders.length;
  
  // Hitung total revenue hanya dari pesanan yang tidak dibatalkan
  const totalRevenue = orders
    .filter((o: any) => o.status !== "DIBATALKAN")
    .reduce((sum: number, o: any) => sum + o.total, 0);

  const formattedRevenue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalRevenue);

  return { totalOrders, formattedRevenue };
}

export async function getAllOrders() {
  if (!(await verifyAdmin())) return [];

  const orders = await (prisma as any).order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    date: new Date(o.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: o.items,
    total: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(o.total),
    totalRaw: o.total,
    status: o.status,
    paymentProof: o.paymentProof || null,
    customerName:
      `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim() ||
      "Unknown",
    customerEmail: o.user?.email || "No Email",
    customerPhone: o.user?.phone || "-",
    trackingNumber: o.trackingNumber || "",
  }));
}

export async function updateOrderStatus(orderId: string, newStatus: string, trackingNumber?: string) {
  if (!(await verifyAdmin()))
    return { success: false, message: "Unauthorized" };

  try {
    const updateData: any = { status: newStatus };
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    await (prisma as any).order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Kirim email notifikasi ke customer
    try {
      const order = await (prisma as any).order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });
      if (order?.user?.email) {
        await sendOrderStatusEmail(
          order.user.email,
          order.user.firstName || "Customer",
          order.orderNumber,
          newStatus
        );
      }
    } catch (emailErr) {
      console.error("Email notification failed (non-blocking):", emailErr);
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal memperbarui status pesanan." };
  }
}

// Otomatis batalkan pesanan yang statusnya masih "MENUNGGU PEMBAYARAN" setelah 24 jam
export async function cancelExpiredOrders() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await (prisma as any).order.updateMany({
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

    if (result.count > 0) {
      console.log(
        `[Auto-Cancel] ${result.count} pesanan dibatalkan otomatis karena tidak dibayar dalam 24 jam.`
      );
    }

    return { success: true, cancelled: result.count };
  } catch (error) {
    console.error("[Auto-Cancel] Error:", error);
    return { success: false, cancelled: 0 };
  }
}

