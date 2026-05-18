"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Fungsi keamanan untuk memastikan hanya ADMIN yang bisa mengeksekusi
async function verifyAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("user_role")?.value === "ADMIN";
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
    status: o.status,
    customerName:
      `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim() ||
      "Unknown",
    customerEmail: o.user?.email || "No Email",
  }));
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  if (!(await verifyAdmin()))
    return { success: false, message: "Unauthorized" };

  try {
    await (prisma as any).order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal memperbarui status pesanan." };
  }
}
