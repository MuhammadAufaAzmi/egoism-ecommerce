"use client";

import React, { useState, useTransition, useEffect } from "react";
import { toggleWishlist, checkIsWishlisted } from "@/lib/wishlist";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface WishlistButtonProps {
  productId: string;
  initialWishlisted?: boolean;
  className?: string;
  showText?: boolean;
}

export default function WishlistButton({ productId, initialWishlisted = false, className = "", showText = false }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch state if we didn't receive an initial state or if it might be stale
    const checkStatus = async () => {
      const status = await checkIsWishlisted(productId);
      setIsWishlisted(status);
    };
    checkStatus();
  }, [productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result.success) {
        setIsWishlisted(result.isWishlisted || false);
        showToast(result.message, "success");
      } else {
        if (result.message.includes("Sign In")) {
          showToast(result.message, "warning");
          router.push("/login");
        } else {
          showToast(result.message, "error");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${className}`}
      title="Add to Wishlist"
    >
      <span className={`material-symbols-outlined ${isWishlisted ? "text-red-500 font-variation-fill" : "text-secondary hover:text-red-500"} transition-colors`} style={isWishlisted ? { fontVariationSettings: "'FILL' 1" } : {}}>
        favorite
      </span>
      {showText && (
        <span className="ml-2 text-[12px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
          {isWishlisted ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
