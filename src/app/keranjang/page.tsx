import { getSession, clearSession, createSession } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCartItems,
  handleUpdateCartQuantity,
  handleRemoveCartItem,
  getProducts,
} from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/untitled/EmptyState";
import { ShoppingBag } from "lucide-react";

export const metadata = { title: "Shopping Bag — EGOISM" };

interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  fitType: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
}

export default async function KeranjangPage() {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    redirect("/login");
  }

  const items: CartItem[] = await getCartItems(userId);
  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );
  
  let recommendedProducts: any[] = [];
  if (items.length === 0) {
    const all = await getProducts();
    // Randomize or just pick 4
    recommendedProducts = all.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  const displayPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <main className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-12 md:py-24 pt-[120px]">
        <h1 className="text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] text-primary uppercase mb-16 tracking-tighter font-bold">
          SHOPPING BAG
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center">
            <EmptyState 
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Looks like you haven't added anything to your cart yet. Explore our latest arrivals."
              action={
                <Link
                  href="/koleksi"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors"
                >
                  Explore Collection
                </Link>
              }
            />
            
            <div className="w-full pt-16 border-t border-outline-variant/30">
              <h2 className="text-[20px] font-medium text-primary uppercase mb-8 tracking-widest text-center">
                YOU MIGHT ALSO LIKE
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                {recommendedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
            <div className="lg:col-span-8 flex flex-col">
              {items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row py-8 border-b border-outline-variant gap-8"
                >
                  <div className="w-full sm:w-48 flex-shrink-0 bg-surface-container-low relative aspect-[0.73]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[32px] leading-[40px] font-medium text-primary uppercase">
                          {item.name}
                        </h3>

                        {/* PERBAIKAN 1: Memanggil fungsi langsung di dalam form action bawaan server action */}
                        <form
                          action={async () => {
                            "use server";
                            await handleRemoveCartItem(item.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="font-sans font-light text-xl">
                              ✕
                            </span>
                          </button>
                        </form>
                      </div>
                      <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-on-surface-variant mb-6 uppercase">
                        COLOR: {item.color} | SIZE: {item.size} | FIT: {item.fitType}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-outline-variant">
                        {/* PERBAIKAN 2: Memanggil pengurangan kuantitas dengan melewatkan argumen langsung */}
                        <form
                          action={async () => {
                            "use server";
                            await handleUpdateCartQuantity(
                              item.id,
                              item.quantity,
                              -1,
                            );
                          }}
                        >
                          <button
                            type="submit"
                            className="px-3 py-2 text-primary hover:bg-surface-container-low transition-colors"
                          >
                            -
                          </button>
                        </form>

                        <span className="text-[16px] px-4 py-2 border-l border-r border-outline-variant">
                          {item.quantity}
                        </span>

                        {/* PERBAIKAN 3: Memanggil penambahan kuantitas dengan melewatkan argumen langsung */}
                        <form
                          action={async () => {
                            "use server";
                            await handleUpdateCartQuantity(
                              item.id,
                              item.quantity,
                              1,
                            );
                          }}
                        >
                          <button
                            type="submit"
                            className="px-3 py-2 text-primary hover:bg-surface-container-low transition-colors"
                          >
                            +
                          </button>
                        </form>
                      </div>
                      <p className="text-[18px] text-primary">
                        {displayPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 mt-12 lg:mt-0">
              <div className="sticky top-[120px] bg-surface-container-lowest p-8 border border-outline-variant">
                <h2 className="text-[32px] leading-[40px] font-medium text-primary uppercase mb-8 border-b border-outline-variant pb-4">
                  ORDER SUMMARY
                </h2>
                <div className="flex flex-col gap-4 mb-8 border-b border-outline-variant pb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[16px] text-on-surface-variant">
                      SUBTOTAL
                    </span>
                    <span className="text-[16px] text-primary">
                      {displayPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[16px] text-on-surface-variant">
                      SHIPPING
                    </span>
                    <span className="text-[16px] text-primary text-right text-sm">
                      CALCULATED AT CHECKOUT
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[32px] leading-[40px] font-medium text-primary uppercase">
                    TOTAL
                  </span>
                  <span className="text-[32px] leading-[40px] font-medium text-primary">
                    {displayPrice(subtotal)}
                  </span>
                </div>

                {/* PERBAIKAN: Mengubah <button> biasa menjadi <Link> yang mengarah ke "/checkout" */}
                <Link
                  href="/checkout"
                  className="block text-center w-full bg-primary text-on-primary text-[14px] tracking-[0.05em] font-bold uppercase py-4 hover:opacity-90 transition-opacity"
                >
                  CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
