import { getSession, clearSession, createSession } from "@/lib/session";
import { getWishlist } from "@/lib/wishlist";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { cookies } from "next/headers";
import { EmptyState } from "@/components/ui/untitled/EmptyState";
import { HeartCrack } from "lucide-react";

export default async function WishlistPage() {
  const session = await getSession();
  const userId = session?.userId;
  
  if (!userId) {
    return (
      <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-[64px] text-outline-variant/50 mb-6">lock</span>
        <h1 className="text-[24px] md:text-[32px] font-bold uppercase tracking-widest mb-4">Sign In Required</h1>
        <p className="text-[14px] text-secondary uppercase tracking-widest mb-8 text-center max-w-md">
          Silakan sign in terlebih dahulu untuk melihat daftar wishlist Anda.
        </p>
        <Link href="/login" className="px-8 py-4 bg-primary text-on-primary font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
          SIGN IN
        </Link>
      </div>
    );
  }

  const wishlist = await getWishlist();

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.2em] font-semibold text-secondary uppercase mb-2">
            YOUR SAVED ITEMS
          </p>
          <h1 className="text-[32px] md:text-[48px] font-bold uppercase tracking-tight text-primary">
            Wishlist
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon={HeartCrack}
            title="Wishlist Anda Kosong"
            description="Anda belum menyimpan satupun produk. Klik ikon hati pada produk untuk menyimpannya di sini."
            action={
              <Link href="/koleksi" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors">
                MULAI BELANJA
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item.product as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
