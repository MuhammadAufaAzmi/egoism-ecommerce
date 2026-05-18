import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

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

    // Ubah file menjadi buffer data mentah
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan folder tujuan penyimpanan (public/uploads/)
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Buat foldernya secara otomatis jika belum ada di dalam proyek kamu
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Bersihkan nama file dari spasi karakter aneh agar URL aman
    const safeFileName =
      Date.now() + "-" + file.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = path.join(uploadDir, safeFileName);

    // Tulis/simpan file fisik ke folder public/uploads
    await fs.promises.writeFile(filePath, buffer);

    // Kembalikan alamat path string yang nantinya dimasukkan ke MySQL
    const dbImagePathPath = `/uploads/${safeFileName}`;

    return NextResponse.json({ success: true, imagePath: dbImagePathPath });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan file di server" },
      { status: 500 },
    );
  }
}
