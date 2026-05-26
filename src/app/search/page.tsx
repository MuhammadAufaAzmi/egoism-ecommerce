import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Search — EGOISM" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Parsing parameter URL sesuai standar Next.js 15
  const params = await searchParams;
  const query = params.q || "";

  // Tarik semua produk dan saring berdasarkan nama atau kategori
  const allProducts = await getProducts();
  const searchResults = allProducts.filter(
    (p: any) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Search Results"
        subtitle={`${searchResults.length} RESULTS FOR "${query}"`}
      />

      <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto py-24">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
            {searchResults.map((product: any, index: number) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <div className="w-full flex flex-col items-center text-center py-24">
              <span className="text-[14px] text-secondary uppercase tracking-widest mb-6">
                NO GARMENTS MATCHING YOUR QUERY.
              </span>
              <Link
                href="/koleksi"
                className="border border-primary px-10 py-4 text-[13px] tracking-[0.1em] font-medium uppercase text-primary hover:bg-primary hover:text-on-primary transition-colors"
              >
                BROWSE COLLECTION
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
