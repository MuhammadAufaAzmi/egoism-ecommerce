"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SpotlightCard from "@/components/ui/reactbits/SpotlightCard";

interface ProductFilterClientProps {
  initialProducts: any[];
  showCategoryFilter?: boolean; // Tampilkan filter ALL/MEN/WOMEN (untuk halaman Collection)
  genderContext?: "men" | "women" | "all"; // Konteks gender untuk menentukan fit types yang relevan
}

const ACTIVITIES = [
  { key: "ALL", label: "ALL" },
  { key: "hyrox", label: "HYROX" },
  { key: "crossfit", label: "CROSSFIT" },
  { key: "running", label: "RUNNING" },
  { key: "powerlifting", label: "POWERLIFTING" },
  { key: "pilates", label: "PILATES" },
  { key: "yoga", label: "YOGA" },
  { key: "gym", label: "GYM" },
  { key: "basketball", label: "BASKETBALL" },
];

const ALL_FIT_TYPES = [
  { key: "ALL", label: "ALL" },
  { key: "oversized", label: "Oversized" },
  { key: "regular", label: "Regular" },
  { key: "muscle-tank", label: "Muscle tank" },
  { key: "crop-tank", label: "Crop tank" },
  { key: "crop", label: "Crop regular fit" },
  { key: "crop-oversize", label: "Crop Oversize" },
  { key: "long-sleeve", label: "Long sleeve" },
];

