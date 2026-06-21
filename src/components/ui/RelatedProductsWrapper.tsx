import { getRelatedProducts } from "@/lib/products";
import RelatedProducts from "@/components/ui/RelatedProducts";

export default async function RelatedProductsWrapper({ slug, category }: { slug: string, category: string }) {
  const related = await getRelatedProducts(slug, category, 4);
  
  if (!related || related.length === 0) return null;
  
  return <RelatedProducts products={related} />;
}
