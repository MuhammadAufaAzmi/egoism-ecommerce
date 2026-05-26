import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import MarqueeStrip from "@/components/ui/MarqueeStrip";
import StatsCounter from "@/components/ui/StatsCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getProducts } from "@/lib/products";
import { cookies } from "next/headers";
import { cancelExpiredOrders } from "@/lib/admin";

export default async function HomePage() {
  // 1. Ambil data pakaian secara realtime dari database MySQL XAMPP
  const products = await getProducts();
  const featuredProducts = products.slice(0, 3);

  // 2. Ambil data role dari cookies browser untuk pengecekan tombol admin
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  return (
    <div className="pt-[90px]">
      {/* ========================================
          HERO SECTION — Cinematic + Text Reveal + Grain + Scroll Indicator
          ======================================== */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden grain-overlay">
        <div className="absolute inset-0 w-full h-full">
          {/* Hero Background — pastikan file ini ada di public/hero-main.jpg dan sudah di-commit ke git */}
          <Image
            src="/hero-main.jpg"
            alt="EGOISM Campaign"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
        </div>
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
          MARQUEE STRIP — Animated Running Text
          ======================================== */}
      <MarqueeStrip />

      {/* ========================================
          NEW ARRIVALS — Selected Pieces
          ======================================== */}
      <section
        className="max-w-[1440px] mx-auto px-5 md:px-16 py-[100px] md:py-[120px]"
        id="shop"
      >
        <ScrollReveal>
          <div className="w-full text-center mb-16">
            <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mb-5">
              NEW ARRIVALS
            </p>
            <h2 className="font-heading text-[36px] md:text-[64px] leading-[1.05] text-primary uppercase tracking-tight font-bold">
              Selected Pieces
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product: any, index: number) => (
            <ScrollReveal key={product.id} delay={index * 150}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={500}>
          <div className="flex justify-center mt-16">
            <Link
              href="/koleksi"
              className="inline-block border border-primary px-10 py-4 text-[13px] tracking-[0.15em] font-semibold font-body uppercase text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
            >
              VIEW ALL
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================
          BRAND STORY — Stats Counter
          ======================================== */}
      <StatsCounter />

      {/* ========================================
          QUOTE SECTION — Enhanced Typography
          ======================================== */}
      <section className="w-full py-[120px] md:py-[160px] bg-surface flex items-center justify-center px-5 md:px-16 border-y border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl text-center">
            <div className="w-16 h-[1px] bg-secondary/30 mx-auto mb-10" />
            <p className="font-heading text-[28px] md:text-[44px] leading-[1.2] text-primary tracking-tight font-medium italic">
              &ldquo;Dressed for the architecture of solitude. Worn for the
              theatre of the self.&rdquo;
            </p>
            <div className="w-16 h-[1px] bg-secondary/30 mx-auto mt-10" />
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================
          CATEGORY SPLIT — Men / Women
          ======================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 max-w-[1440px] mx-auto px-5 md:px-16 py-20 md:py-24 gap-6">
        <ScrollReveal>
          <Link
            href="/men"
            className="group relative overflow-hidden aspect-[0.9] block"
          >
            <Image
              src="/uploads/Screenshot 2026-05-16 231205.png"
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/35 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-on-primary uppercase mb-2 opacity-80">
                MEN
              </p>
              <h3 className="font-heading text-[36px] md:text-[42px] leading-[1.05] text-on-primary uppercase tracking-tight font-bold">
                Shop Men
              </h3>
            </div>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <svg
                className="w-6 h-6 text-on-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <Link
            href="/women"
            className="group relative overflow-hidden aspect-[0.9] block"
          >
            <Image
              src="/uploads/Screenshot 2026-05-16 231846.png"
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/35 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-on-primary uppercase mb-2 opacity-80">
                WOMEN
              </p>
              <h3 className="font-heading text-[36px] md:text-[42px] leading-[1.05] text-on-primary uppercase tracking-tight font-bold">
                Shop Women
              </h3>
            </div>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <svg
                className="w-6 h-6 text-on-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </Link>
        </ScrollReveal>
      </section>


    </div>
  );
}
