"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PromoData {
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
}

export default function PromoPopup() {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Jangan muncul di halaman khusus (Admin, Auth, Payment)
    if (
      pathname?.startsWith("/admin") ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password" ||
      pathname?.startsWith("/payment")
    ) {
      return;
    }

    // Cek apakah popup sudah pernah ditutup di sesi ini
    const hasSeenPromo = sessionStorage.getItem("promoPopupShown");
    if (hasSeenPromo === "true") return;

    const fetchPromo = async () => {
      try {
        const res = await fetch("/api/promo/random");
        const data = await res.json();
        
        if (data.success && data.promo) {
          setPromo(data.promo);
          // Tunda kemunculan popup 3 detik setelah data dimuat
          setTimeout(() => {
            setShow(true);
          }, 3000);
        }
      } catch (error) {
        console.error("Failed to fetch random promo:", error);
      }
    };

    fetchPromo();
  }, [pathname]);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("promoPopupShown", "true");
  };

  const handleCopy = () => {
    if (!promo) return;
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!show || !promo) return null;

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#1a1a18]/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-[400px] bg-surface-container-lowest shadow-2xl p-8 md:p-10 text-center animate-in zoom-in-95 duration-500 overflow-hidden">
        
        {/* Dekorasi Garis Atas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        {/* Tombol Tutup */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container/50"
          aria-label="Tutup promo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header EGOISM */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-[10px] font-bold tracking-[0.25em] text-secondary uppercase mb-2">
            EXCLUSIVE FOR YOU
          </span>
          <h2 className="text-[20px] font-bold tracking-[0.2em] text-primary uppercase">
            SPECIAL OFFER
          </h2>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <p className="text-[36px] font-medium text-primary uppercase leading-none mb-4">
            {promo.discountType === "percent" 
              ? `${promo.discountValue}% OFF` 
              : `${formatIDR(promo.discountValue)} OFF`}
          </p>
          <p className="text-[12px] leading-relaxed text-secondary px-2">
            {promo.minOrder > 0 
              ? `Gunakan kode di bawah ini untuk menikmati potongan harga dengan minimal pembelanjaan ${formatIDR(promo.minOrder)}.` 
              : "Gunakan kode di bawah ini untuk menikmati potongan harga tanpa minimal pembelanjaan."}
          </p>
        </div>

        {/* Promo Code Box */}
        <div className="bg-background border border-primary p-4 mb-8 flex flex-col items-center justify-center relative">
          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">YOUR VOUCHER CODE</p>
          <p className="text-[22px] font-bold tracking-[0.15em] text-primary uppercase">
            {promo.code}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleCopy}
            className={`w-full py-4 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
              copied 
                ? "bg-green-600 text-white" 
                : "bg-primary text-on-primary hover:opacity-90"
            }`}
          >
            {copied ? "✓ KODE BERHASIL DISALIN" : "SALIN KODE DISKON"}
          </button>
          
          <Link 
            href="/koleksi"
            onClick={handleClose}
            className="w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-primary hover:text-secondary transition-colors"
          >
            NANTI SAJA
          </Link>
        </div>

      </div>
    </div>
  );
}
