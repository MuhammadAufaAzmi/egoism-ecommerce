"use client";

import { useState } from "react";

const sizeChartsData: Record<string, { label: string, columns: string[], data: Record<string, string>[], notes?: string }> = {
  "regular": {
    label: "REGULAR FIT",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "S", lebar: "48", panjang: "68" },
      { size: "M", lebar: "50", panjang: "70" },
      { size: "L", lebar: "52", panjang: "72" },
      { size: "XL", lebar: "54", panjang: "74" },
      { size: "XXL", lebar: "56", panjang: "76" },
      { size: "3XL", lebar: "58", panjang: "79" },
      { size: "4XL", lebar: "61", panjang: "80" },
      { size: "5XL", lebar: "63", panjang: "81" },
    ],
    notes: "Combed 30s."
  },
  "oversized": {
    label: "OVERSIZE",
    columns: ["SIZE", "LEBAR", "PANJANG"],
    data: [
      { size: "M", lebar: "53", panjang: "72" },
      { size: "L", lebar: "57", panjang: "74" },
      { size: "XL", lebar: "60", panjang: "75" },
      { size: "XXL", lebar: "63", panjang: "77" },
    ],
    notes: "Material: 24s combed."
  },
  "muscle-tank": {
    label: "MUSCLE TANK MAN",
    columns: ["SIZE", "LEBAR DADA", "PANJANG KAOS"],
    data: [
      { size: "M", lebar: "47", panjang: "67" },
      { size: "L", lebar: "49", panjang: "69" },
      { size: "XL", lebar: "52", panjang: "72" },
      { size: "XXL", lebar: "56", panjang: "74" },
    ],
    notes: "Material: Cotton Combed 30S. Rekomendasi Berat Badan: M (50-60Kg), L (61-70Kg), XL (71-85Kg), XXL (86-110Kg)."
  },
  "long-sleeve": {
    label: "LONG SLEEVE",
    columns: ["SIZE", "LEBAR DADA", "PANJANG BADAN"],
    data: [
      { size: "S", lebar: "45", panjang: "68" },
      { size: "M", lebar: "48", panjang: "70" },
      { size: "L", lebar: "51", panjang: "73" },
      { size: "XL", lebar: "54", panjang: "74" },
    ],
    notes: "Material: Cotton combed 30s. Rekomendasi Berat: S (40-48kg), M (50-60kg), L (60-75kg)."
  },
  "crop-tank": {
    label: "CROP TANK",
    columns: ["SIZE", "LEBAR DADA", "PANJANG"],
    data: [
      { size: "S", lebar: "42", panjang: "35" },
      { size: "M", lebar: "46", panjang: "38" },
      { size: "L", lebar: "50", panjang: "41" },
    ],
    notes: "Materials: Cotton combed 24s."
  },
  "women-tank": {
    label: "MUSCLE TANK FEMALE",
    columns: ["SIZE", "LEBAR DADA", "PANJANG"],
    data: [
      { size: "S", lebar: "47", panjang: "51" },
      { size: "M", lebar: "56", panjang: "60" },
    ],
    notes: "Materials: Cotton combed 30s."
  },
  "crop": {
    label: "CROP REG TSHIRT",
    columns: ["SIZE", "LINGKAR DADA", "PANJANG BADAN"],
    data: [
      { size: "S", lebar: "-", panjang: "-" },
      { size: "M", lebar: "84", panjang: "42" },
      { size: "L", lebar: "88", panjang: "44" },
      { size: "XL", lebar: "92", panjang: "48" },
      { size: "XXL", lebar: "94", panjang: "50" },
    ],
    notes: "Material: Cotton Combed 30s (Adem, tidak panas). Rekomendasi BB: S(40-45kg), M(45-50kg), L(50-55kg), XL(55-60kg). Kalo tidak mau terlalu ketat, bisa naik size."
  },
  "crop-oversize": {
    label: "CROP OVERSIZE",
    columns: ["SIZE", "LINGKAR DADA", "PANJANG"],
    data: [
      { size: "M", lebar: "98", panjang: "43" },
      { size: "L", lebar: "100", panjang: "47" },
      { size: "XL", lebar: "106", panjang: "52" },
    ],
    notes: "Material: Cotton Combed 30s."
  }
};

export default function SizeGuide({ fitType }: { fitType?: string | null }) {
  const [open, setOpen] = useState(false);

  let activeChart = sizeChartsData["regular"];

  if (fitType) {
    const ft = fitType.toLowerCase();
    if (ft.includes("oversize") && ft.includes("crop")) activeChart = sizeChartsData["crop-oversize"];
    else if (ft.includes("oversize")) activeChart = sizeChartsData["oversized"];
    else if (ft.includes("crop") && ft.includes("tank")) activeChart = sizeChartsData["crop-tank"];
    else if (ft.includes("crop")) activeChart = sizeChartsData["crop"];
    else if (ft.includes("women") || ft.includes("female")) activeChart = sizeChartsData["women-tank"];
    else if (ft.includes("muscle") || ft.includes("tank")) activeChart = sizeChartsData["muscle-tank"];
    else if (ft.includes("long sleeve") || ft.includes("long-sleeve")) activeChart = sizeChartsData["long-sleeve"];
  }

  // Fallback pengaman agar activeChart tidak pernah undefined
  if (!activeChart) {
    activeChart = sizeChartsData["regular"];
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

            {activeChart.notes && (
              <p className="text-[11px] text-primary mt-6 leading-relaxed font-medium">
                {activeChart.notes}
              </p>
            )}

            <p className="text-[11px] text-secondary mt-2 leading-relaxed">
              Toleransi ukuran ±1-2 cm. Jika berada di antara 2 ukuran, kami sarankan memilih ukuran yang lebih besar untuk fit yang lebih nyaman.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
