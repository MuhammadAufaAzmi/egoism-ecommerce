import { getProductsByCategory } from "@/lib/products";
import PageHeader from "@/components/ui/PageHeader";
import ProductFilterClient from "@/components/ui/ProductFilterClient";

export const metadata = { title: "Women — EGOISM" };

export default async function WomenPage() {
  const products = await getProductsByCategory("women");

  return (
    <div>
      <PageHeader title="Women" subtitle="COLLECTION" />

      {/* Client component dengan filter ukuran + sort interaktif */}
      <ProductFilterClient initialProducts={products} />
    </div>
  );
}
