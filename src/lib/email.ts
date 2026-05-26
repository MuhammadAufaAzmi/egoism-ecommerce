"use server";

import nodemailer from "nodemailer";

// Konfigurasi SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Template email on-brand EGOISM
function emailTemplate(title: string, body: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f5f5f0; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e5e5e0;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px; border-bottom:1px solid #e5e5e0; text-align:center;">
              <h1 style="margin:0; font-size:24px; font-weight:700; letter-spacing:0.2em; color:#1a1a18; text-transform:uppercase;">
                EGOISM
              </h1>
            </td>
          </tr>
          <!-- Title -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h2 style="margin:0; font-size:18px; font-weight:700; letter-spacing:0.1em; color:#1a1a18; text-transform:uppercase;">
                ${title}
              </h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 40px 32px; font-size:14px; line-height:1.7; color:#4a4a45;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; border-top:1px solid #e5e5e0; text-align:center;">
              <p style="margin:0; font-size:11px; letter-spacing:0.15em; color:#8a8a85; text-transform:uppercase;">
                EGOISM — Luxury Minimalist Fashion
              </p>
              <p style="margin:8px 0 0; font-size:11px; color:#8a8a85;">
                Email ini dikirim otomatis, tidak perlu dibalas.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Kirim email saat order baru dibuat
export async function sendOrderCreatedEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  total: number,
  items: string
) {
  try {
    const body = `
      <p>Halo <strong>${customerName}</strong>,</p>
      <p>Terima kasih telah berbelanja di EGOISM. Pesanan Anda telah berhasil dibuat.</p>
      <div style="background-color:#f9f9f6; border:1px solid #e5e5e0; padding:20px; margin:16px 0;">
        <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.15em; color:#8a8a85; text-transform:uppercase; font-weight:600;">
          Detail Pesanan
        </p>
        <p style="margin:0 0 4px;"><strong>Order:</strong> ${orderNumber}</p>
        <p style="margin:0 0 4px;"><strong>Total:</strong> ${formatIDR(total)}</p>
        <p style="margin:0 0 4px;"><strong>Items:</strong></p>
        <pre style="margin:0; font-size:12px; color:#4a4a45; white-space:pre-wrap;">${items}</pre>
      </div>
      <p>Silakan lakukan pembayaran dan upload bukti transfer Anda melalui halaman pembayaran.</p>
      <p style="margin-top:16px; font-size:12px; color:#8a8a85;">
        Pesanan yang tidak dibayar dalam 24 jam akan otomatis dibatalkan.
      </p>
    `;

    await transporter.sendMail({
      from: `"EGOISM" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Pesanan ${orderNumber} — Instruksi Pembayaran`,
      html: emailTemplate("Pesanan Baru Dibuat", body),
    });

    console.log(`[Email] Order created email sent to ${customerEmail}`);
  } catch (error) {
    console.error("[Email] Failed to send order created email:", error);
    // Jangan throw error — email gagal tidak boleh menggagalkan checkout
  }
}

// Kirim email saat status order berubah
export async function sendOrderStatusEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  newStatus: string
) {
  try {
    const statusMessages: Record<string, { subject: string; message: string }> = {
      "MENUNGGU KONFIRMASI": {
        subject: "Bukti Pembayaran Diterima",
        message: "Bukti pembayaran Anda telah kami terima dan sedang dalam proses verifikasi. Mohon tunggu maksimal 1×24 jam.",
      },
      "DIPROSES": {
        subject: "Pembayaran Dikonfirmasi — Pesanan Diproses",
        message: "Pembayaran Anda telah terverifikasi! Pesanan Anda sekarang sedang diproses dan dibuatkan oleh tim kami.",
      },
      "DIKIRIM": {
        subject: "Pesanan Dikirim",
        message: "Pesanan Anda telah dikirim! Silakan pantau status pengiriman Anda.",
      },
      "DITERIMA": {
        subject: "Pesanan Selesai",
        message: "Pesanan Anda telah ditandai sebagai diterima. Terima kasih telah berbelanja di EGOISM!",
      },
      "DIBATALKAN": {
        subject: "Pesanan Dibatalkan",
        message: "Mohon maaf, pesanan Anda telah dibatalkan. Jika Anda merasa ini adalah kesalahan, silakan hubungi tim kami.",
      },
    };

    const statusInfo = statusMessages[newStatus];
    if (!statusInfo) return; // Skip jika status tidak dikenali

    const body = `
      <p>Halo <strong>${customerName}</strong>,</p>
      <p>${statusInfo.message}</p>
      <div style="background-color:#f9f9f6; border:1px solid #e5e5e0; padding:20px; margin:16px 0;">
        <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.15em; color:#8a8a85; text-transform:uppercase; font-weight:600;">
          Status Pesanan
        </p>
        <p style="margin:0 0 4px;"><strong>Order:</strong> ${orderNumber}</p>
        <p style="margin:0;"><strong>Status:</strong> ${newStatus}</p>
      </div>
      <p>Anda dapat melihat detail pesanan di halaman <strong>My Account</strong>.</p>
    `;

    await transporter.sendMail({
      from: `"EGOISM" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${orderNumber} — ${statusInfo.subject}`,
      html: emailTemplate(statusInfo.subject, body),
    });

    console.log(`[Email] Status update email sent to ${customerEmail} (${newStatus})`);
  } catch (error) {
    console.error("[Email] Failed to send status email:", error);
  }
}

// Kirim email reset password
export async function sendPasswordResetEmail(
  customerEmail: string,
  customerName: string,
  resetToken: string
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    const body = `
      <p>Halo <strong>${customerName}</strong>,</p>
      <p>Kami menerima permintaan untuk mereset password akun EGOISM Anda.</p>
      <div style="text-align:center; margin:24px 0;">
        <a href="${resetLink}" style="display:inline-block; background-color:#1a1a18; color:#f5f5f0; text-decoration:none; padding:14px 32px; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600;">
          RESET PASSWORD
        </a>
      </div>
      <p style="font-size:12px; color:#8a8a85;">
        Link ini berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
      </p>
    `;

    await transporter.sendMail({
      from: `"EGOISM" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: "EGOISM — Reset Password",
      html: emailTemplate("Reset Password", body),
    });

    console.log(`[Email] Password reset email sent to ${customerEmail}`);
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
  }
}
