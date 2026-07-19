"use server";
import { getSession, clearSession, createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { sendOrderCreatedEmail } from "@/lib/email";
import { getProductPrice } from "@/lib/utils";
import crypto from "crypto";

interface CheckoutOptions {
  promoCode?: string;
  shippingZone?: string;
  shippingAddress?: string;
}

export async function processCheckout(options?: CheckoutOptions) {
  try {
    const session = await getSession();
  const userId = session?.userId;

    if (!userId) {
      return { success: false, message: "Silakan login terlebih dahulu." };
    }

    // 1. Ambil isi keranjang belanja user (pre-check)
    const cartItemsPreCheck = await (prisma as any).cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItemsPreCheck.length === 0) {
      return { success: false, message: "Keranjang belanja Anda kosong." };
    }

    // 2. Generate Nomor Order Unik bergaya EGOISM (Cth: EGO-A7B2X)
    const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderNumber = `EGO-${Date.now().toString().slice(-4)}-${randomStr}`;

    // 3. Jalankan SELURUH logika di dalam transaksi untuk mencegah race condition
    const result = await prisma.$transaction(async (tx: any) => {
      // 3a. Re-fetch cart DI DALAM transaksi (atomic check)
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new Error("CART_EMPTY");
      }

      // 3b. Hitung total harga & buat catatan daftar barang
      let subtotal = 0;
      let itemsDescription = "";

      cartItems.forEach((item: any) => {
        const itemPrice = getProductPrice(item.product, item.fitType, item.size);
        subtotal += itemPrice * item.quantity;
        itemsDescription += `${item.product.name} (${item.color}, ${item.size}) x${item.quantity}\n`;
      });

      // 3c. Hitung ongkos kirim secara aman di server
      let shippingCost = 0;
      if (options?.shippingZone) {
        const isJabodetabek = ["DKI JAKARTA", "BANTEN", "JAWA BARAT"].includes(options.shippingZone.toUpperCase());
        if (isJabodetabek) {
          shippingCost = 0;
        } else {
          const zone = await tx.shippingZone.findUnique({
            where: { province: options.shippingZone },
          });
          if (zone) shippingCost = zone.cost;
        }
      }

      // 3d. Hitung diskon promo jika ada (DI DALAM transaksi untuk mencegah race)
      let discountAmount = 0;
      if (options?.promoCode) {
        const promo = await tx.promoCode.findUnique({
          where: { code: options.promoCode.trim().toUpperCase() },
          include: { usages: { where: { userId } } }
        });

        const isActive = promo && promo.isActive;
        const notExpired = promo && (!promo.expiresAt || new Date() <= promo.expiresAt);
        const underMaxUses = promo && (promo.maxUses === 0 || promo.usedCount < promo.maxUses);
        const meetsMinOrder = promo && subtotal >= promo.minOrder;
        const notUsedByUser = promo && (!promo.usages || promo.usages.length === 0);

        if (isActive && notExpired && underMaxUses && meetsMinOrder && notUsedByUser) {
          if (promo.discountType === "percent") {
            discountAmount = Math.round((subtotal * promo.discountValue) / 100);
          } else {
            discountAmount = promo.discountValue;
          }
          discountAmount = Math.min(discountAmount, subtotal);

          // Increment promo usage DI DALAM transaksi (atomic)
          await tx.promoCode.update({
            where: { code: options.promoCode.trim().toUpperCase() },
            data: { usedCount: { increment: 1 } }
          });

          await tx.promoUsage.create({
            data: {
              promoId: promo.id,
              userId: userId,
              orderId: orderNumber
            }
          });
        }
      }

      // 3e. Total Akhir (dengan safety net)
      const totalAmount = Math.max(subtotal - discountAmount + shippingCost, 0);

      // 3f. Buat pesanan baru
      await tx.order.create({
        data: {
          orderNumber: orderNumber,
          userId: userId,
          items: itemsDescription.trim(),
          total: totalAmount,
          shippingCost: shippingCost,
          shippingZone: options?.shippingZone || null,
          shippingAddress: options?.shippingAddress || null,
          status: "MENUNGGU PEMBAYARAN",
        },
      });

      // 3g. Kosongkan keranjang belanja
      await tx.cart.deleteMany({
        where: { userId },
      });

      return { itemsDescription, totalAmount };
    });

    // 4. Kirim email notifikasi ke customer (Asynchronous, non-blocking)
    // TODO: Gunakan sistem Queue atau vendor email khusus seperti BullMQ
    prisma.user.findUnique({ where: { id: userId } })
      .then(async (user: any) => {
        if (user?.email) {
          await sendOrderCreatedEmail(
            user.email,
            user.firstName || "Customer",
            orderNumber,
            result.totalAmount,
            result.itemsDescription.trim()
          );
        }
      })
      .catch((emailErr: any) => {
        console.error("[CRITICAL ALERT] Email notification failed for order " + orderNumber + ":", emailErr);
      });

    return { success: true, orderId: orderNumber };

  } catch (error: any) {
    if (error?.message === "CART_EMPTY") {
      return { success: false, message: "Keranjang belanja Anda kosong." };
    }
    console.error("Checkout Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat memproses pesanan.",
    };
  }
}
