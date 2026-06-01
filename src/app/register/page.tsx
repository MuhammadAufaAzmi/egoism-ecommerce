"use client";

import React, { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setMessage({ type: "error", text: "Password harus memiliki minimal 8 karakter." });
      return;
    }
    
    if (!/\d/.test(formData.password)) {
      setMessage({ type: "error", text: "Password harus mengandung setidaknya 1 angka." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const res = await registerUser(formData);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setFormData({ name: "", email: "", password: "" });
    } else {
      setMessage({ type: "error", text: res.message });
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex items-center justify-center px-6 md:px-16 py-24">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase mb-2">
            START YOUR JOURNEY
          </p>
          <h1 className="text-[40px] leading-[48px] md:text-[48px] md:leading-[56px] font-semibold uppercase tracking-wide">
            CREATE ACCOUNT
          </h1>
        </div>

        {/* Notifikasi Status Masuk Database */}
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

        {/* Form Pendaftaran */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="name"
              className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase"
            >
              FULL NAME
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="email"
              className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase"
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
              className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="password"
              className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant uppercase"
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
              className="w-full bg-transparent border-b border-primary/30 text-[15px] py-3 focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-primary"
              placeholder="Minimal 8 karakter & 1 angka"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary text-[14px] tracking-[0.05em] font-medium py-4 mt-8 uppercase tracking-widest hover:opacity-80 transition-opacity duration-300 disabled:opacity-50"
          >
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>
        </form>

        {/* Navigasi Balik ke Login */}
        <div className="mt-12 text-center">
          <p className="text-[16px] text-on-surface-variant uppercase">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link
              href="/login"
              className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold underline text-primary hover:text-on-surface-variant transition-colors duration-300 ml-2 uppercase"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
