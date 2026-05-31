"use server";

import { prisma } from "@/lib/prisma";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type { Product };

// === HELPER ===
const parseProduct = (p: any) => {
  const parsedFitType = (function () {
    try {
      const parsed = p.fitType ? JSON.parse(p.fitType) : ["regular"];
      return Array.isArray(parsed) ? parsed : [p.fitType];
    } catch {
      // Legacy fallback jika di DB tersimpan sebagai string biasa "regular"
      return [p.fitType || "regular"];
    }
  })();

  const parsedSizes = (function() {
    try {
      if (!p.sizes) return {};
      const parsed = JSON.parse(p.sizes);
      if (Array.isArray(parsed)) {
        // Legacy fallback: map the array to all available fit types
        const fallbackObj: Record<string, string[]> = {};
        parsedFitType.forEach((fit: string) => {
          fallbackObj[fit] = parsed;
        });
        return fallbackObj;
      }
      return parsed as Record<string, string[]>;
    } catch {
      return {};
    }
  })();

  return {
    ...p,
    sizes: parsedSizes,
    colors: p.colors ? (JSON.parse(p.colors) as string[]) : [],
    images: p.images ? (JSON.parse(p.images) as string[]) : [],
    activity: p.activity ? (JSON.parse(p.activity) as string[]) : [],
    fitType: parsedFitType,
  };
};

// === LOGIKA PRODUK ===
export const getProducts = async () => {
  const dbProducts = await prisma.product.findMany();
  return dbProducts.map(parseProduct);
};

export const getProductBySlug = async (slug: string) => {
  // PERBAIKAN: Menambahkan ': any' untuk membungkam cache error TypeScript bawaan VS Code
  const p: any = await prisma.product.findUnique({
    where: { slug },
  });
  if (!p) return null;
  return parseProduct(p);
};

export const getRelatedProducts = async (currentSlug: string, category: string, limit: number = 4) => {
  const dbProducts = await prisma.product.findMany({
    where: {
      category,
      NOT: { slug: currentSlug },
    },
    take: limit,
  });
  return dbProducts.map(parseProduct);
};

export const getProductsByCategory = async (category: "men" | "women") => {
  const dbProducts = await prisma.product.findMany({
    where: {
      OR: [{ category: category }, { category: "unisex" }],
    },
  });
  return dbProducts.map(parseProduct);
};

export const getValidRecentProducts = async (ids: string[]) => {
  try {
    const valid = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true, name: true, price: true, image: true }
    });
    return valid;
  } catch {
    return [];
  }
};

export const formatPrice = async (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export async function createProduct(input: any) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: input.slug },
    });
    if (existingProduct) {
      return {
        success: false,
        message: "Error: Slug sudah digunakan oleh produk lain!",
      };
    }
    await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        price: Number(input.price),
        category: input.category,
        image: input.image,
        description: input.description,
        sizes: JSON.stringify(input.sizes),
        colors: JSON.stringify(input.colors),
        images: JSON.stringify(input.images || []),
        fitType: JSON.stringify(input.fitType || ["regular"]),
        activity: JSON.stringify(input.activity || []),
        isNew: input.isNew ?? true,
      },
    });
    revalidatePath("/");
    revalidatePath("/koleksi");
    return {
      success: true,
      message: "Produk baru berhasil ditambahkan ke database!",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan database." };
  }
}

// === LOGIKA KERANJANG BELANJA (CART DATABASE) ===

export async function getCartItems(userId: string) {
  try {
    const cartData = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    return cartData.map((item: any) => ({
      id: item.id,
      name: item.product.name,
      color: item.color,
      size: item.size,
      fitType: item.fitType,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      productId: item.productId,
    }));
  } catch (error) {
    console.error("Get Cart Error:", error);
    return [];
  }
}

export async function handleUpdateCartQuantity(
  cartId: string,
  currentQty: number,
  delta: number,
) {
  const targetQty = currentQty + delta;
  try {
    if (targetQty <= 0) {
      await prisma.cart.delete({ where: { id: cartId } });
    } else {
      await prisma.cart.update({
        where: { id: cartId },
        data: { quantity: targetQty },
      });
    }
    revalidatePath("/keranjang");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function handleRemoveCartItem(cartId: string) {
  try {
    await prisma.cart.delete({ where: { id: cartId } });
    revalidatePath("/keranjang");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function handleAddToCart(
  productId: string,
  size: string,
  color: string,
  fitType: string = "regular",
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return { success: false, message: "Silakan Sign In terlebih dahulu." };
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: userId,
        productId: productId,
        size: size,
        color: color,
        fitType: fitType,
      },
    });

    if (existingCartItem) {
      await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    } else {
      await prisma.cart.create({
        data: {
          userId: userId,
          productId: productId,
          size: size,
          color: color,
          fitType: fitType,
          quantity: 1,
        },
      });
    }

    revalidatePath("/keranjang");
    return { success: true, message: "Garment added to bag." };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, message: "Terjadi gangguan sistem database." };
  }
}
