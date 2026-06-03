import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import StatsCounter from "@/components/ui/StatsCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ParallaxHero from "@/components/home/ParallaxHero";
import TrainCategorySection from "@/components/home/TrainCategorySection";
import { getProducts } from "@/lib/products";
import { cookies } from "next/headers";

export default async function HomePage() {
  // 1. Ambil data pakaian secara realtime dari database
  const products = await getProducts();
  const featuredProducts = products.slice(0, 3);

  // 2. Ambil data role dari cookies browser untuk pengecekan tombol admin
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  return (
    <div className="pt-[90px]">
      {/* ========================================
          HERO SECTION — Cinematic Parallax + Text Reveal
          ======================================== */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden grain-overlay">
        {/* ParallaxHero wraps the background so it scrolls at a different speed */}
        <ParallaxHero>
          <Image
            src="/hero-main.png"
            alt="EGOISM Campaign"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
        </ParallaxHero>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Staggered Text Reveal */}
          <div className="overflow-hidden mb-3">
            <p className="text-[12px] md:text-[13px] tracking-[0.3em] font-medium text-on-primary/80 uppercase animate-fade-in-up delay-200">
              EGOISM — SS26
            </p>
          </div>
          <div className="hero-text-line mb-2">
            <span style={{ animationDelay: "0.3s" }}>
              <h1 className="font-heading text-[44px] md:text-[96px] leading-[1.05] text-on-primary font-bold tracking-tight uppercase">
                THE NEW
              </h1>
            </span>
          </div>
          <div className="hero-text-line mb-8">
            <span style={{ animationDelay: "0.5s" }}>
              <p className="font-heading text-[44px] md:text-[96px] leading-[1.05] text-on-primary font-bold tracking-tight uppercase">
                COLLECTION
              </p>
            </span>
          </div>

          {/* Kelompokkan Tombol Navigasi Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-700">
            <Link
              href="/koleksi"
              className="text-[13px] tracking-[0.15em] font-semibold font-body text-on-primary border-b border-on-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase"
            >
              EXPLORE NOW
            </Link>

            {/* LOGIKA ADMIN DASHBOARD: Muncul otomatis jika akun yang login ber-role ADMIN */}
            {userRole === "ADMIN" && (
              <Link
                href="/admin"
                className="text-[13px] tracking-[0.15em] font-bold font-body text-amber-400 border-b border-amber-400 pb-1 hover:opacity-70 transition-opacity duration-300 uppercase sm:ml-6"
              >
                ADMIN DASHBOARD →
              </Link>
            )}
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in delay-1200">
          <span className="text-[10px] tracking-[0.3em] text-on-primary/60 uppercase font-light">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-on-primary/60 bounce-down"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>


      {/* ========================================
          NEW IN — Selected Pieces
          ======================================== */}
      <section
        className="max-w-[1440px] mx-auto px-5 md:px-16 py-[100px] md:py-[120px]"
        id="new-in"
      >
        <ScrollReveal>
          <div className="w-full text-center mb-16">
            <h2 className="font-heading text-[36px] md:text-[64px] leading-[1.05] text-primary uppercase tracking-tight font-bold">
              NEW IN
            </h2>
            <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mt-5">
              Fresh Drops This Week
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product: any, index: number) => (
            <ScrollReveal key={product.id} delay={index * 150}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========================================
          TOP 10 BESTSELLERS
          ======================================== */}
      {products.length > 4 && (
        <section
          className="max-w-[1440px] mx-auto px-5 md:px-16 pb-[100px] md:pb-[120px]"
          id="bestsellers"
        >
          <ScrollReveal>
            <div className="w-full text-center mb-16">
              <h2 className="font-heading text-[36px] md:text-[64px] leading-[1.05] text-primary uppercase tracking-tight font-bold">
                TOP 10 BESTSELLERS
              </h2>
              <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mt-5">
                Most Wanted Pieces
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {products.slice(4, 14).map((product: any, index: number) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <div className="flex justify-center mt-16">
              <Link
                href="/koleksi"
                className="inline-block border border-primary px-10 py-4 text-[13px] tracking-[0.15em] font-semibold font-body uppercase text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
              >
                VIEW ALL COLLECTION
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ========================================
          HOW DO YOU TRAIN? — Parallax Activity Cards
          ======================================== */}
      <ScrollReveal>
        <TrainCategorySection />
      </ScrollReveal>

      {/* ========================================
          BRAND STORY — Stats Counter
          ======================================== */}
      <StatsCounter />

      {/* ========================================
          BRAND STORY — About Egoism
          ======================================== */}
      <section className="relative w-full py-[120px] md:py-[180px] bg-surface overflow-hidden flex items-center justify-center border-t border-outline-variant/30">
        {/* Infinite Marquee Background */}
        <div className="absolute inset-0 flex flex-col justify-center gap-8 sm:gap-16 opacity-[0.03] pointer-events-none select-none overflow-hidden">
          <div className="marquee-track font-heading font-bold text-[80px] sm:text-[140px] md:text-[200px] uppercase text-primary leading-none">
            <span className="px-4">EGOISM PERFORMANCE • LUXURY STREETWEAR •</span>
            <span className="px-4">EGOISM PERFORMANCE • LUXURY STREETWEAR •</span>
          </div>
          <div className="marquee-track-reverse font-heading font-bold text-[80px] sm:text-[140px] md:text-[200px] uppercase text-primary leading-none">
            <span className="px-4">ONLY YOU MATTER • NO EXCUSES •</span>
            <span className="px-4">ONLY YOU MATTER • NO EXCUSES •</span>
            <span className="px-4">ONLY YOU MATTER • NO EXCUSES •</span>
          </div>
        </div>

        <ScrollReveal>
          <div className="relative z-10 max-w-[1000px] mx-auto text-center flex flex-col items-center px-5">
            <h2 className="text-[12px] md:text-[14px] leading-[16px] tracking-[0.4em] font-semibold text-secondary uppercase mb-8">
              OUR STORY
            </h2>
            <p className="font-heading text-[26px] md:text-[48px] leading-[1.3] text-primary tracking-tight font-medium drop-shadow-sm">
              Minimalist luxury performance wear. We bridge the gap between high-end streetwear and functional training apparel. Designed for those who demand excellence in every environment.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================
          QUOTE SECTION — Enhanced Typography
          ======================================== */}
      <section className="w-full py-[120px] md:py-[160px] bg-surface flex items-center justify-center px-5 md:px-16 border-y border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl text-center">
            <div className="w-16 h-[1px] bg-secondary/30 mx-auto mb-10" />
            <p className="font-heading text-[28px] md:text-[44px] leading-[1.2] text-primary tracking-tight font-medium italic">
              &ldquo;Only You Matter.&rdquo;
            </p>
            <div className="w-16 h-[1px] bg-secondary/30 mx-auto mt-10" />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
