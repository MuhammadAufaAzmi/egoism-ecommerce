import { getSession, clearSession, createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;

    if (!file || !orderId) {
      return NextResponse.json({
        success: false,
        message: "Data tidak lengkap.",
      });
    }

    const session = await getSession();
  const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    // 1. Verifikasi pesanan dan kepemilikan
    const order = await (prisma as any).order.findUnique({
      where: { orderNumber: orderId },
      include: { user: true },
    });

    if (!order || order.userId !== userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak atau pesanan tidak ditemukan." }, { status: 403 });
    }

    // 2. Simpan file gambar ke Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "egoism/payment_proofs",
          format: "webp",
          transformation: [{ quality: "auto:eco" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(buffer);
    });

    const imagePath = uploadResult.secure_url;

    // 3. Update field paymentProof di database
    await (prisma as any).order.update({
      where: { orderNumber: orderId },
      data: {
        paymentProof: imagePath,
        status: "MENUNGGU KONFIRMASI",
      },
    });

    // 4. Kirim email notifikasi ke admin
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const formatRupiah = (angka: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(angka);

    await transporter.sendMail({
      from: `"EGOISM System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[EGOISM] Bukti Transfer Baru — ${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 12px;">Bukti Transfer Masuk</h2>
          <table style="width:100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px; width: 140px;">ORDER ID</td>
              <td style="padding: 8px 0; font-weight: bold;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px;">CUSTOMER</td>
              <td style="padding: 8px 0;">${order?.user?.firstName || "-"} (${order?.user?.email || "-"})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px;">TOTAL</td>
              <td style="padding: 8px 0; font-weight: bold; color: #b45309;">${formatRupiah(order?.total || 0)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 12px;">ITEMS</td>
              <td style="padding: 8px 0; white-space: pre-line; font-size: 13px;">${order?.items || "-"}</td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #555; margin-bottom: 16px;">
            Bukti transfer telah diupload ke Cloudinary: <a href="${imagePath}">Lihat Bukti Transfer</a>. Silakan verifikasi dan update status pesanan di Admin Dashboard.
          </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://egoism-ecommerce.vercel.app"}/admin/pesanan"
             style="display:inline-block; background:#1a1a1a; color:#fff; padding: 12px 24px; text-decoration:none; font-size:12px; letter-spacing:0.1em; text-transform:uppercase;">
            Buka Admin Dashboard →
          </a>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment proof error:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
}
