import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";
import { checkIsWishlisted } from "@/lib/wishlist";
import { getProductReviews, canUserReview } from "@/lib/reviews";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/ui/ProductDetail";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedProducts from "@/components/ui/RelatedProducts";
import RecentlyViewed from "@/components/ui/RecentlyViewed";
import RecentlyViewedTracker from "@/components/ui/RecentlyViewedTracker";

// === Dynamic Metadata per Product ===
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found — EGOISM" };
  }

  const description = product.description
    ? product.description.slice(0, 155) + "..."
    : `Shop ${product.name} dari EGOISM. Luxury minimalist fashion.`;

  return {
    title: `${product.name} — EGOISM`,
    description,
    openGraph: {
      title: `${product.name} — EGOISM`,
      description,
      images: product.image ? [{ url: product.image }] : [],
      type: "website",
    },
    // JSON-LD structured data
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": "IDR",
    },
  };
}

// === Static Params (optional, for SSG) ===
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p: any) => ({ slug: p.slug }));
}

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

  // JSON-LD Structured Data untuk Google Shopping / Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://egoism.id/produk/${product.slug}`,
    },
    aggregateRating:
      reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue:
              reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
              reviews.length,
            reviewCount: reviews.length,
          }
        : undefined,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

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

      {/* Tracker: simpan ke localStorage (client component) */}
      <RecentlyViewedTracker
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
        }}
      />

      {related.length > 0 && <RelatedProducts products={related} />}

      {/* Recently Viewed Section */}
      <RecentlyViewed currentProductId={product.id} />
    </>
  );
}
