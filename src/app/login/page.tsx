"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", recaptchaToken: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRecaptchaChange = (token: string | null) => {
    setFormData({ ...formData, recaptchaToken: token || "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Token verifikasi ditangani di sisi server melalui loginUser

    const res = await loginUser(formData);

    if (res.success) {
      setMessage({ type: "success", text: res.message });

      setTimeout(() => {
        // FIX: role ada di dalam res.user.role, bukan res.role langsung
        const role = res.user?.role;

        if (role === "ADMIN" || role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh(); // Penting: biar server component baca ulang cookie
      }, 1000);
    } else {
      setMessage({ type: "error", text: res.message });
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col md:flex-row animate-fade-in">
      {/* Left: Image */}
      <section className="hidden md:block md:w-1/2 relative bg-surface min-h-screen animate-fade-in">
        <Image
          src="/login-campaign.png"
          alt="EGOISM Campaign"
          fill
          className="object-cover object-center"
          priority
        />
      </section>

      {/* Right: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 py-12 animate-fade-in-up delay-200">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase mb-2">
              SELAMAT DATANG KEMBALI
            </p>
            <h1 className="text-[40px] leading-[48px] md:text-[48px] md:leading-[56px] font-semibold uppercase tracking-wide">
              MASUK
            </h1>
          </div>

          {message.text && (
            <div
              className={`p-4 mb-6 text-[12px] font-semibold uppercase tracking-wider border rounded-none ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-600"
                  : "bg-red-500/10 border-red-500/30 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-6">
            <Link
              href="/api/auth/google"
              className="w-full border border-primary/30 flex items-center justify-center gap-3 py-4 text-[13px] font-semibold tracking-widest uppercase hover:bg-primary/5 transition-colors duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              LANJUTKAN DENGAN GOOGLE
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-primary/10"></div>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">ATAU</span>
            <div className="h-px flex-1 bg-primary/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase"
              >
                ALAMAT EMAIL
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase"
              >
                KATA SANDI
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
                placeholder="Masukkan kata sandi Anda"
              />
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={handleRecaptchaChange}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-y-0 space-x-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-primary border-primary/30 rounded-none cursor-pointer focus:ring-0 focus:ring-offset-0"
                />
                <label
                  className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant cursor-pointer uppercase"
                  htmlFor="remember"
                >
                  INGAT SAYA
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold underline hover:text-on-surface-variant transition-colors duration-300 uppercase"
              >
                LUPA KATA SANDI?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary text-[14px] tracking-[0.05em] font-medium py-4 mt-8 uppercase tracking-widest hover:opacity-80 transition-opacity duration-300 disabled:opacity-50"
            >
              {loading ? "MEMPROSES..." : "MASUK"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[16px] text-on-surface-variant">
              BELUM PUNYA AKUN?{" "}
              <Link
                href="/register"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold underline text-primary hover:text-on-surface-variant transition-colors duration-300 ml-2 uppercase"
              >
                DAFTAR
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
