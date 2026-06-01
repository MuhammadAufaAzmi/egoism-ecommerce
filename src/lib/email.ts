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
                This is an automated email, please do not reply.
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
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Thank you for shopping at EGOISM. Your order has been successfully created.</p>
      <div style="background-color:#f9f9f6; border:1px solid #e5e5e0; padding:20px; margin:16px 0;">
        <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.15em; color:#8a8a85; text-transform:uppercase; font-weight:600;">
          Order Details
        </p>
        <p style="margin:0 0 4px;"><strong>Order:</strong> ${orderNumber}</p>
        <p style="margin:0 0 4px;"><strong>Total:</strong> ${formatIDR(total)}</p>
        <p style="margin:0 0 4px;"><strong>Items:</strong></p>
        <pre style="margin:0; font-size:12px; color:#4a4a45; white-space:pre-wrap;">${items}</pre>
      </div>
      <p>Please make your payment and upload your payment proof via the payment page.</p>
      <p style="margin-top:16px; font-size:12px; color:#8a8a85;">
        Orders not paid within 24 hours will be automatically cancelled.
      </p>
    `;

    await transporter.sendMail({
      from: `"EGOISM" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order ${orderNumber} — Payment Instructions`,
      html: emailTemplate("New Order Created", body),
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
        subject: "Payment Proof Received",
        message: "We have received your payment proof and it is currently being verified. Please wait up to 1×24 hours.",
      },
      "DIPROSES": {
        subject: "Payment Confirmed — Order Processing",
        message: "Your payment has been verified! Your order is now being processed and prepared by our team.",
      },
      "DIKIRIM": {
        subject: "Order Shipped",
        message: "Your order has been shipped! You can track your shipment status.",
      },
      "DITERIMA": {
        subject: "Order Delivered",
        message: "Your order has been marked as delivered. Thank you for shopping at EGOISM!",
      },
      "DIBATALKAN": {
        subject: "Order Cancelled",
        message: "We're sorry, your order has been cancelled. If you believe this is a mistake, please contact our team.",
      },
    };

    const statusInfo = statusMessages[newStatus];
    if (!statusInfo) return; // Skip jika status tidak dikenali

    const STATUS_DISPLAY: Record<string, string> = {
      "MENUNGGU KONFIRMASI": "AWAITING CONFIRMATION",
      "DIPROSES": "PROCESSING",
      "DIKIRIM": "SHIPPED",
      "DITERIMA": "DELIVERED",
      "DIBATALKAN": "CANCELLED",
    };

    const body = `
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>${statusInfo.message}</p>
      <div style="background-color:#f9f9f6; border:1px solid #e5e5e0; padding:20px; margin:16px 0;">
        <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.15em; color:#8a8a85; text-transform:uppercase; font-weight:600;">
          Order Status
        </p>
        <p style="margin:0 0 4px;"><strong>Order:</strong> ${orderNumber}</p>
        <p style="margin:0;"><strong>Status:</strong> ${STATUS_DISPLAY[newStatus] ?? newStatus}</p>
      </div>
      <p>You can view your order details on the <strong>My Account</strong> page.</p>
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
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>We received a request to reset the password for your EGOISM account.</p>
      <div style="text-align:center; margin:24px 0;">
        <a href="${resetLink}" style="display:inline-block; background-color:#1a1a18; color:#f5f5f0; text-decoration:none; padding:14px 32px; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600;">
          RESET PASSWORD
        </a>
      </div>
      <p style="font-size:12px; color:#8a8a85;">
        This link is valid for 1 hour. If you didn't request a password reset, please ignore this email.
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
