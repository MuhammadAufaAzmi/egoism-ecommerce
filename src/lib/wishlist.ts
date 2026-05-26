"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function toggleWishlist(productId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return { success: false, message: "Silakan Sign In terlebih dahulu." };
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      revalidatePath("/wishlist");
      return { success: true, isWishlisted: false, message: "Dihapus dari wishlist." };
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath("/wishlist");
      return { success: true, isWishlisted: true, message: "Ditambahkan ke wishlist." };
    }
  } catch (error) {
    console.error("Wishlist error:", error);
    return { success: false, message: "Terjadi kesalahan." };
  }
}

export async function getWishlist() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return [];

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return wishlist.map((item: any) => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category,
      },
    }));
  } catch (error) {
    console.error("Get Wishlist error:", error);
    return [];
  }
}

export async function checkIsWishlisted(productId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return false;

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!existing;
  } catch (error) {
    return false;
  }
}
