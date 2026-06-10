import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file yang diunggah" },
        { status: 400 },
      );
    }

    // CEK AUTENTIKASI: Hanya admin yang boleh upload
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Silakan login" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden - Akses ditolak" },
        { status: 403 }
      );
    }

    // Ubah file menjadi buffer data mentah
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload ke Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "egoism/products",
          format: "webp",
          transformation: [
            { width: 1080, height: 1080, crop: "fill", gravity: "auto" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Kembalikan URL Cloudinary
    return NextResponse.json({ success: true, imagePath: uploadResult.secure_url });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan file di server" },
      { status: 500 },
    );
  }
}
