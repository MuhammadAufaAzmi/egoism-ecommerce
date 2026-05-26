"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

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
    const { email, password } = formData;

    if (!email || !password) {
      return { success: false, message: "Email dan password wajib diisi." };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, message: "Email atau password salah!" };
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return { success: false, message: "Email atau password salah!" };
    const cookieStore = await cookies();
    cookieStore.set("user_role", user.role, {
      httpOnly: true, // PERBAIKAN: Mencegah XSS membaca cookie role
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    cookieStore.set("user_id", user.id, {
      httpOnly: true, // PERBAIKAN: Mencegah XSS membaca cookie id
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
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
