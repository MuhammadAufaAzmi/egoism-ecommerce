export default function Skeleton({
  width,
  height,
  className = "",
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface-container-low animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[0.73] bg-surface-container-low mb-4" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-4 bg-surface-container-low w-3/4" />
        <div className="h-3 bg-surface-container-low w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 animate-pulse">
      <div className="bg-surface-container-low aspect-[0.75] w-full" />
      <div className="flex flex-col gap-6 py-2">
        <div className="h-12 bg-surface-container-low w-3/4" />
        <div className="h-6 bg-surface-container-low w-1/3" />
        <div className="border-t border-outline-variant/30 pt-6">
          <div className="space-y-3">
            <div className="h-4 bg-surface-container-low w-full" />
            <div className="h-4 bg-surface-container-low w-5/6" />
            <div className="h-4 bg-surface-container-low w-2/3" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-20 bg-surface-container-low" />
          ))}
        </div>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-16 bg-surface-container-low" />
          ))}
        </div>
        <div className="h-14 bg-surface-container-low w-full mt-4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-surface-container-low w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="animate-pulse border border-outline-variant/30 p-6">
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-surface-container-low w-1/4" />
        <div className="h-4 bg-surface-container-low w-1/6" />
      </div>
      <div className="h-3 bg-surface-container-low w-1/2 mb-3" />
      <div className="h-3 bg-surface-container-low w-1/3" />
    </div>
  );
}
