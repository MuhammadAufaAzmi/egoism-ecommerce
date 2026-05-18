import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ui/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // PERBAIKAN: Menambahkan 'await' agar data produk ditunggu sampai selesai ditarik dari database
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
