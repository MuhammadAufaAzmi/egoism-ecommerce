export default function MarqueeStrip() {
  const items = [
    "FREE SHIPPING WORLDWIDE",
    "NEW COLLECTION SS26",
    "EGOISM",
    "LUXURY MINIMALIST FASHION",
    "CURATED FOR YOU",
    "EGOISM",
  ];

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-8 mx-8">
      <span className="text-[13px] md:text-[14px] tracking-[0.25em] font-light uppercase whitespace-nowrap">
        {item}
      </span>
      <span className="text-[8px] text-secondary/50">✦</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden bg-surface-container border-y border-outline-variant/20 py-4">
      <div className="marquee-track">
        {/* Duplicate content for seamless loop */}
        <div className="flex items-center">{content}</div>
        <div className="flex items-center" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}
