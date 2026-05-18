"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/products";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Memanggil fungsi pencocokan password bcrypt di database MySQL
    const res = await loginUser(formData);

    if (res.success) {
      setMessage({ type: "success", text: res.message });

      // Berikan jeda 1 detik agar user bisa melihat pesan sukses, lalu lempar ke beranda utama
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } else {
      setMessage({ type: "error", text: res.message });
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col md:flex-row">
      {/* Left: Image */}
      <section className="hidden md:block md:w-1/2 relative bg-surface min-h-screen">
        <Image
          src="https://lh3.googleusercontent.com/aida/ADBb0uhPIIa2a5nE7-lSzvtYjosuJpeYb7uGScYyc_NCsbwUTAiW40Xz2N-73IPeG8Wm2U_5_n1iox3fO20naK35wNyaGoHu5cPHegF0H37H49AIoqJlfsGAZns-haI2xw5PZR7vHIY_bFeBOVM3nlOXrBIbtp8sHX7gphXPMwv3TseYU8xfNc6mYZCQDdPMlvDo17eDkOuHiuSSOYzPjXL6m2fne1Xo98-VEyKn1oS9H7aZ3-rbzjH5xEIQTA"
          alt="EGOISM Campaign"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Right: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-on-surface-variant uppercase mb-2">
              WELCOME BACK
            </p>
            <h1 className="font-['Playfair_Display'] text-[40px] leading-[48px] md:text-[48px] md:leading-[56px] font-semibold uppercase tracking-wide">
              SIGN IN
            </h1>
          </div>

          {/* Kotak Info Status Autentikasi */}
          {message.text && (
            <div
              className={`p-4 mb-6 text-[12px] font-['Inter'] font-semibold uppercase tracking-wider border rounded-none ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-600"
                  : "bg-red-500/10 border-red-500/30 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-on-surface-variant uppercase"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-primary/30 font-['Inter'] text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-on-surface-variant uppercase"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-primary/30 font-['Inter'] text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
                placeholder="Enter your password"
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
                  className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-on-surface-variant cursor-pointer uppercase"
                  htmlFor="remember"
                >
                  REMEMBER ME
                </label>
              </div>
              <a
                href="#"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] underline hover:text-on-surface-variant transition-colors duration-300 uppercase"
              >
                FORGOT PASSWORD?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-['Inter'] text-[14px] tracking-[0.05em] font-medium py-4 mt-8 uppercase tracking-widest hover:opacity-80 transition-opacity duration-300 disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[16px] font-['Inter'] text-on-surface-variant">
              DON&apos;T HAVE AN ACCOUNT?{" "}
              <Link
                href="/register"
                className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] underline text-primary hover:text-on-surface-variant transition-colors duration-300 ml-2 uppercase"
              >
                REGISTER
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