export default function ProductFilterClient({
  initialProducts,
  showCategoryFilter = false,
  genderContext = "all",
}: ProductFilterClientProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterSize, setFilterSize] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterFitType, setFilterFitType] = useState("ALL");
  const [filterActivity, setFilterActivity] = useState("ALL");

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

    // 2. Filter Aktivitas
    if (filterActivity !== "ALL") {
      result = result.filter(
        (p) => p.activity && Array.isArray(p.activity) && p.activity.includes(filterActivity)
      );
    }

    // 3. Filter Fit Type
    if (filterFitType !== "ALL") {
      result = result.filter((p) => p.fitType && Array.isArray(p.fitType) && p.fitType.includes(filterFitType));
    }

    // 4. Filter berdasarkan ukuran
    if (filterSize !== "ALL") {
      result = result.filter((p) => p.sizes && p.sizes.includes(filterSize));
    }

    // 5. Pengurutan (Sort)
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
  }, [initialProducts, sortBy, filterSize, filterCategory, filterFitType, filterActivity, showCategoryFilter]);

  // Label aktif untuk filter
  const activeFilterLabel = () => {
    const parts: string[] = [];
    if (showCategoryFilter && filterCategory !== "ALL") parts.push(filterCategory);
    if (filterFitType !== "ALL") parts.push(ALL_FIT_TYPES.find(f => f.key === filterFitType)?.label || filterFitType);
    if (filterSize !== "ALL") parts.push(filterSize);
    return parts.length > 0 ? ` (${parts.join(", ")})` : "";
  };

  // Cek apakah ada active filter/reset
  const hasActiveFilters = filterSize !== "ALL" || filterFitType !== "ALL" || filterActivity !== "ALL" || filterCategory !== "ALL";

  // Dynamic Collection Description
  const getCollectionDescription = () => {
    switch (filterActivity) {
      case "gym":
        return { title: "Gym Collection", desc: "Built for everyday training — from heavy sessions to daily wear. Clean, versatile pieces made for people who live in gym mode." };
      case "hyrox":
        return { title: "HYROX Collection", desc: "Performance-driven apparel inspired by endurance, speed, and hybrid training culture. Made to move through every station." };
      case "crossfit":
        return { title: "CrossFit Collection", desc: "High-intensity pieces for functional athletes who thrive on hard work, sweat, and competition." };
      case "powerlifting":
        return { title: "Powerlifting Club", desc: "Strength-first essentials inspired by the powerlifting community. Heavy lifts, disciplined mindset, no shortcuts." };
      case "pilates":
        return { title: "Pilates Collection", desc: "Soft, minimal, and comfortable pieces designed for controlled movement, balance, and everyday studio wear." };
      case "yoga":
        return { title: "Yoga Collection", desc: "Comfort-focused essentials created for flow, stretch, and mindful movement on and off the mat." };
      case "basketball":
        return { title: "Basketball Edition", desc: "Sport-inspired streetwear influenced by basketball culture, movement, and off-court energy." };
      default:
        // Handle defaults based on category/gender Context when no activity is selected
        if (genderContext === "women" || (showCategoryFilter && filterCategory === "WOMEN")) {
          return { title: "Girl Collection", desc: "Feminine, confident, and strong. Designed for girls who love lifting, movement, and looking good while doing it." };
        }
        return { title: "Minimalist Essentials", desc: "Clean silhouettes and timeless basics made for effortless everyday wear — simple, versatile, and easy to style." };
    }
  };

  const collectionInfo = getCollectionDescription();

  return (
    <>
      {/* Activity Tag Bar — Gymshark Style */}
      <ScrollReveal>
        <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto pt-4 pb-2">
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {ACTIVITIES.map((act) => (
              <button
                key={act.key}
                onClick={() => setFilterActivity(act.key)}
                className={`whitespace-nowrap px-5 py-2.5 text-[11px] md:text-[12px] tracking-[0.15em] font-semibold uppercase border transition-all duration-300 flex-shrink-0 ${
                  filterActivity === act.key
                    ? "bg-primary text-on-primary border-primary shadow-lg"
                    : "bg-transparent text-secondary border-outline-variant/50 hover:text-primary hover:border-primary/60"
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Dynamic Collection Info Section */}
      <ScrollReveal>
        <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto py-8 mb-4">
          <h2 className="text-[24px] md:text-[32px] font-bold text-primary uppercase tracking-wider mb-3">
            {collectionInfo.title}
          </h2>
          <p className="text-[14px] md:text-[16px] text-secondary max-w-3xl leading-relaxed">
            {collectionInfo.desc}
          </p>
        </div>
      </ScrollReveal>

      {/* Filters Bar */}
      <ScrollReveal className="relative z-50">
        <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto border-t border-outline-variant py-6 flex justify-between items-center mb-12">
          <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary uppercase">
            {processedProducts.length} PIECES
          </p>

          <div className="flex gap-6 relative items-center">
            {/* Reset All Filters */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilterSize("ALL");
                  setFilterFitType("ALL");
                  setFilterActivity("ALL");
                  setFilterCategory("ALL");
                  setSortBy("newest");
                }}
                className="text-[11px] tracking-[0.1em] font-semibold text-red-400 hover:text-red-500 transition-colors uppercase"
              >
                RESET
              </button>
            )}

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
                  filterCategory !== "ALL" ||
                  filterFitType !== "ALL"
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                FILTER{activeFilterLabel()}
              </button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-4 bg-surface-container-lowest border border-outline-variant p-5 z-50 min-w-[180px] shadow-2xl max-h-[70vh] overflow-y-auto">
                  {/* Category Filter (hanya untuk Collection) */}
                  {showCategoryFilter && (
                    <>
                      <p className="text-[11px] font-bold tracking-widest text-secondary mb-4 uppercase border-b border-outline-variant/50 pb-2">
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

                  {/* Fit Type Filter */}
                  <p className="text-[11px] font-bold tracking-widest text-secondary mb-4 uppercase border-b border-outline-variant/50 pb-2">
                    FIT TYPE
                  </p>
                  <div className="flex flex-col gap-3 mb-5">
                    {ALL_FIT_TYPES.map((fit) => (
                      <button
                        key={fit.key}
                        onClick={() => {
                          setFilterFitType(fit.key);
                        }}
                        className={`text-left text-[12px] tracking-[0.1em] uppercase font-medium hover:text-primary transition-colors ${
                          filterFitType === fit.key ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {fit.label}
                      </button>
                    ))}
                  </div>

                  {/* Size Filter */}
                  <p className="text-[11px] font-bold tracking-widest text-secondary mb-4 uppercase border-b border-outline-variant/50 pb-2">
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
                  {(filterSize !== "ALL" || filterCategory !== "ALL" || filterFitType !== "ALL") && (
                    <button
                      onClick={() => {
                        setFilterSize("ALL");
                        setFilterCategory("ALL");
                        setFilterFitType("ALL");
                        setIsFilterOpen(false);
                      }}
                      className="mt-4 pt-3 border-t border-outline-variant/50 w-full text-left text-[12px] tracking-[0.1em] uppercase font-semibold text-red-400 hover:text-red-500 transition-colors"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-16">
            {processedProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <SpotlightCard>
                  <ProductCard product={product} />
                </SpotlightCard>
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
