"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

const STORAGE_KEY = "egoism_recently_viewed";
const MAX_ITEMS = 5;

/**
 * Menyimpan produk ke localStorage sebagai "Recently Viewed"
 * Dipanggil dari halaman produk saat produk di-render
 */
export function saveRecentlyViewed(product: RecentProduct) {
  if (typeof window === "undefined") return;
  try {
    const existing: RecentProduct[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    // Hapus duplikat jika sudah ada
    const filtered = existing.filter((p) => p.id !== product.id);
    // Tambahkan di awal, batasi MAX_ITEMS
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors (e.g. private mode)
  }
}

/**
 * Komponen yang menampilkan produk yang baru dilihat
 * Exclude produk yang sedang dilihat (currentProductId)
 */
export default function RecentlyViewed({
  currentProductId,
}: {
  currentProductId?: string;
}) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored: RecentProduct[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      const filtered = currentProductId
        ? stored.filter((p) => p.id !== currentProductId)
        : stored;
      setProducts(filtered.slice(0, 4));
    } catch {
      setProducts([]);
    }
  }, [currentProductId]);

  const displayPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  if (products.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-16 border-t border-outline-variant/20">
      <div className="mb-10">
        <p className="text-[11px] tracking-[0.2em] text-secondary uppercase font-semibold mb-2">
          Recently Viewed
        </p>
        <h3 className="text-[20px] md:text-[28px] font-bold uppercase tracking-tight text-primary">
          You Also Looked At
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/produk/${product.slug}`}
            className="group block"
          >
            <div className="w-full aspect-[0.73] overflow-hidden mb-3 bg-surface-container relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-[13px] font-medium uppercase tracking-wide text-primary group-hover:opacity-70 transition-opacity truncate">
              {product.name}
            </p>
            <p className="text-[11px] text-secondary mt-0.5">
              {displayPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
