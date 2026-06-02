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
          SOCIAL PROOF — Testimonials & Instagram
          ======================================== */}
      <section className="w-full py-[100px] md:py-[140px] bg-surface-container-lowest border-y border-outline-variant/30 px-5 md:px-16">
        <ScrollReveal>
          <div className="max-w-[1440px] mx-auto text-center mb-16">
            <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mb-5">
              THE COMMUNITY
            </p>
            <h2 className="font-heading text-[36px] md:text-[56px] leading-[1.05] text-primary uppercase tracking-tight font-bold">
              Loved by Athletes
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <ScrollReveal delay={100}>
            <div className="bg-surface p-8 border border-outline-variant/30 relative flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1 mb-4 text-primary">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[16px]">star</span>)}
                </div>
                <p className="text-[15px] italic text-primary leading-relaxed mb-8">
                  "Bahan bajunya bener-bener premium. Buat latihan berat tetep nyaman dan nyerap keringat. Definitely my go-to gymwear now."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/50 overflow-hidden relative">
                  <Image src="https://ui-avatars.com/api/?name=Randi+P&background=1a1a1a&color=fff" fill alt="Randi P" className="object-cover" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-primary">Randi P.</span>
                  <span className="text-[10px] uppercase text-secondary">Verified Buyer</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-surface p-8 border border-outline-variant/30 relative flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1 mb-4 text-primary">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[16px]">star</span>)}
                </div>
                <p className="text-[15px] italic text-primary leading-relaxed mb-8">
                  "Cuttingan bajunya pas banget di badan. Bikin kelihatan lebih tegap pas lagi workout. Pengiriman juga super cepat!"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/50 overflow-hidden relative">
                  <Image src="https://ui-avatars.com/api/?name=Dimas+S&background=1a1a1a&color=fff" fill alt="Dimas S" className="object-cover" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-primary">Dimas S.</span>
                  <span className="text-[10px] uppercase text-secondary">Verified Buyer</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="bg-surface p-8 border border-outline-variant/30 relative flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1 mb-4 text-primary">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[16px]">star</span>)}
                </div>
                <p className="text-[15px] italic text-primary leading-relaxed mb-8">
                  "Udah punya 3 koleksi dari EGOISM. Kualitasnya setara brand luar tapi harga lokal. Bakal nunggu koleksi berikutnya."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/50 overflow-hidden relative">
                  <Image src="https://ui-avatars.com/api/?name=Kevin+A&background=1a1a1a&color=fff" fill alt="Kevin A" className="object-cover" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-primary">Kevin A.</span>
                  <span className="text-[10px] uppercase text-secondary">Verified Buyer</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={400}>
          <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-12 border-t border-outline-variant/30 pt-16">
            <p className="text-[14px] text-secondary mb-6 tracking-wide text-center">
              Tandai <span className="font-bold text-primary">@egoism.id</span> di Instagram untuk kesempatan di-feature.
            </p>
            <a
              href="https://www.instagram.com/egoism.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 text-[13px] tracking-[0.15em] font-semibold uppercase hover:bg-transparent hover:text-primary border border-primary transition-colors duration-300"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              Follow EGOISM di Instagram
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
