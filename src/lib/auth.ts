"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { createSession } from "@/lib/session";

// === REGISTRASI ===
export async function registerUser(formData: any) {
  try {
    const { name, email, password } = formData;
    
    if (!name || name.trim().length < 2) {
      return { success: false, message: "Nama harus diisi (minimal 2 karakter)." };
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return { success: false, message: "Format email tidak valid." };
    }
    if (!password || password.length < 6) {
      return { success: false, message: "Password minimal 6 karakter." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return { success: false, message: "Email ini sudah digunakan!" };
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { firstName: name, email, password: hashedPassword, role: "USER" },
    });
    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal membuat akun." };
  }
}

// === LOGIN ===
export async function loginUser(formData: any) {
  try {
    const { email, password, recaptchaToken } = formData;

    if (!email || !password) {
      return { success: false, message: "Email dan password wajib diisi." };
    }

    if (!recaptchaToken) {
      return { success: false, message: "Harap selesaikan verifikasi CAPTCHA." };
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (secretKey) {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
      const recaptchaData = await recaptchaRes.json();

      if (!recaptchaData.success) {
        return { success: false, message: "Verifikasi CAPTCHA gagal. Silakan coba lagi." };
      }
    } else {
      console.warn("RECAPTCHA_SECRET_KEY tidak ditemukan di environment. Mengabaikan verifikasi CAPTCHA.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, message: "Email atau password salah!" };
    
    // Detect Google OAuth accounts (sentinel password)
    if (!user.password || user.password.startsWith("GOOGLE_OAUTH::")) {
      return { success: false, message: "This account uses Google Sign-In. Please click 'Continue with Google'." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return { success: false, message: "Email atau password salah!" };
      
    // BUAT SESI JWT AMAN
    await createSession(user.id, user.role);

    return {
      success: true,
      message: `Selamat datang kembali, ${user.firstName || "User"}!`,
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan sistem saat login." };
  }
}

// === FORGOT PASSWORD ===
export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true, message: "Jika email terdaftar, instruksi reset password telah dikirim." };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: resetExpiry,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, user.firstName || "User", resetToken);

    return { success: true, message: "Jika email terdaftar, instruksi reset password telah dikirim." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

// === RESET PASSWORD ===
export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      return { success: false, message: "Token reset tidak valid atau sudah kadaluarsa." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true, message: "Password berhasil direset! Silakan login." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal mereset password." };
  }
}

// === CHANGE PASSWORD ===
import { getSession } from "@/lib/session";

export async function changePassword(currentPass: string, newPass: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    
    if (!userId) return { success: false, message: "Sesi telah berakhir. Silakan login ulang." };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, message: "User tidak ditemukan." };

    if (!user.password) {
      return { success: false, message: "Akun ini didaftarkan via Google. Password tidak dapat diubah dari sini." };
    }

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) return { success: false, message: "Password lama salah." };

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password berhasil diubah." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan server saat mengubah password." };
  }
}
