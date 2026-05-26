"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Password tidak cocok." });
      return;
    }
    setLoading(true);
    const res = await resetPassword(token, password);
    setMessage({ type: res.success ? "success" : "error", text: res.message });
    if (res.success) setDone(true);
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-surface-container-lowest">
        <div className="text-center">
          <p className="text-secondary text-[14px] mb-4">Token reset password tidak valid.</p>
          <Link href="/forgot-password" className="text-[12px] tracking-widest uppercase underline text-primary">
            REQUEST NEW LINK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-24 bg-surface-container-lowest">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <p className="text-[12px] tracking-[0.1em] font-semibold text-secondary uppercase mb-2">
            ACCOUNT RECOVERY
          </p>
          <h1 className="text-[40px] md:text-[48px] font-semibold uppercase tracking-wide text-primary">
            RESET PASSWORD
          </h1>
        </div>

        {done ? (
          <div className="space-y-6">
            <div className="p-5 bg-green-950/20 border border-green-500/50 text-green-400 text-[13px]">
              <p>{message.text}</p>
            </div>
            <Link href="/login" className="block w-full bg-primary text-on-primary text-center text-[13px] tracking-[0.15em] font-semibold py-4 uppercase hover:opacity-80 transition-opacity">
              LOGIN SEKARANG
            </Link>
          </div>
        ) : (
          <>
            {message.text && (
              <div className={`p-4 mb-6 text-[12px] font-semibold uppercase tracking-wider border ${
                message.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-600" : ""
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-[12px] tracking-[0.1em] font-semibold text-secondary uppercase">NEW PASSWORD</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors text-primary"
                  placeholder="Minimum 6 characters" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[12px] tracking-[0.1em] font-semibold text-secondary uppercase">CONFIRM PASSWORD</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors text-primary"
                  placeholder="Re-enter your password" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-on-primary text-[14px] tracking-widest font-medium py-4 uppercase hover:opacity-80 transition-opacity disabled:opacity-50">
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest text-secondary text-[12px] uppercase tracking-widest">
        LOADING...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
