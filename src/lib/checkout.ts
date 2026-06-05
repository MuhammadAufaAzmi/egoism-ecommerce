"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { sendOrderCreatedEmail } from "@/lib/email";
import crypto from "crypto";

interface CheckoutOptions {
  promoCode?: string;
  shippingZone?: string;
  shippingAddress?: string;
}

export async function processCheckout(options?: CheckoutOptions) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return { success: false, message: "Silakan login terlebih dahulu." };
    }

    // 1. Ambil isi keranjang belanja user
    const cartItems = await (prisma as any).cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { success: false, message: "Keranjang belanja Anda kosong." };
    }

    // 2. Hitung total harga & buat catatan daftar barang
    let subtotal = 0;
    let itemsDescription = "";

    cartItems.forEach((item: any) => {
      subtotal += item.product.price * item.quantity;
      itemsDescription += `${item.product.name} (${item.color}, ${item.size}) x${item.quantity}\n`;
    });

    // 3. Hitung ongkos kirim secara aman di server
    let shippingCost = 0;
    if (options?.shippingZone) {
      const zone = await (prisma as any).shippingZone.findUnique({
        where: { province: options.shippingZone },
      });
      if (zone) shippingCost = zone.cost;
    }

    // 4. Hitung diskon promo jika ada
    let discountAmount = 0;
    if (options?.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: options.promoCode.trim().toUpperCase() },
      });
      
      const isActive = promo && promo.isActive;
      const notExpired = promo && (!promo.expiresAt || new Date() <= promo.expiresAt);
      const underMaxUses = promo && (promo.maxUses === 0 || promo.usedCount < promo.maxUses);
      const meetsMinOrder = promo && subtotal >= promo.minOrder;

      if (isActive && notExpired && underMaxUses && meetsMinOrder) {
        if (promo.discountType === "percent") {
          discountAmount = Math.round((subtotal * promo.discountValue) / 100);
        } else {
          discountAmount = promo.discountValue;
        }
        discountAmount = Math.min(discountAmount, subtotal);
        
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    // 5. Total Akhir
    const totalAmount = subtotal - discountAmount + shippingCost;

    // 6. Generate Nomor Resi/Order Unik bergaya EGOISM (Cth: EGO-A7B2X)
    const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderNumber = `EGO-${Date.now().toString().slice(-4)}-${randomStr}`;

    // 7. Buat pesanan baru di tabel Order MySQL
    await (prisma as any).order.create({
      data: {
        orderNumber: orderNumber,
        userId: userId,
        items: itemsDescription.trim(),
        total: totalAmount,
        shippingCost: shippingCost,
        shippingZone: options?.shippingZone || null,
        shippingAddress: options?.shippingAddress || null,
        status: "MENUNGGU PEMBAYARAN", // Status awal
      },
    });

    // 8. Kosongkan keranjang belanja karena sudah dicheckout
    await (prisma as any).cart.deleteMany({
      where: { userId },
    });

    // 9. Kirim email notifikasi ke customer
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await sendOrderCreatedEmail(
          user.email,
          user.firstName || "Customer",
          orderNumber,
          totalAmount,
          itemsDescription.trim()
        );
      }
    } catch (emailErr) {
      console.error("Email notification failed (non-blocking):", emailErr);
    }

    return { success: true, orderId: orderNumber };
  } catch (error) {
    console.error("Checkout Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat memproses pesanan.",
    };
  }
}
