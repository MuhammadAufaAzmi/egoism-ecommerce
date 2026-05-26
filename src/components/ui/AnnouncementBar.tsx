"use client";

import { useState } from "react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full z-[60] bg-primary text-on-primary">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-2 flex items-center justify-center relative">
        <p className="text-[11px] tracking-[0.2em] font-medium uppercase text-center">
          NEW DROP SS26 AVAILABLE NOW
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close announcement"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
