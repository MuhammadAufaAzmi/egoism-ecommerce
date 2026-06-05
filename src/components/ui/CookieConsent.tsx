"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  const handleDecline = () => {
    // Optionally, handle decline logic
    localStorage.setItem("cookie_consent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-surface-container-lowest border-t border-outline-variant/30 p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 max-w-4xl">
          <h4 className="text-[14px] font-bold uppercase tracking-widest text-primary mb-2">
            Persetujuan Penggunaan Cookie
          </h4>
          <p className="text-[12px] md:text-[13px] text-secondary leading-relaxed">
            Situs ini menggunakan cookie untuk meningkatkan pengalaman Anda dan menganalisis lalu lintas situs. 
            Dengan mengklik "Terima", Anda menyetujui penggunaan cookie kami sesuai dengan{" "}
            <a href="/privacy" className="underline text-primary hover:text-primary/70 transition-colors">
              Kebijakan Privasi
            </a>{" "}
            kami dan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-3 border border-outline-variant/50 text-[11px] font-semibold uppercase tracking-widest text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            Tolak
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-3 bg-primary text-on-primary text-[11px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Terima
          </button>
        </div>
      </div>
    </div>
  );
}
