import Image from "next/image";
import Link from "next/link";
// PERBAIKAN 1: Hapus 'formatPrice' dari impor ini
import { Product } from "@/lib/products";

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
      <div className="w-full aspect-[0.73] overflow-hidden mb-4 bg-surface-container relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-primary text-on-primary text-[11px] tracking-[0.1em] font-semibold font-['Inter'] px-3 py-1 uppercase">
            NEW
          </span>
        )}
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="text-[14px] leading-[20px] tracking-[0.05em] font-medium font-['Inter'] text-primary mb-2 uppercase">
          {product.name}
        </h3>
        {/* PERBAIKAN 3: Gunakan fungsi displayPrice lokal */}
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary">
          {displayPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
