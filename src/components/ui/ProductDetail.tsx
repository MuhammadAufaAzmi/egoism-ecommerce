"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleAddToCart } from "@/lib/products";
import SizeGuide from "@/components/ui/SizeGuide";
import WishlistButton from "@/components/ui/WishlistButton";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    sizes: string[];
    colors: string[];
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
  const [quantity, setQuantity] = useState<number>(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [reviewTab, setReviewTab] = useState(false);

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

      // Panggil handleAddToCart sebanyak quantity yang dipilih
      let result = { success: false, message: "" };
      for (let i = 0; i < quantity; i++) {
        result = await handleAddToCart(product.id, finalSize, finalColor);
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
              className={`object-cover transition-transform duration-300 ${isZooming ? "scale-[1.7]" : "scale-100"}`}
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
            <h1 className="text-[36px] md:text-[56px] leading-tight uppercase font-bold tracking-tight mb-4">
              {product.name}
            </h1>
            <WishlistButton productId={product.id} initialWishlisted={initialWishlisted} className="mt-4 p-2 bg-surface-container-low border border-outline-variant/30 rounded-full hover:border-red-500" />
          </div>
          <p className="text-[20px] md:text-[24px] font-medium text-primary mb-8 tracking-tight">
            {displayPrice(product.price)}
          </p>
          <div className="border-t border-outline-variant/30 pt-6 mb-8">
            <p className="text-[14px] text-secondary leading-relaxed whitespace-pre-line mt-6">
              {product.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 border-t border-outline-variant/30 pt-8">
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
                  <div className="mt-8 bg-surface-container-lowest p-6 border border-outline-variant/30">
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest mb-4">Tulis Ulasan Anda</h4>
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Rating</label>
                        <select name="rating" required className="w-full border border-outline-variant/50 px-3 py-2 text-[12px] bg-background">
                          <option value="5">5 Bintang (Sangat Bagus)</option>
                          <option value="4">4 Bintang (Bagus)</option>
                          <option value="3">3 Bintang (Cukup)</option>
                          <option value="2">2 Bintang (Kurang)</option>
                          <option value="1">1 Bintang (Sangat Kurang)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Komentar</label>
                        <textarea 
                          name="comment" 
                          required 
                          rows={3} 
                          className="w-full border border-outline-variant/50 px-3 py-2 text-[12px] bg-background focus:outline-none focus:border-primary resize-none"
                          placeholder="Bagaimana pendapat Anda tentang produk ini?"
                        />
                      </div>
                      <button type="submit" className="bg-primary text-on-primary px-6 py-3 text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity">
                        Kirim Ulasan
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
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
                    onClick={() => { setSelectedColor(color); setMessage({ type: "", text: "" }); }}
                    className={`border text-[12px] font-medium py-2.5 px-5 transition-all duration-300 tracking-wider ${
                      selectedColor === color
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-transparent text-primary border-outline-variant/50 hover:border-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))
              ) : (
                <span className="text-[12px] text-secondary">No colors available</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-secondary">
                SELECT SIZE
              </span>
              <SizeGuide />
            </div>
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
            {isPending ? "CONNECTING TO DATABASE..." : "ADD TO BAG"}
          </button>
        </div>
      </div>
    </div>
  );
}
