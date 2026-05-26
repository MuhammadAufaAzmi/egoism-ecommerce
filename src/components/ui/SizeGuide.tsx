"use client";

import { useState } from "react";

export default function SizeGuide() {
  const [open, setOpen] = useState(false);

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
            className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg mx-4 p-8 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
              <h3 className="text-[18px] font-bold uppercase tracking-wide text-primary">Size Guide</h3>
              <button onClick={() => setOpen(false)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[11px] tracking-[0.15em] font-semibold text-secondary uppercase mb-4">
              Measurements in cm
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/50">
                    <th className="py-3 px-3 text-left font-bold uppercase tracking-wider text-primary">Size</th>
                    <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-primary">Chest</th>
                    <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-primary">Waist</th>
                    <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-primary">Length</th>
                    <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-primary">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "S", chest: "96", waist: "86", length: "68", shoulder: "44" },
                    { size: "M", chest: "102", waist: "92", length: "70", shoulder: "46" },
                    { size: "L", chest: "108", waist: "98", length: "72", shoulder: "48" },
                    { size: "XL", chest: "114", waist: "104", length: "74", shoulder: "50" },
                    { size: "XXL", chest: "120", waist: "110", length: "76", shoulder: "52" },
                    { size: "3XL", chest: "126", waist: "116", length: "78", shoulder: "54" },
                    { size: "4XL", chest: "132", waist: "122", length: "80", shoulder: "56" },
                    { size: "5XL", chest: "138", waist: "128", length: "82", shoulder: "58" },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-primary">{row.size}</td>
                      <td className="py-3 px-3 text-center text-secondary">{row.chest}</td>
                      <td className="py-3 px-3 text-center text-secondary">{row.waist}</td>
                      <td className="py-3 px-3 text-center text-secondary">{row.length}</td>
                      <td className="py-3 px-3 text-center text-secondary">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-secondary mt-5 leading-relaxed">
              Toleransi ukuran ±2 cm. Jika berada di antara 2 ukuran, kami sarankan memilih ukuran yang lebih besar untuk fit yang lebih nyaman.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
