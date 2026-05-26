import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-[130px] pb-4">
      <ol className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase">
        <li>
          <Link href="/" className="text-secondary hover:text-primary transition-colors font-medium">
            Home
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-outline-variant/60">/</span>
            {item.href ? (
              <Link href={item.href} className="text-secondary hover:text-primary transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-primary font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
