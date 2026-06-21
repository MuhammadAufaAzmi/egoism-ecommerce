"use server";
import { getSession, clearSession, createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { sendOrderStatusEmail } from "@/lib/email";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url: string) {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
// Fungsi keamanan untuk memastikan hanya ADMIN yang bisa mengeksekusi
async function verifyAdmin() {
  const session = await getSession();
  const userId = session?.userId;
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

  // Jalankan semua query berat secara bersamaan dalam Promise.all (Aggregate sangat cepat di DB)
  const [
    totalOrders,
    totalProducts,
    totalUsers,
    monthlyOrdersCount,
    revenueAgg,
    monthlyRevenueAgg,
    recentOrdersData
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    
    // Total Revenue (excluding cancelled)
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "DIBATALKAN" } }
    }),
    
    // Monthly Revenue (excluding cancelled)
    prisma.order.aggregate({
      _sum: { total: true },
      where: { 
        status: { not: "DIBATALKAN" },
        createdAt: { gte: startOfMonth }
      }
    }),

    // 5 Recent Orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    })
  ]);

  const totalRevenue = revenueAgg._sum.total || 0;
  const monthlyRevenue = monthlyRevenueAgg._sum.total || 0;

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    formattedRevenue: formatIDR(totalRevenue),
    monthlyOrdersCount,
    monthlyRevenue,
    formattedMonthlyRevenue: formatIDR(monthlyRevenue),
    recentOrders: recentOrdersData.map((o: any) => ({
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
    shippingAddress: o.shippingAddress || "-",
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

export async function deleteOrder(orderId: string) {
  if (!(await verifyAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const order = await (prisma as any).order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    // Ekstrak public_id dari gambar bukti pembayaran (jika ada)
    const publicId = extractPublicId(order.paymentProof);
    
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error(`Gagal menghapus gambar ${publicId} dari Cloudinary:`, err);
      }
    }

    // Hapus pesanan dari database
    await (prisma as any).order.delete({
      where: { id: orderId }
    });

    return { success: true, message: "Pesanan berhasil dihapus!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghapus pesanan." };
  }
}

export async function deleteAllOrders() {
  if (!(await verifyAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Cari semua pesanan yang punya paymentProof untuk dihapus dari Cloudinary
    const ordersWithProof = await (prisma as any).order.findMany({
      where: {
        paymentProof: { not: null }
      },
      select: { paymentProof: true }
    });

    for (const order of ordersWithProof) {
      if (order.paymentProof) {
        const publicId = extractPublicId(order.paymentProof);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error(`Gagal menghapus gambar ${publicId} dari Cloudinary:`, err);
          }
        }
      }
    }

    // Hapus semua pesanan dari database
    const deleted = await (prisma as any).order.deleteMany({});

    return { success: true, message: `Berhasil menghapus ${deleted.count} pesanan secara permanen.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghapus semua pesanan." };
  }
}
