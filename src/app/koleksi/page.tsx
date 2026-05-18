import ProductCard from "@/components/ui/ProductCard";
// PERBAIKAN: Mengubah import variabel 'products' menjadi fungsi database 'getProducts'
import { getProducts } from "@/lib/products";

export const metadata = { title: "Collection — EGOISM" };

// PERBAIKAN: Mengubah komponen menjadi async function agar bisa memproses query database
export default async function KoleksiPage() {
  // PERBAIKAN: Memanggil data pakaian secara realtime dan asinkron dari MySQL via Prisma
  const products = await getProducts();

  return (
    <div className="pt-[90px]">
      {/* Header */}
      <div className="w-full px-5 md:px-16 py-20 md:py-[120px] max-w-[1440px] mx-auto">
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase mb-4">
          EGOISM
        </p>
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] font-bold uppercase tracking-tight text-primary">
          THE COLLECTION
        </h1>
      </div>

      {/* Filters Bar */}
      <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto border-t border-outline-variant py-6 flex justify-between items-center mb-12">
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase">
          {products.length} PIECES
        </p>
        <div className="flex gap-6">
          <button className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary hover:text-primary transition-colors uppercase">
            ALL
          </button>
          <button className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary hover:text-primary transition-colors uppercase">
            MEN
          </button>
          <button className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary hover:text-primary transition-colors uppercase">
            WOMEN
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
            The archives are currently empty. Use control panel to publish
            garments.
          </div>
        )}
      </div>
    </div>
  );
}
