import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { title: "Terms of Service — EGOISM" };

const sections = [
  {
    num: "01",
    title: "AGREEMENT",
    primary:
      "BY ACCESSING OR USING THE EGOISM PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND ALL APPLICABLE LAWS.",
    secondary:
      "IF YOU DO NOT AGREE TO ALL THE TERMS AND CONDITIONS OF THIS AGREEMENT, YOU MAY NOT ACCESS THE WEBSITE OR USE ANY OF OUR SERVICES. THESE TERMS APPLY TO ALL USERS OF THE SITE.",
    cta: null,
  },
  {
    num: "02",
    title: "PRODUCTS",
    primary:
      "WE RESERVE THE RIGHT TO MODIFY, LIMIT, OR DISCONTINUE ANY PRODUCT, SERVICE, OR COLLECTION WITHOUT NOTICE AT ANY TIME.",
    secondary:
      "PRICES FOR OUR GARMENTS ARE SUBJECT TO CHANGE WITHOUT NOTICE. WE SHALL NOT BE LIABLE TO YOU OR ANY THIRD-PARTY FOR ANY MODIFICATION, PRICE CHANGE, SUSPENSION, OR DISCONTINUANCE OF THE SERVICE.",
    cta: null,
  },
  {
    num: "03",
    title: "CONDUCT",
    primary:
      "YOU AGREE NOT TO REPRODUCE, DUPLICATE, COPY, SELL, RESELL OR EXPLOIT ANY PORTION OF THE SERVICE, OR ANY CONTACT ON THE WEBSITE THROUGH WHICH THE SERVICE IS PROVIDED.",
    secondary:
      "A BREACH OR VIOLATION OF ANY OF THE TERMS WILL RESULT IN AN IMMEDIATE TERMINATION OF YOUR SERVICES AND ACCESS TO THE EGOISM PLATFORM. WE RESERVE THE RIGHT TO REFUSE SERVICE TO ANYONE FOR ANY REASON.",
    cta: "CONTACT SUPPORT",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col">
      <PageHeader title="Terms of Service" subtitle="LEGAL" />

      {/* Sections */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-16 pb-[100px]">
        <div className="flex flex-col w-full">
          {sections.map((section, i) => (
            <ScrollReveal key={section.num} delay={i * 150}>
              <section
                className={`border-t border-outline-variant flex flex-col md:flex-row py-12 md:py-20 transition-colors duration-300 ${
                  i === sections.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="md:w-1/3 text-[32px] leading-[40px] font-medium text-primary mb-6 md:mb-0">
                  {section.num}. {section.title}
                </div>
                <div className="md:w-2/3 flex flex-col gap-6 md:pr-20">
                  <p className="text-[18px] leading-[28px] text-primary max-w-3xl leading-relaxed">
                    {section.primary}
                  </p>
                  <p className="text-[16px] leading-[24px] text-secondary max-w-2xl leading-relaxed">
                    {section.secondary}
                  </p>
                  {section.cta && (
                    <div className="mt-8">
                      <a
                        href="/kontak"
                        className="inline-block border border-primary px-8 py-4 text-[14px] tracking-[0.05em] font-medium uppercase text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
                      >
                        {section.cta}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
