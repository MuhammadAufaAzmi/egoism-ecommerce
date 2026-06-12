export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest">
      <div className="flex flex-col items-center gap-4">
        {/* Simple minimalist spinner */}
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.3em] text-primary uppercase font-bold animate-pulse">
          LOADING EGOISM
        </p>
      </div>
    </div>
  );
}
