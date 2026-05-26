"use client";

import Skeleton from "@/components/ui/Skeleton";
import PageHeader from "@/components/ui/PageHeader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-container-lowest pb-24">
      <PageHeader
        title="Men"
        subtitle="Memuat katalog terbaru pria..."
        align="left"
      />
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 mt-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Skeleton width="100%" height={24} className="mb-6" />
            <Skeleton width="100%" height={16} className="mb-3" />
            <Skeleton width="100%" height={16} className="mb-3" />
            <Skeleton width="80%" height={16} className="mb-8" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton width="100%" height={300} className="mb-4 aspect-[3/4]" />
                  <Skeleton width="80%" height={20} className="mb-2" />
                  <Skeleton width="50%" height={16} className="mb-2" />
                  <Skeleton width="40%" height={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
