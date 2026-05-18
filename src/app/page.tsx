import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/products";
import { cookies } from "next/headers";

export default async function HomePage() {
  // 1. Ambil data pakaian secara realtime dari database MySQL XAMPP
  const products = await getProducts();
  const featuredProducts = products.slice(0, 3);

  // 2. Ambil data role dari cookies browser untuk pengecekan tombol admin
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  return (
    <div className="pt-[90px]">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {/* Latar Belakang Animated WEBP dipasang di sini */}
          <Image
            src="/webp/hero-bg.webp"
            alt="EGOISM Campaign"
            fill
            unoptimized /* SANGAT PENTING: Agar WEBP tetap bergerak & tidak di-freeze oleh Next.js */
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="font-heading text-[48px] md:text-[100px] leading-[52px] md:leading-[104px] text-on-primary mb-8 tracking-[0.08em] uppercase">
            THE NEW COLLECTION
          </h1>

          {/* Kelompokkan Tombol Navigasi Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/koleksi"
              className="text-[13px] tracking-[0.15em] font-semibold font-body text-on-primary border-b border-on-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase"
            >
              EXPLORE NOW
            </Link>

            {/* LOGIKA ADMIN DASHBOARD: Muncul otomatis jika akun yang login ber-role ADMIN */}
            {userRole === "ADMIN" && (
              <Link
                href="/admin/tambah-produk"
                className="text-[13px] tracking-[0.15em] font-bold font-body text-amber-400 border-b border-amber-400 pb-1 hover:opacity-70 transition-opacity duration-300 uppercase sm:ml-6"
              >
                ADMIN DASHBOARD →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section
        className="max-w-[1440px] mx-auto px-5 md:px-16 py-[120px]"
        id="shop"
      >
        <div className="w-full text-center mb-16">
          <h2 className="text-[12px] leading-[16px] tracking-[0.15em] font-semibold font-body text-secondary uppercase mb-4">
            NEW ARRIVALS
          </h2>
          <h3 className="font-heading text-[48px] md:text-[64px] leading-[52px] md:leading-[68px] text-primary uppercase tracking-[0.06em]">
            Selected Pieces
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center mt-16">
          <Link
            href="/koleksi"
            className="inline-block border border-primary px-10 py-4 text-[13px] tracking-[0.15em] font-semibold font-body uppercase text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            VIEW ALL
          </Link>
        </div>
      </section>

      {/* Quote Section */}
      <section className="w-full py-[160px] bg-surface flex items-center justify-center px-5 md:px-16 border-y border-outline-variant/30">
        <div className="max-w-3xl text-center">
          <p className="font-heading text-[36px] md:text-[48px] leading-[40px] md:leading-[52px] text-primary tracking-[0.06em] uppercase">
            "DRESSED FOR THE ARCHITECTURE OF SOLITUDE. WORN FOR THE THEATRE OF
            THE SELF."
          </p>
        </div>
      </section>

      {/* Category Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 max-w-[1440px] mx-auto px-5 md:px-16 py-24 gap-6">
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
          <div className="absolute inset-0 bg-primary/20" />
          <div className="absolute bottom-8 left-8">
            <p className="text-[12px] leading-[16px] tracking-[0.15em] font-semibold font-body text-on-primary uppercase mb-2">
              MEN
            </p>
            <h3 className="font-heading text-[42px] leading-[44px] text-on-primary uppercase tracking-[0.05em]">
              Shop Men
            </h3>
          </div>
        </Link>
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
          <div className="absolute inset-0 bg-primary/20" />
          <div className="absolute bottom-8 left-8">
            <p className="text-[12px] leading-[16px] tracking-[0.15em] font-semibold font-body text-on-primary uppercase mb-2">
              WOMEN
            </p>
            <h3 className="font-heading text-[42px] leading-[44px] text-on-primary uppercase tracking-[0.05em]">
              Shop Women
            </h3>
          </div>
        </Link>
      </section>
    </div>
  );
}
