"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleAddToCart } from "@/lib/products";
import SizeGuide from "@/components/ui/SizeGuide";
import WishlistButton from "@/components/ui/WishlistButton";

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

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    sizes: Record<string, string[]>;
    colors: string[];
    fitType?: string[];
    images?: string[];
  };
  initialWishlisted?: boolean;
  reviews?: any[];
  canReview?: boolean;
}

export default function ProductDetail({ 
  product, 
  initialWishlisted = false,
  reviews = [],
  canReview = false
}: ProductDetailProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedFitType, setSelectedFitType] = useState<string>(
    product.fitType && product.fitType.length === 1 ? product.fitType[0] : ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [reviewTab, setReviewTab] = useState(false);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

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
    
  const allImages = [validImageSrc, ...(product.images || [])].filter(Boolean) as string[];
  const activeImageSrc = allImages[activeIndex] || validImageSrc;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const onAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setMessage({
        type: "error",
        text: "Please select a color before adding to bag.",
      });
      return;
    }

    if (product.fitType && product.fitType.length > 1 && !selectedFitType) {
      setMessage({
        type: "error",
        text: "Please select a fit type/model before adding to bag.",
      });
      return;
    }

    const availableSizes = selectedFitType && product.sizes ? product.sizes[selectedFitType] || [] : [];
    if (availableSizes.length > 0 && !selectedSize) {
      setMessage({
        type: "error",
        text: "Please select a size before adding to bag.",
      });
      return;
    }

    const finalSize = selectedSize || "ALL SIZE";
    const finalColor = selectedColor || "BLACK";
    const finalFitType = selectedFitType || "regular";

    // Optimistic UI feedback immediately
    setMessage({
      type: "success",
      text: "Adding to bag...",
    });

    startTransition(async () => {
      // Panggil handleAddToCart sebanyak quantity yang dipilih
      let result = { success: false, message: "" };
      for (let i = 0; i < quantity; i++) {
        result = await handleAddToCart(product.id, finalSize, finalColor, finalFitType);
        if (!result.success) break;
      }

      if (result.success) {
        setMessage({
          type: "success",
          text: `${quantity} item${quantity > 1 ? "s" : ""} added to bag.`,
        });
      } else {
        setMessage({ type: "error", text: result.message });
        if (result.message.includes("Sign In")) {
          setTimeout(() => router.push("/login"), 1500);
        }
      }
    });
  };

  const handleAddReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;
    
    // Untuk import dinamis karena ini client component dan addReview adalah server action
    const { addReview } = await import("@/lib/reviews");
    const result = await addReview(product.id, rating, comment);
    
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 text-primary">
      {/* Product Image Section */}
      <div className="flex flex-col gap-4">
        <div 
          className="bg-surface-container-low relative aspect-[0.75] w-full border border-outline-variant/20 flex items-center justify-center overflow-hidden cursor-crosshair group"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
        >
          {activeImageSrc ? (
            <Image
              src={activeImageSrc}
              alt={product.name}
              fill
              priority
              className={`object-cover transition-transform duration-300 ${isZooming ? "md:scale-[1.7]" : "scale-100"}`}
              style={isZooming ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
            />
          ) : (
            <span className="text-[12px] tracking-widest uppercase text-secondary">
              NO IMAGE AVAILABLE
            </span>
          )}
        </div>
        
        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {allImages.map((src, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 md:w-24 aspect-[0.75] border flex-shrink-0 transition-colors ${activeIndex === idx ? "border-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
              >
                <Image src={src} alt={`${product.name} ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col justify-between py-2">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-[36px] md:text-[56px] leading-tight uppercase font-bold tracking-tight mb-2">
              {product.name}
            </h1>
            <WishlistButton productId={product.id} initialWishlisted={initialWishlisted} className="mt-4 p-2 bg-surface-container-low border border-outline-variant/30 rounded-full hover:border-red-500" />
          </div>
          
          {/* Average Rating Summary */}
          {reviews.length > 0 ? (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`material-symbols-outlined text-[16px] ${star <= Number(averageRating) ? 'text-primary' : 'text-outline-variant'}`}>
                    star
                  </span>
                ))}
              </div>
              <span className="text-[12px] font-semibold tracking-widest text-secondary">{averageRating} / 5</span>
              <span className="text-[10px] text-secondary/50">•</span>
              <a href="#reviews" onClick={(e) => { e.preventDefault(); setReviewTab(true); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-[12px] uppercase tracking-widest text-secondary underline hover:text-primary">
                {reviews.length} Ulasan
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-outline-variant">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined text-[16px]">
                    star
                  </span>
                ))}
              </div>
              <span className="text-[12px] uppercase tracking-widest text-secondary">Belum ada ulasan</span>
            </div>
          )}

          <p className="text-[20px] md:text-[24px] font-medium text-primary mb-8 tracking-tight">
            {displayPrice(product.price)}
          </p>
          <div className="border-t border-outline-variant/30 pt-6 mb-8">
            <p className="text-[14px] text-secondary leading-relaxed whitespace-pre-line mt-6">
              {product.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mt-12 border-t border-outline-variant/30 pt-8">
            <button 
              onClick={() => setReviewTab(!reviewTab)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em]">Reviews ({reviews.length})</h3>
              <span className="material-symbols-outlined">
                {reviewTab ? "expand_less" : "expand_more"}
              </span>
            </button>
            
            {reviewTab && (
              <div className="mt-8 space-y-8 animate-fadeIn">
                {reviews.length === 0 ? (
                  <p className="text-[12px] text-secondary italic">Belum ada ulasan untuk produk ini.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((r: any) => (
                      <div key={r.id} className="border-b border-outline-variant/20 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-primary">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`material-symbols-outlined text-[14px] ${star <= r.rating ? 'text-primary' : 'text-outline-variant'}`}>
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">{r.author}</span>
                          <span className="text-[10px] text-secondary/50 mx-2">•</span>
                          <span className="text-[10px] text-secondary">{r.date}</span>
                        </div>
                        <p className="text-[13px] text-primary">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {canReview && (
                  <ReviewForm productId={product.id} onSubmit={handleAddReview} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sizes, Colors and Actions */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary">
                SELECT COLOR
              </span>
              {selectedColor && (
                <span className="text-[11px] tracking-widest text-primary uppercase">
                  — {selectedColor}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color) => {
                  const hexColor = COLOR_MAP[color.toUpperCase()] ?? "#888";
                  const isSelected = selectedColor === color;
                  const isLight = ["WHITE", "CREAM", "BEIGE", "SAND", "TAN", "KHAKI", "LIGHT GREY"].includes(color.toUpperCase());
                  return (
                    <button
                      key={color}
                      title={color}
                      onClick={() => { setSelectedColor(color); setMessage({ type: "", text: "" }); }}
                      className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isSelected ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-110"
                      } ${isLight ? "border border-outline-variant/30" : ""}`}
                      style={{ backgroundColor: hexColor }}
                    >
                      {isSelected && (
                        <span
                          className="text-[14px] font-bold"
                          style={{ color: isLight ? "#1a1a1a" : "#ffffff" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <span className="text-[12px] text-secondary">No colors available</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary">
                SELECT FIT TYPE
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.fitType && product.fitType.length > 0 ? (
                product.fitType.map((fit) => (
                  <button
                    key={fit}
                    onClick={() => {
                      setSelectedFitType(fit);
                      setSelectedSize("");
                      setMessage({ type: "", text: "" });
                    }}
                    className={`border text-[13px] font-medium py-3 px-6 transition-colors duration-300 min-w-[60px] tracking-wider uppercase ${
                      selectedFitType === fit
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-transparent text-primary border-outline-variant/50 hover:border-primary"
                    }`}
                  >
                    {fit}
                  </button>
                ))
              ) : (
                <span className="text-[12px] text-secondary">
                  Regular Fit
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary">
                SELECT SIZE
              </span>
              <SizeGuide fitType={selectedFitType} />
            </div>
            <div className="flex flex-wrap gap-3">
              {product.fitType && product.fitType.length > 1 && !selectedFitType ? (
                <span className="text-[12px] text-secondary tracking-widest uppercase font-medium border border-outline-variant/30 p-3 w-full text-center">
                  PLEASE SELECT FIT TYPE / MODEL FIRST
                </span>
              ) : selectedFitType && product.sizes && product.sizes[selectedFitType] && product.sizes[selectedFitType].length > 0 ? (
                product.sizes[selectedFitType].map((size) => (
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

          {/* Quantity Selector */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary mb-4">
              QUANTITY
            </span>
            <div className="flex items-center border border-outline-variant/50 w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-primary hover:bg-surface-container-low transition-colors text-[16px]"
              >
                −
              </button>
              <span className="px-6 py-3 text-[14px] font-medium border-l border-r border-outline-variant/50 min-w-[50px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 text-primary hover:bg-surface-container-low transition-colors text-[16px]"
              >
                +
              </button>
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
            {isPending ? "ADDING TO BAG..." : "ADD TO BAG"}
          </button>
        </div>
      </div>

      {/* Sticky Mobile Add To Bag */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/30 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button
          onClick={onAddToCart}
          disabled={isPending}
          className="w-full bg-primary text-on-primary font-bold text-[13px] tracking-[0.2em] uppercase py-4 border border-primary transition-colors duration-300 disabled:opacity-50"
        >
          {isPending ? "ADDING..." : `ADD TO BAG - ${displayPrice(product.price)}`}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ReviewForm — Interactive Star Rating
───────────────────────────────────────── */
function ReviewForm({
  productId,
  onSubmit,
}: {
  productId: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  return (
    <div className="mt-8 bg-surface-container-lowest p-6 border border-outline-variant/30">
      <h4 className="text-[11px] font-semibold uppercase tracking-widest mb-6">
        Tulis Ulasan Anda
      </h4>
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Hidden input untuk rating */}
        <input type="hidden" name="rating" value={selectedRating || 5} />

        {/* Interactive Star Rating */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-secondary block mb-3">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(star)}
                className="transition-transform duration-100 hover:scale-110"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 transition-colors duration-150"
                  fill={star <= (hoverRating || selectedRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  style={{
                    color:
                      star <= (hoverRating || selectedRating)
                        ? "#1a1a1a"
                        : "#999",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            ))}
            {(hoverRating > 0 || selectedRating > 0) && (
              <span className="ml-2 text-[11px] text-secondary self-center uppercase tracking-wider">
                {["", "Sangat Kurang", "Kurang", "Cukup", "Bagus", "Sangat Bagus"][
                  hoverRating || selectedRating
                ]}
              </span>
            )}
          </div>
        </div>

        {/* Komentar */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">
            Komentar
          </label>
          <textarea
            name="comment"
            required
            rows={3}
            className="w-full border border-outline-variant/50 px-3 py-2 text-[12px] bg-background focus:outline-none focus:border-primary resize-none"
            placeholder="Bagaimana pendapat Anda tentang produk ini?"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-6 py-3 text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          Kirim Ulasan
        </button>
      </form>
    </div>
  );
}
