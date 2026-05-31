"use client";

import { useState } from "react";

const sizeChartsData: Record<string, { label: string, columns: string[], data: Record<string, string>[] }> = {
  "oversized": {
    label: "OVERSIZED T-SHIRT",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "M", lebar: "53", panjang: "72" },
      { size: "L", lebar: "57", panjang: "74" },
      { size: "XL", lebar: "60", panjang: "75" },
      { size: "XXL", lebar: "63", panjang: "77" },
    ]
  },
  "regular": {
    label: "REGULAR T-SHIRT",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "S", lebar: "45", panjang: "68" },
      { size: "M", lebar: "47", panjang: "70" },
      { size: "L", lebar: "50", panjang: "72" },
      { size: "XL", lebar: "53", panjang: "74" },
      { size: "XXL", lebar: "56", panjang: "75" },
      { size: "3XL", lebar: "59", panjang: "76" },
      { size: "4XL", lebar: "61", panjang: "80" },
      { size: "5XL", lebar: "63", panjang: "81" },
    ]
  },
  "crop-muscle-tank": {
    label: "CROP MUSCLE TANK",
    columns: ["SIZE", "LEBAR DADA", "PANJANG"],
    data: [
      { size: "S", lebar: "42", panjang: "35" },
      { size: "M", lebar: "46", panjang: "38" },
      { size: "L", lebar: "50", panjang: "41" },
    ]
  },
  "muscle-tank": {
    label: "MUSCLE TANK",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "M", lebar: "49", panjang: "69" },
      { size: "L", lebar: "52", panjang: "72" },
      { size: "XL", lebar: "56", panjang: "74" },
      { size: "XXL", lebar: "56", panjang: "74" },
      { size: "4XL", lebar: "60", panjang: "76" },
    ]
  },
  "women-tank": {
    label: "MUSCLE TANK FEMALE",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "S", lebar: "47", panjang: "56" },
      { size: "M", lebar: "51", panjang: "60" },
    ]
  },
  "crop": {
    label: "CROP REGULAR FIT",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "M", lebar: "42", panjang: "84" },
      { size: "L", lebar: "44", panjang: "88" },
      { size: "XL", lebar: "48", panjang: "92" },
      { size: "XXL", lebar: "50", panjang: "94" },
    ]
  },
  "crop-oversize": {
    label: "CROP OVERSIZE",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "M", lebar: "90", panjang: "43" },
      { size: "L", lebar: "96", panjang: "47" },
      { size: "XL", lebar: "100", panjang: "52" },
    ]
  },
  "long-sleeve": {
    label: "LONG SLEEVE",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "S", lebar: "45", panjang: "68" },
      { size: "M", lebar: "47", panjang: "70" },
      { size: "L", lebar: "50", panjang: "72" },
      { size: "XL", lebar: "53", panjang: "74" },
      { size: "XXL", lebar: "56", panjang: "75" },
    ]
  }
};

export default function SizeGuide({ fitType }: { fitType?: string | null }) {
  const [open, setOpen] = useState(false);

  let activeChart = sizeChartsData["regular"];

  if (fitType) {
    const ft = fitType.toLowerCase();
    if (ft === "oversized") activeChart = sizeChartsData["oversized"];
    else if (ft === "crop") activeChart = sizeChartsData["crop"];
    else if (ft === "crop-oversize") activeChart = sizeChartsData["crop-oversize"];
    else if (ft === "crop-tank") activeChart = sizeChartsData["crop-muscle-tank"];
    else if (ft === "crop-muscle-tank") activeChart = sizeChartsData["crop-muscle-tank"];
    else if (ft === "muscle-tank") activeChart = sizeChartsData["muscle-tank"];
    else if (ft === "women-tank") activeChart = sizeChartsData["women-tank"];
    else if (ft === "long-sleeve") activeChart = sizeChartsData["long-sleeve"];
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg mx-4 p-8 shadow-2xl animate-fade-in-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
              <h3 className="text-[18px] font-bold uppercase tracking-wide text-primary">
                Size Guide <span className="text-secondary text-[14px] font-normal tracking-normal ml-2">({activeChart.label})</span>
              </h3>
              <button onClick={() => setOpen(false)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[11px] tracking-[0.15em] font-semibold text-secondary uppercase mb-4">
              Measurements in cm
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/50">
                    {activeChart.columns.map((col, idx) => (
                      <th key={idx} className={`py-4 px-3 font-bold uppercase tracking-wider text-primary ${idx === 0 ? "text-left" : "text-center"}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeChart.data.map((row, idx) => (
                    <tr key={idx} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-3 font-bold text-primary">{row.size}</td>
                      <td className="py-4 px-3 text-center text-secondary">{row.lebar}</td>
                      <td className="py-4 px-3 text-center text-secondary">{row.panjang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-secondary mt-6 leading-relaxed">
              Toleransi ukuran ±1-2 cm. Jika berada di antara 2 ukuran, kami sarankan memilih ukuran yang lebih besar untuk fit yang lebih nyaman.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
