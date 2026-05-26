import ProductCard from "@/components/ui/ProductCard";

interface RelatedProductsProps {
  products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-24 border-t border-outline-variant/20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-[11px] tracking-[0.2em] font-semibold text-secondary uppercase mb-2">
            CURATED FOR YOU
          </p>
          <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-tight text-primary">
            You May Also Like
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
