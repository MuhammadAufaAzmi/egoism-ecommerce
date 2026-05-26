import { getProductsByCategory } from "@/lib/products";
import MenClient from "./MenClient";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Men — EGOISM" };

export default async function MenPage() {
  // Tetap mempertahankan struktur server async yang stabil untuk menarik data
  const products = await getProductsByCategory("men");

  return (
    <div>
      {/* Header Statis */}
      <PageHeader title="Men" subtitle="COLLECTION" />

      {/* Menyuntikkan komponen klien yang membawa fitur Sort & Filter interaktif */}
      <MenClient initialProducts={products} />
    </div>
  );
}
