"use client";

import { useState } from "react";
import Image from "next/image";

export default function SizeGuide({ fitType }: { fitType?: string | null }) {
  const [open, setOpen] = useState(false);

  let imageSrc = "/size-charts/regular.jpg";

  if (fitType) {
    const ft = fitType.toLowerCase();
    if (ft === "oversized") imageSrc = "/size-charts/oversized.jpg";
    else if (ft === "crop") imageSrc = "/size-charts/crop.jpg";
    else if (ft === "crop-tank") imageSrc = "/size-charts/crop-muscle-tank.jpg";
    else if (ft === "crop-muscle-tank") imageSrc = "/size-charts/crop-muscle-tank.jpg";
    else if (ft === "muscle-tank") imageSrc = "/size-charts/muscle-tank.jpg";
    else if (ft === "women-tank") imageSrc = "/size-charts/women-tank.jpg";
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] tracking-[0.15em] font-semibold text-secondary underline underline-offset-4 hover:text-primary transition-colors uppercase"
      >
        SIZE GUIDE
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-md mx-4 p-4 shadow-2xl animate-fade-in-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/30 pb-2">
              <h3 className="text-[16px] font-bold uppercase tracking-wide text-primary">Size Guide</h3>
              <button onClick={() => setOpen(false)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="relative w-full aspect-[9/16] bg-surface-container-low flex items-center justify-center">
              <Image 
                src={imageSrc} 
                alt="Size Guide" 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            <p className="text-[11px] text-secondary mt-4 leading-relaxed text-center">
              Toleransi ukuran ±1-2 cm.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
