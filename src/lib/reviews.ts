"use server";
import { getSession, clearSession, createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function canUserReview(productId: string) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return false;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true },
  });

  if (!product) return false;

  // Cek apakah user pernah beli produk ini dan statusnya DITERIMA
  const hasPurchased = await (prisma as any).order.findFirst({
    where: {
      userId,
      status: "DITERIMA",
      items: {
        contains: product.name,
      }
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
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { success: false, message: "Silakan login terlebih dahulu." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, message: "Rating tidak valid." };
  }

  const sanitizedComment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    await (prisma as any).review.create({
      data: {
        userId,
        productId,
        rating,
        comment: sanitizedComment,
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
