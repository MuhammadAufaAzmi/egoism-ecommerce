"use client";

import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-on-primary flex items-center justify-center shadow-lg hover:opacity-80 transition-all duration-300 animate-fade-in-up"
      aria-label="Back to top"
    >
      <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
    </button>
  );
}
