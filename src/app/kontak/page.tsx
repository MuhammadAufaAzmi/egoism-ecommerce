import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact — EGOISM" };

export default function KontakPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen pb-[80px]">
      <PageHeader title="Contact Us" subtitle="GET IN TOUCH" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-16">
        {/* Split Layout */}
        <section className="flex flex-col md:flex-row w-full gap-24 mt-12">
          {/* Left: Info */}
          <ScrollReveal className="w-full md:w-1/2">
            <div className="flex flex-col gap-16">
              <div>
                <h2 className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mb-6">
                  ENQUIRIES
                </h2>
                <p className="text-[32px] leading-[40px] font-medium text-primary uppercase mb-2">
                  CUSTOMER SERVICE
                </p>
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:egoismliftingtee@gmail.com"
                    className="text-[16px] md:text-[18px] leading-[28px] text-secondary hover:text-primary transition-colors duration-300 lowercase"
                  >
                    egoismliftingtee@gmail.com
                  </a>
                  <a
                    href="https://wa.me/6285186882686"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] md:text-[18px] leading-[28px] text-secondary hover:text-primary transition-colors duration-300"
                  >
                    +62 851-8688-2686
                  </a>
                </div>
              </div>
              <div>
                <h2 className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold text-secondary uppercase mb-6">
                  HEADQUARTERS
                </h2>
                <p className="text-[14px] md:text-[16px] leading-[28px] text-secondary uppercase leading-relaxed">
                  Ruko Tabespot Blok G1 No. 12
                  <br />
                  Pagedangan, Kec. Pagedangan
                  <br />
                  Kabupaten Tangerang, Banten 15339
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Form */}
          <ScrollReveal delay={200} className="w-full md:w-1/2">
            <ContactForm />
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
