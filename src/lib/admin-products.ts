"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// === ADMIN: UPDATE PRODUK ===
export async function updateProduct(slug: string, input: any) {
  try {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      return { success: false, message: "Produk tidak ditemukan." };
    }

    if (input.slug && input.slug !== slug) {
      const duplicate = await prisma.product.findUnique({ where: { slug: input.slug } });
      if (duplicate) {
        return { success: false, message: "Slug sudah digunakan oleh produk lain." };
      }
    }

    await prisma.product.update({
      where: { slug },
      data: {
        name: input.name,
        slug: input.slug || slug,
        price: Number(input.price),
        category: input.category,
        image: input.image || existing.image,
        description: input.description,
        sizes: JSON.stringify(input.sizes),
        colors: JSON.stringify(input.colors),
        images: input.images ? JSON.stringify(input.images) : existing.images,
        fitType: input.fitType ? JSON.stringify(input.fitType) : existing.fitType,
        activity: input.activity ? JSON.stringify(input.activity) : existing.activity,
        isNew: input.isNew ?? existing.isNew,
      },
    });

    revalidatePath("/");
    revalidatePath("/koleksi");
    revalidatePath(`/produk/${slug}`);
    if (input.slug && input.slug !== slug) {
      revalidatePath(`/produk/${input.slug}`);
    }

    return { success: true, message: "Produk berhasil diperbarui!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal memperbarui produk." };
  }
}

// === ADMIN: HAPUS PRODUK ===
export async function deleteProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return { success: false, message: "Produk tidak ditemukan." };
    }

    await prisma.cart.deleteMany({ where: { productId: product.id } });
    await prisma.product.delete({ where: { slug } });

    revalidatePath("/");
    revalidatePath("/koleksi");

    return { success: true, message: "Produk berhasil dihapus!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghapus produk." };
  }
}
