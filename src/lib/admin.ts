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

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [orders, totalProducts, totalUsers, monthlyOrders] = await Promise.all([
    (prisma as any).order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "USER" } }),
    (prisma as any).order.findMany({
      where: { createdAt: { gte: startOfMonth } },
    }),
  ]);

  const totalOrders = orders.length;

  // Revenue total (exclude cancelled)
  const totalRevenue = orders
    .filter((o: any) => o.status !== "DIBATALKAN")
    .reduce((sum: number, o: any) => sum + o.total, 0);

  // Revenue bulan ini
  const monthlyRevenue = monthlyOrders
    .filter((o: any) => o.status !== "DIBATALKAN")
    .reduce((sum: number, o: any) => sum + o.total, 0);

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  // 5 recent orders
  const recentOrders = await (prisma as any).order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true, email: true } } },
  });

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    formattedRevenue: formatIDR(totalRevenue),
    monthlyOrdersCount: monthlyOrders.length,
    monthlyRevenue,
    formattedMonthlyRevenue: formatIDR(monthlyRevenue),
    recentOrders: recentOrders.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: formatIDR(o.total),
      date: new Date(o.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      customer: `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim() || o.user?.email || "—",
    })),
  };
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

