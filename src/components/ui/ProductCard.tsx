import Image from "next/image";
import Link from "next/link";
// PERBAIKAN 1: Hapus 'formatPrice' dari impor ini
import { Product } from "@/lib/products";
import WishlistButton from "@/components/ui/WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // PERBAIKAN 2: Buat fungsi format harga lokal yang sinkron (tanpa async)
  const displayPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group cursor-pointer block"
    >
      <div className="w-full aspect-[0.73] overflow-hidden mb-4 bg-surface-container relative shadow-none group-hover:shadow-xl transition-shadow duration-500">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-primary text-on-primary text-[11px] tracking-[0.1em] font-semibold px-3 py-1 uppercase">
            NEW
          </span>
        )}
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 flex items-end justify-center pb-6">
          <span className="text-[11px] tracking-[0.2em] font-semibold text-on-primary uppercase opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 bg-primary/80 backdrop-blur-sm px-5 py-2">
            QUICK VIEW
          </span>
        </div>
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton productId={product.id} className="bg-surface/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-surface" />
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="text-[14px] leading-[20px] tracking-[0.05em] font-medium text-primary mb-2 uppercase group-hover:opacity-70 transition-opacity duration-300">
          {product.name}
        </h3>
        {/* PERBAIKAN 3: Gunakan fungsi displayPrice lokal */}
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary">
          {displayPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
