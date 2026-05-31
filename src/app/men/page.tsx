import { getProductsByCategory } from "@/lib/products";
import MenClient from "./MenClient";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Men — EGOISM" };

export default async function MenPage() {
  const products = await getProductsByCategory("men");

  return (
    <div>
      <PageHeader title="Men" subtitle="COLLECTION" />
      <MenClient initialProducts={products} />
    </div>
  );
}
