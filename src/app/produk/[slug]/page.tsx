import { getProductBySlug, getProducts } from "@/lib/products";
import { checkIsWishlisted } from "@/lib/wishlist";
import { getProductReviews, canUserReview } from "@/lib/reviews";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/ui/ProductDetail";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RecentlyViewed from "@/components/ui/RecentlyViewed";
import RecentlyViewedTracker from "@/components/ui/RecentlyViewedTracker";
import { Suspense } from "react";
import RelatedProductsWrapper from "@/components/ui/RelatedProductsWrapper";

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

// Dihapus agar Vercel tidak timeout membangun 143+ halaman ke database Singapura dari server Washington DC.
// Next.js otomatis akan merender halaman secara dinamis/on-demand.

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  // Parallel fetching untuk data produk (reviews, wishlist) agar 3x lebih cepat!
  const [isWishlisted, reviews, canReview] = await Promise.all([
    checkIsWishlisted(product.id),
    getProductReviews(product.id),
    canUserReview(product.id)
  ]);

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

      {/* Streaming render menggunakan Suspense agar tidak memblokir halaman produk utama */}
      <Suspense fallback={
        <div className="w-full py-16 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-outline-variant/30 mb-8 rounded"></div>
            <div className="flex gap-4">
              <div className="h-64 w-48 bg-outline-variant/30 rounded"></div>
              <div className="h-64 w-48 bg-outline-variant/30 rounded hidden sm:block"></div>
              <div className="h-64 w-48 bg-outline-variant/30 rounded hidden md:block"></div>
              <div className="h-64 w-48 bg-outline-variant/30 rounded hidden lg:block"></div>
            </div>
          </div>
        </div>
      }>
        <RelatedProductsWrapper slug={product.slug} category={product.category} />
      </Suspense>

      {/* Recently Viewed Section */}
      <RecentlyViewed currentProductId={product.id} />
    </>
  );
}
