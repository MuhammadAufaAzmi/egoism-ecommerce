import ProductCard from "@/components/ui/ProductCard";
import { getProductsByCategory } from "@/lib/products";

export const metadata = { title: "Women — EGOISM" };

// PERBAIKAN: Mengubah komponen menjadi async function agar bisa melakukan proses sinkronisasi server
export default async function WomenPage() {
  // PERBAIKAN: Menambahkan await agar data array produk berhasil ditarik sepenuhnya sebelum halaman dirender
  const products = await getProductsByCategory("women");

  return (
    <div className="pt-[90px]">
      {/* Header */}
      <div className="w-full px-5 md:px-16 py-20 md:py-[120px] max-w-[1440px] mx-auto">
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase mb-4">
          COLLECTION
        </p>
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] font-bold uppercase tracking-tight text-primary">
          WOMEN
        </h1>
      </div>

      {/* Filters Bar */}
      <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto border-t border-outline-variant py-6 flex justify-between items-center mb-12">
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase">
          {products.length} PIECES
        </p>
        <div className="flex gap-6">
          <button className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary hover:text-primary transition-colors uppercase">
            FILTER
          </button>
          <button className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary hover:text-primary transition-colors uppercase">
            SORT
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto pb-24">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-24 border border-dashed border-outline-variant/30 font-['Inter'] text-secondary uppercase tracking-wider text-[14px]">
            No garments available in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
