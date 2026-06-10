"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Product } from "@/lib/products";
import WishlistButton from "@/components/ui/WishlistButton";
import { handleAddToCart } from "@/lib/products";

// Peta warna nama → hex CSS untuk color swatches
const COLOR_MAP: Record<string, string> = {
  BLACK: "#1a1a1a",
  WHITE: "#f5f5f5",
  GREY: "#888888",
  GRAY: "#888888",
  NAVY: "#1b2a4a",
  RED: "#c0392b",
  BLUE: "#2563eb",
  GREEN: "#16a34a",
  BROWN: "#78350f",
  CREAM: "#f5f0e8",
  BEIGE: "#d4b896",
  OLIVE: "#6b7c3e",
  CHARCOAL: "#3d3d3d",
  "ASH GREY": "#b0b0b0",
  "LIGHT GREY": "#d0d0d0",
  "DARK GREEN": "#145a32",
  KHAKI: "#c3b091",
  ORANGE: "#ea580c",
  PURPLE: "#7c3aed",
  MAROON: "#6b2737",
  "FOREST GREEN": "#228b22",
  CAMEL: "#c19a6b",
  SAND: "#c2b280",
  TAN: "#d2b48c",
  // Indonesian Colors
  HITAM: "#1a1a1a",
  PUTIH: "#f5f5f5",
  MERAH: "#c0392b",
  HIJAU: "#16a34a",
  KHAKY: "#c3b091",
  "DEEP BLUE": "#1b2a4a",
  "LIGHT BLUE": "#60a5fa",
  "DUSTY PINK": "#d4a5a5",
  "DARK BROWN": "#5c4033",
  PINK: "#f472b6",
  COKELAT: "#78350f",
  "BLUE BENHUR": "#2563eb",
  "DARK BLUE": "#1e3a8a",
  "BIRU MUDA": "#60a5fa",
  // Custom recent colors
  "MISTY BLACK": "#2b2b2b",
  "MISTY COFFE": "#8c6b5d",
  "MISTY GREY": "#a6a6a6",
  "CYAN": "#06b6d4",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const colors: string[] = Array.isArray(product.colors) ? product.colors : [];
  const images: string[] = Array.isArray((product as any).images)
    ? (product as any).images
    : [];

  // Gambar ke-2 untuk hover swap (jika ada)
  const hoverImage = images.length > 0 ? images[0] : null;

  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [quickAddColor, setQuickAddColor] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [addMsg, setAddMsg] = useState<{ type: string; text: string } | null>(null);

  const displayPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const sizes: string[] = Array.isArray(product.sizes) ? product.sizes : [];

  const handleQuickAdd = (size: string) => {
    const color = quickAddColor || colors[0] || "BLACK";
    startTransition(async () => {
      const result = await handleAddToCart(product.id, size, color);
      if (result.success) {
        setAddMsg({ type: "success", text: "Added!" });
        setTimeout(() => {
          setAddMsg(null);
          setQuickAddOpen(false);
        }, 1200);
      } else {
        setAddMsg({ type: "error", text: result.message });
        setTimeout(() => setAddMsg(null), 2000);
      }
    });
  };

  return (
    <div className="group cursor-pointer block">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-container-low mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
        <Link href={`/produk/${product.slug}`} className="absolute inset-0 z-0">
          {/* Main image */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${hoverImage ? "group-hover:opacity-0" : ""}`}
          />

          {/* Hover image (swap on hover) */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} alternate`}
              fill
              className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-primary text-on-primary text-[10px] tracking-[0.1em] font-semibold px-2.5 py-1 uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton
            productId={product.id}
            className="bg-surface/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-surface"
          />
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20">
          {!quickAddOpen ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickAddOpen(true);
              }}
              className="w-full bg-primary/90 backdrop-blur-sm text-on-primary text-[11px] tracking-[0.2em] font-semibold uppercase py-3 hover:bg-primary transition-colors duration-200"
            >
              {isPending ? "ADDING..." : "QUICK ADD"}
            </button>
          ) : (
            <div
              className="bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 p-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Color selector (jika ada lebih dari 1 warna) */}
              {colors.length > 1 && (
                <div className="flex gap-1.5 mb-2 justify-center">
                  {colors.map((c) => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setQuickAddColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        quickAddColor === c
                          ? "border-primary scale-110"
                          : "border-transparent hover:scale-110"
                      }`}
                      style={{
                        backgroundColor: COLOR_MAP[c.toUpperCase()] ?? "#888",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Size selector */}
              {addMsg ? (
                <p
                  className={`text-center text-[11px] tracking-widest uppercase py-1 ${addMsg.type === "success" ? "text-green-600" : "text-red-400"}`}
                >
                  {addMsg.text}
                </p>
              ) : sizes.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleQuickAdd(size)}
                      disabled={isPending}
                      className="text-[10px] font-semibold border border-outline-variant/50 hover:border-primary hover:bg-primary hover:text-on-primary px-2 py-1 transition-colors uppercase disabled:opacity-50"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => handleQuickAdd("ALL SIZE")}
                  disabled={isPending}
                  className="w-full text-[10px] font-semibold bg-primary text-on-primary py-2 uppercase tracking-widest disabled:opacity-50"
                >
                  ADD TO BAG
                </button>
              )}

              <button
                onClick={() => setQuickAddOpen(false)}
                className="w-full mt-1.5 text-[9px] text-secondary uppercase tracking-widest hover:text-primary"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>

        {/* Overlay tint saat hover (di belakang quick add) */}
        <div
          className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none"
          onClick={() => !quickAddOpen && undefined}
        />
      </div>

      {/* Link wrapper hanya untuk teks/info area */}
      <Link href={`/produk/${product.slug}`} className="block">
        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 justify-center mb-2">
            {colors.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                onMouseEnter={() => setHoveredColor(c)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`w-3 h-3 rounded-full border transition-transform duration-200 ${
                  hoveredColor === c ? "scale-125 border-primary" : "border-outline-variant/40"
                }`}
                style={{
                  backgroundColor: COLOR_MAP[c.toUpperCase()] ?? "#888",
                }}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-[9px] text-secondary self-center">
                +{colors.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <h3 className="text-[14px] leading-[20px] tracking-[0.05em] font-medium text-primary mb-1.5 uppercase group-hover:opacity-70 transition-opacity duration-300">
            {product.name}
          </h3>
          {hoveredColor && (
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">
              {hoveredColor}
            </p>
          )}
          <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary">
            {displayPrice(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
}
