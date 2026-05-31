"use client";

import { useEffect } from "react";
import { saveRecentlyViewed } from "@/components/ui/RecentlyViewed";

interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  };
}

/**
 * Client component yang dipasang di product page.
 * Saat render, otomatis menyimpan produk ke localStorage "recently viewed".
 * Tidak me-render apapun ke DOM (return null).
 */
export default function RecentlyViewedTracker({ product }: Props) {
  useEffect(() => {
    saveRecentlyViewed(product);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
