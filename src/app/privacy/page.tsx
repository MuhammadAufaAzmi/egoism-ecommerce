import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { title: "Privacy Policy — EGOISM" };

const sections = [
  {
    num: "01",
    title: "COLLECTION",
    primary:
      "WHEN YOU PURCHASE A GARMENT FROM OUR STORE, WE COLLECT THE PERSONAL INFORMATION YOU GIVE US SUCH AS YOUR NAME, ADDRESS, AND EMAIL ADDRESS.",
    secondary:
      "WHEN YOU BROWSE OUR STORE, WE ALSO AUTOMATICALLY RECEIVE YOUR COMPUTER'S INTERNET PROTOCOL (IP) ADDRESS IN ORDER TO PROVIDE US WITH INFORMATION THAT HELPS US LEARN ABOUT YOUR BROWSER AND OPERATING SYSTEM.",
    cta: null,
  },
  {
    num: "02",
    title: "CONSENT",
    primary:
      "BY PROVIDING US WITH PERSONAL INFORMATION TO COMPLETE A TRANSACTION, VERIFY YOUR PAYMENT, PLACE AN ORDER, OR ARRANGE FOR A DELIVERY, YOU IMPLY YOUR CONSENT.",
    secondary:
      "IF WE ASK FOR YOUR PERSONAL INFORMATION FOR A SECONDARY REASON, SUCH AS EXCLUSIVE MARKETING CAMPAIGNS, WE WILL EITHER ASK YOU DIRECTLY FOR YOUR EXPRESSED CONSENT OR PROVIDE YOU WITH AN OPPORTUNITY TO DECLINE.",
    cta: null,
  },
  {
    num: "03",
    title: "SECURITY",
    primary:
      "TO PROTECT YOUR PERSONAL INFORMATION, WE TAKE PRECAUTIONS AND FOLLOW INDUSTRY BEST PRACTICES TO ENSURE IT IS NOT INAPPROPRIATELY LOST, MISUSED, OR ACCESSED.",
    secondary:
      "ALTHOUGH NO METHOD OF TRANSMISSION OVER THE INTERNET OR ELECTRONIC STORAGE IS 100% SECURE, WE IMPLEMENT GENERALLY ACCEPTED INDUSTRY STANDARDS AND ADVANCED ENCRYPTION TO SAFEGUARD YOUR IDENTITY.",
    cta: "READ FULL POLICY",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col">
      <PageHeader title="Privacy Policy" subtitle="LEGAL" />

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
                        href="#"
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
