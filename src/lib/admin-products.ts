"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  return user?.role === "ADMIN";
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper untuk mengekstrak public_id dari URL Cloudinary
function extractPublicId(url: string) {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

// === ADMIN: UPDATE PRODUK ===
export async function updateProduct(slug: string, input: any) {
  if (!(await verifyAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

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
  if (!(await verifyAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return { success: false, message: "Produk tidak ditemukan." };
    }

    // 1. Ekstrak public_id dari gambar utama
    const publicIdsToDelete: string[] = [];
    const mainImageId = extractPublicId(product.image);
    if (mainImageId) publicIdsToDelete.push(mainImageId);

    // 2. Ekstrak public_id dari gambar galeri
    try {
      const gallery = JSON.parse(product.images);
      if (Array.isArray(gallery)) {
        gallery.forEach((url: string) => {
          const id = extractPublicId(url);
          if (id) publicIdsToDelete.push(id);
        });
      }
    } catch (e) {
      console.error("Gagal parse gambar galeri:", e);
    }

    // 3. Hapus gambar dari Cloudinary
    for (const publicId of publicIdsToDelete) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error(`Gagal menghapus gambar ${publicId} dari Cloudinary:`, err);
      }
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
