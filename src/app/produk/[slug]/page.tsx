import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";
import { checkIsWishlisted } from "@/lib/wishlist";
import { getProductReviews, canUserReview } from "@/lib/reviews";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ui/ProductDetail";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedProducts from "@/components/ui/RelatedProducts";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Get related products (same category, exclude current)
  const related = await getRelatedProducts(product.slug, product.category, 4);

  const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  const isWishlisted = await checkIsWishlisted(product.id);
  const reviews = await getProductReviews(product.id);
  const canReview = await canUserReview(product.id);

  return (
    <>
      <Breadcrumb
        items={[
          { label: categoryLabel, href: `/${product.category}` },
          { label: product.name },
        ]}
      />
      <ProductDetail 
        product={product} 
        initialWishlisted={isWishlisted} 
        reviews={reviews} 
        canReview={canReview} 
      />
      {related.length > 0 && <RelatedProducts products={related} />}
    </>
  );
}
