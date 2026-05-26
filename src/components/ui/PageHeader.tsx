"use client";

import ScrollReveal from "./ScrollReveal";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  align = "center",
  children,
}: PageHeaderProps) {
  const textAlign = align === "left" ? "text-left" : "text-center";
  const maxWidth = align === "left" ? "" : "max-w-2xl mx-auto";

  return (
    <section className="pt-[120px] pb-16 md:pb-20">
      <div className={`max-w-[1440px] mx-auto px-5 md:px-16 ${textAlign}`}>
        {subtitle && (
          <ScrollReveal>
            <p className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mb-5">
              {subtitle}
            </p>
          </ScrollReveal>
        )}
        <ScrollReveal delay={100}>
          <h1 className="font-heading text-[36px] md:text-[72px] leading-[1.05] font-bold text-primary uppercase tracking-tight">
            {title}
          </h1>
        </ScrollReveal>
        {description && (
          <ScrollReveal delay={200}>
            <p className={`mt-5 text-[14px] md:text-[16px] leading-[24px] text-secondary ${maxWidth}`}>
              {description}
            </p>
          </ScrollReveal>
        )}
        {children && (
          <ScrollReveal delay={300}>
            <div className="mt-6">{children}</div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

