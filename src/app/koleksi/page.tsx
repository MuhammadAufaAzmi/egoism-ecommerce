import { getProducts } from "@/lib/products";
import PageHeader from "@/components/ui/PageHeader";
import ProductFilterClient from "@/components/ui/ProductFilterClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Collection — EGOISM",
  description: "Temukan koleksi fashion minimalis premium EGOISM. Baju, celana, dan outfit elegan untuk pria dan wanita dengan kualitas terbaik.",
  openGraph: {
    title: "The Collection — EGOISM",
    description: "Koleksi fashion minimalis premium untuk pria dan wanita.",
    type: "website",
    url: "https://egoism.id/koleksi",
  },
};


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
