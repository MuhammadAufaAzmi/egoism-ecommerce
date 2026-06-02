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
    // Jangan muncul di halaman admin
    if (pathname?.startsWith("/admin")) return;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-background/80 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant/30 shadow-2xl p-8 md:p-10 text-center animate-in zoom-in-95 duration-500">
        
        {/* Tombol Tutup */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
          aria-label="Tutup promo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header EGOISM */}
        <h2 className="text-[14px] font-bold tracking-[0.2em] text-primary uppercase mb-6">
          SPECIAL OFFER
        </h2>

        {/* Main Content */}
        <div className="mb-8">
          <p className="text-[32px] font-medium text-primary uppercase leading-tight mb-3">
            {promo.discountType === "percent" 
              ? `${promo.discountValue}% OFF` 
              : `${formatIDR(promo.discountValue)} OFF`}
          </p>
          <p className="text-[13px] text-secondary">
            {promo.minOrder > 0 
              ? `Berlaku untuk minimal pembelian ${formatIDR(promo.minOrder)}.` 
              : "Berlaku untuk semua pembelian tanpa minimal belanja."}
          </p>
        </div>

        {/* Promo Code Box */}
        <div className="bg-surface-container/20 border border-dashed border-primary/50 p-4 mb-6 relative group">
          <p className="text-[20px] font-bold tracking-widest text-primary uppercase">
            {promo.code}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleCopy}
            className={`w-full py-4 text-[13px] font-bold uppercase tracking-widest transition-all duration-300 ${
              copied 
                ? "bg-green-600 text-white border-transparent" 
                : "bg-primary text-on-primary hover:opacity-80"
            }`}
          >
            {copied ? "KODE TERSALIN!" : "SALIN KODE DISKON"}
          </button>
          
          <Link 
            href="/koleksi"
            onClick={handleClose}
            className="w-full py-4 text-[13px] font-bold uppercase tracking-widest text-primary border border-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            BELANJA SEKARANG
          </Link>
        </div>

      </div>
    </div>
  );
}
