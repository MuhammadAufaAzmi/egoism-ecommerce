"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function processCheckout() {
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
    let totalAmount = 0;
    let itemsDescription = "";

    cartItems.forEach((item: any) => {
      totalAmount += item.product.price * item.quantity;
      itemsDescription += `${item.product.name} (${item.color}, ${item.size}) x${item.quantity}\n`;
    });

    // 3. Generate Nomor Resi/Order Unik bergaya EGOISM (Cth: EGO-827391)
    const orderNumber =
      "EGO-" + Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Buat pesanan baru di tabel Order MySQL
    await (prisma as any).order.create({
      data: {
        orderNumber: orderNumber,
        userId: userId,
        items: itemsDescription.trim(),
        total: totalAmount,
        status: "MENUNGGU PEMBAYARAN", // Status awal
      },
    });

    // 5. Kosongkan keranjang belanja karena sudah dicheckout
    await (prisma as any).cart.deleteMany({
      where: { userId },
    });

    return { success: true, orderId: orderNumber };
  } catch (error) {
    console.error("Checkout Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat memproses pesanan.",
    };
  }
}
