import { getProducts } from "@/lib/products";
import PageHeader from "@/components/ui/PageHeader";
import ProductFilterClient from "@/components/ui/ProductFilterClient";

export const metadata = { title: "Collection — EGOISM" };

export default async function KoleksiPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader title="The Collection" subtitle="EXPLORE" />

      {/* Client component dengan filter kategori (ALL/MEN/WOMEN) + sort interaktif */}
      <ProductFilterClient
        initialProducts={products}
        showCategoryFilter={true}
      />
    </div>
  );
}
