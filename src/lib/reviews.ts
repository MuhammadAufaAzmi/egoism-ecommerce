"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function canUserReview(productId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return false;

  // Cek apakah user pernah beli produk ini dan statusnya DITERIMA
  const hasPurchased = await (prisma as any).order.findFirst({
    where: {
      userId,
      status: "DITERIMA",
      // Kita asumsikan items menyimpan nama produk.
      // Jika relasi langsung ke orderItem ada akan lebih akurat, 
      // tapi kita cek dari Cart item logikanya.
      // Untuk EGOISM v1, jika dia punya status DITERIMA kita izinkan (simplified).
    },
  });

  if (!hasPurchased) return false;

  const existingReview = await (prisma as any).review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return !existingReview;
}

export async function addReview(productId: string, rating: number, comment: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return { success: false, message: "Silakan login terlebih dahulu." };
  if (rating < 1 || rating > 5) return { success: false, message: "Rating tidak valid." };

  try {
    await (prisma as any).review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });

    return { success: true, message: "Review berhasil ditambahkan!" };
  } catch (error) {
    console.error("Gagal menambahkan review:", error);
    return { success: false, message: "Gagal menyimpan review." };
  }
}

export async function getProductReviews(productId: string) {
  const reviews = await (prisma as any).review.findMany({
    where: { productId },
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    author: `${r.user.firstName} ${r.user.lastName || ""}`.trim(),
  }));
}
