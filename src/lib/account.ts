"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value;
}

// FITUR PROFIL
export async function getUserProfile() {
  const userId = await getUserId();
  if (!userId) return null;
  // Menambahkan pengaman 'any' agar TypeScript tidak komplain soal cache lama
  const user: any = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    memberSince: new Date(user.createdAt).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    }),
  };
}

export async function updateUserProfile(data: any) {
  const userId = await getUserId();
  if (!userId) return { success: false };
  await (prisma.user as any).update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
  });
  return { success: true };
}

// FITUR ALAMAT PENGIRIMAN
export async function getUserAddresses() {
  const userId = await getUserId();
  if (!userId) return [];
  return await (prisma as any).address.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function saveUserAddress(data: any, addressId?: string) {
  const userId = await getUserId();
  if (!userId) return { success: false };
  if (addressId) {
    await (prisma as any).address.update({ where: { id: addressId }, data });
  } else {
    const count = await (prisma as any).address.count({ where: { userId } });
    await (prisma as any).address.create({
      data: { ...data, userId, isDefault: count === 0 },
    });
  }
  return { success: true };
}

export async function deleteUserAddress(addressId: string) {
  await (prisma as any).address.delete({ where: { id: addressId } });
  return { success: true };
}

export async function setAddressDefault(addressId: string) {
  const userId = await getUserId();
  if (!userId) return { success: false };
  await (prisma as any).address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });
  await (prisma as any).address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
  return { success: true };
}

// FITUR RIWAYAT PESANAN
export async function getUserOrders() {
  const userId = await getUserId();
  if (!userId) return [];
  const orders = await (prisma as any).order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Menambahkan 'any' pada parameter 'o' agar error map hilang
  return orders.map((o: any) => ({
    id: o.orderNumber,
    date: new Date(o.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    items: o.items,
    total: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(o.total),
    status: o.status,
  }));
}
