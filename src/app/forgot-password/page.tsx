"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await requestPasswordReset(email);
    setMessage({ type: res.success ? "success" : "error", text: res.message });
    if (res.success) setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-24 bg-surface-container-lowest">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <p className="text-[12px] tracking-[0.1em] font-semibold text-secondary uppercase mb-2">
            ACCOUNT RECOVERY
          </p>
          <h1 className="text-[40px] md:text-[48px] font-semibold uppercase tracking-wide text-primary">
            FORGOT PASSWORD
          </h1>
        </div>

        {sent ? (
          <div className="space-y-6">
            <div className="p-5 bg-green-950/20 border border-green-500/50 text-green-400 text-[13px]">
              <p className="font-semibold mb-1">Email Terkirim!</p>
              <p>{message.text}</p>
            </div>
            <Link
              href="/login"
              className="block w-full bg-primary text-on-primary text-center text-[13px] tracking-[0.15em] font-semibold py-4 uppercase hover:opacity-80 transition-opacity"
            >
              KEMBALI KE LOGIN
            </Link>
          </div>
        ) : (
          <>
            {message.text && (
              <div className={`p-4 mb-6 text-[12px] font-semibold uppercase tracking-wider border ${
                message.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-600" : "bg-green-500/10 border-green-500/30 text-green-600"
              }`}>
                {message.text}
              </div>
            )}

            <p className="text-[14px] text-secondary mb-8">
              Masukkan email yang terdaftar di akun Anda. Kami akan mengirimkan link untuk mereset password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-[12px] tracking-[0.1em] font-semibold text-secondary uppercase">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors text-primary"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary text-[14px] tracking-widest font-medium py-4 uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-[12px] tracking-[0.1em] font-semibold underline text-secondary hover:text-primary transition-colors uppercase"
              >
                BACK TO LOGIN
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
