"use client";

import React, { useRef, useEffect } from "react";

export default function ParallaxHero({ children }: { children: React.ReactNode }) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Move bg at 40% of scroll speed — classic parallax
      bg.style.transform = `translateY(${scrollY * 0.4}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 w-full h-full will-change-transform">
      {children}
    </div>
  );
}
