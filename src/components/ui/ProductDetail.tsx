"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleAddToCart } from "@/lib/products";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    sizes: string[];
    colors: string[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const displayPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validImageSrc =
    product.image && product.image.trim() !== "" ? product.image : null;

  const onAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setMessage({
        type: "error",
        text: "Please select a color before adding to bag.",
      });
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setMessage({
        type: "error",
        text: "Please select a size before adding to bag.",
      });
      return;
    }

    const finalSize = selectedSize || "ALL SIZE";
    const finalColor = selectedColor || "BLACK";

    startTransition(async () => {
      setMessage({ type: "", text: "" });
      const result = await handleAddToCart(product.id, finalSize, finalColor);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.message });
        if (result.message.includes("Sign In")) {
          setTimeout(() => router.push("/login"), 1500);
        }
      }
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 font-['Inter'] text-primary">
      {/* Product Image Section */}
      <div className="bg-surface-container-low relative aspect-[0.75] w-full border border-outline-variant/20 flex items-center justify-center">
        {validImageSrc ? (
          <Image
            src={validImageSrc}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <span className="text-[12px] tracking-widest uppercase text-secondary">
            NO IMAGE AVAILABLE
          </span>
        )}
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col justify-between py-2">
        <div>
          <h1 className="font-['Playfair_Display'] text-[36px] md:text-[56px] leading-tight uppercase font-bold tracking-tight mb-4">
            {product.name}
          </h1>
          <p className="text-[20px] md:text-[24px] font-medium text-primary mb-8 tracking-tight">
            {displayPrice(product.price)}
          </p>
          <div className="border-t border-outline-variant/30 pt-6 mb-8">
            <p className="text-[14px] leading-relaxed text-secondary whitespace-pre-line">
              {product.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Sizes, Colors and Actions */}
        <div className="space-y-8">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary mb-4">
              SELECT COLOR
            </span>
            <div className="flex flex-wrap gap-3">
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setMessage({ type: "", text: "" });
                    }}
                    className={`border text-[13px] font-medium py-3 px-6 transition-colors duration-300 min-w-[60px] tracking-wider ${
                      selectedColor === color
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-transparent text-primary border-outline-variant/50 hover:border-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))
              ) : (
                <span className="text-[12px] text-secondary">
                  No colors available
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary mb-4">
              SELECT SIZE
            </span>
            <div className="flex flex-wrap gap-3">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setMessage({ type: "", text: "" });
                    }}
                    className={`border text-[13px] font-medium py-3 px-6 transition-colors duration-300 min-w-[60px] tracking-wider ${
                      selectedSize === size
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-transparent text-primary border-outline-variant/50 hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <span className="text-[12px] text-secondary">
                  One Size Fits All
                </span>
              )}
            </div>
          </div>

          {message.text && (
            <div
              className={`p-4 text-[12px] font-medium uppercase tracking-wider border ${message.type === "success" ? "bg-green-950/20 border-green-500/50 text-green-400" : "bg-red-950/20 border-red-500/50 text-red-400"}`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={onAddToCart}
            disabled={isPending}
            className="w-full bg-primary text-on-primary font-semibold text-[13px] tracking-[0.2em] uppercase py-5 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300 disabled:opacity-50"
          >
            {isPending ? "CONNECTING TO DATABASE..." : "ADD TO BAG"}
          </button>
        </div>
      </div>
    </div>
  );
}
