"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ProductFilterClientProps {
  initialProducts: any[];
  showCategoryFilter?: boolean; // Tampilkan filter ALL/MEN/WOMEN (untuk halaman Collection)
}

export default function ProductFilterClient({
  initialProducts,
  showCategoryFilter = false,
}: ProductFilterClientProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterSize, setFilterSize] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableSizes = ["ALL", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

  const processedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filter berdasarkan kategori (khusus halaman Collection)
    if (showCategoryFilter && filterCategory !== "ALL") {
      result = result.filter(
        (p) => p.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // 2. Filter berdasarkan ukuran
    if (filterSize !== "ALL") {
      result = result.filter((p) => p.sizes && p.sizes.includes(filterSize));
    }

    // 3. Pengurutan (Sort)
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [initialProducts, sortBy, filterSize, filterCategory, showCategoryFilter]);

  // Label aktif untuk filter
  const activeFilterLabel = () => {
    const parts: string[] = [];
    if (showCategoryFilter && filterCategory !== "ALL")
      parts.push(filterCategory);
    if (filterSize !== "ALL") parts.push(filterSize);
    return parts.length > 0 ? ` (${parts.join(", ")})` : "";
  };

  return (
    <>
      {/* Filters Bar */}
      <ScrollReveal>
        <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto border-t border-outline-variant py-6 flex justify-between items-center mb-12">
          <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary uppercase">
            {processedProducts.length} PIECES
          </p>

          <div className="flex gap-6 relative">
            {/* Menu Dropdown Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  setIsSortOpen(false);
                }}
                className={`text-[12px] leading-[16px] tracking-[0.1em] font-semibold transition-colors uppercase ${
                  isFilterOpen ||
                  filterSize !== "ALL" ||
                  filterCategory !== "ALL"
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                FILTER{activeFilterLabel()}
              </button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-4 bg-surface-container-lowest border border-outline-variant p-5 z-50 min-w-[180px] shadow-2xl">
                  {/* Category Filter (hanya untuk Collection) */}
                  {showCategoryFilter && (
                    <>
                      <p className="text-[10px] font-bold tracking-widest text-secondary mb-4 uppercase border-b border-outline-variant/50 pb-2">
                        CATEGORY
                      </p>
                      <div className="flex flex-col gap-3 mb-5">
                        {["ALL", "MEN", "WOMEN"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setFilterCategory(cat);
                            }}
                            className={`text-left text-[12px] tracking-[0.1em] uppercase font-medium hover:text-primary transition-colors ${
                              filterCategory === cat
                                ? "text-primary"
                                : "text-secondary"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Size Filter */}
                  <p className="text-[10px] font-bold tracking-widest text-secondary mb-4 uppercase border-b border-outline-variant/50 pb-2">
                    SIZE
                  </p>
                  <div className="flex flex-col gap-3">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setFilterSize(size);
                          setIsFilterOpen(false);
                        }}
                        className={`text-left text-[12px] tracking-[0.1em] uppercase font-medium hover:text-primary transition-colors ${
                          filterSize === size ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Reset Filter */}
                  {(filterSize !== "ALL" || filterCategory !== "ALL") && (
                    <button
                      onClick={() => {
                        setFilterSize("ALL");
                        setFilterCategory("ALL");
                        setIsFilterOpen(false);
                      }}
                      className="mt-4 pt-3 border-t border-outline-variant/50 w-full text-left text-[11px] tracking-[0.1em] uppercase font-semibold text-red-400 hover:text-red-500 transition-colors"
                    >
                      RESET FILTER
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Menu Dropdown Sort */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFilterOpen(false);
                }}
                className={`text-[12px] leading-[16px] tracking-[0.1em] font-semibold transition-colors uppercase ${
                  isSortOpen || sortBy !== "newest"
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                SORT
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-4 bg-surface-container-lowest border border-outline-variant p-5 z-50 min-w-[220px] shadow-2xl">
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => {
                        setSortBy("newest");
                        setIsSortOpen(false);
                      }}
                      className={`text-left text-[12px] tracking-[0.1em] uppercase font-medium hover:text-primary transition-colors ${
                        sortBy === "newest" ? "text-primary" : "text-secondary"
                      }`}
                    >
                      Latest Arrivals
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("price_asc");
                        setIsSortOpen(false);
                      }}
                      className={`text-left text-[12px] tracking-[0.1em] uppercase font-medium hover:text-primary transition-colors ${
                        sortBy === "price_asc"
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("price_desc");
                        setIsSortOpen(false);
                      }}
                      className={`text-left text-[12px] tracking-[0.1em] uppercase font-medium hover:text-primary transition-colors ${
                        sortBy === "price_desc"
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Product Grid */}
      <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto pb-24">
        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
            {processedProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-24 border border-dashed border-outline-variant/30 text-secondary uppercase tracking-wider text-[14px]">
            No garments matching your selection.
          </div>
        )}
      </div>
    </>
  );
}
