import type { Metadata } from "next";

export const metadata: Metadata = { title: "Return Policy — EGOISM" };

const sections = [
  {
    num: "01",
    title: "ELIGIBILITY",
    primary:
      "ITEMS MUST BE RETURNED WITHIN 14 DAYS OF RECEIPT. GARMENTS MUST BE UNWORN, UNWASHED, AND IN THEIR ORIGINAL CONDITION WITH ALL TAGS ATTACHED.",
    secondary:
      "WE RESERVE THE RIGHT TO REFUSE RETURNS THAT DO NOT MEET THESE CRITERIA. ARCHIVE SALE ITEMS AND LIMITED RUN COLLECTIONS ARE FINAL SALE AND CANNOT BE RETURNED.",
    cta: null,
  },
  {
    num: "02",
    title: "PROCESS",
    primary:
      "INITIATE A RETURN THROUGH OUR PORTAL. A PRE-PAID SHIPPING LABEL WILL BE GENERATED. SECURELY PACK THE ITEMS IN THEIR ORIGINAL PACKAGING.",
    secondary:
      "A RETURN SHIPPING FEE OF IDR 25,000 WILL BE DEDUCTED FROM YOUR FINAL REFUND AMOUNT. ENSURE THE PACKAGE IS DROPPED OFF AT AN AUTHORIZED CARRIER LOCATION WITHIN 7 DAYS OF LABEL CREATION.",
    cta: "INITIATE RETURN",
  },
  {
    num: "03",
    title: "REFUNDS",
    primary:
      "ONCE YOUR RETURN IS RECEIVED AND INSPECTED, WE WILL SEND YOU AN EMAIL TO NOTIFY YOU OF THE APPROVAL OR REJECTION OF YOUR REFUND.",
    secondary:
      "IF APPROVED, YOUR REFUND WILL BE PROCESSED, AND A CREDIT WILL AUTOMATICALLY BE APPLIED TO YOUR ORIGINAL METHOD OF PAYMENT WITHIN 5-10 BUSINESS DAYS, DEPENDING ON YOUR FINANCIAL INSTITUTION.",
    cta: null,
  },
];

export default function ReturnPolicyPage() {
  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col pt-[90px]">
      {/* Page Title */}
      <div className="w-full px-5 md:px-16 py-20 md:py-[120px] text-center md:text-left max-w-[1440px] mx-auto">
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] font-bold uppercase tracking-widest text-primary">
          RETURN POLICY
        </h1>
      </div>

      {/* Sections */}
      <div className="flex flex-col w-full px-5 md:px-16 pb-20 max-w-[1440px] mx-auto">
        {sections.map((section, i) => (
          <section
            key={section.num}
            className={`border-t border-outline-variant flex flex-col md:flex-row py-12 md:py-20 transition-colors duration-300 ${
              i === sections.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="md:w-1/3 font-['Playfair_Display'] text-[32px] leading-[40px] font-medium text-primary mb-6 md:mb-0">
              {section.num}. {section.title}
            </div>
            <div className="md:w-2/3 flex flex-col gap-6 md:pr-20">
              <p className="text-[18px] leading-[28px] font-['Inter'] text-primary max-w-3xl leading-relaxed">
                {section.primary}
              </p>
              <p className="text-[16px] leading-[24px] font-['Inter'] text-secondary max-w-2xl leading-relaxed">
                {section.secondary}
              </p>
              {section.cta && (
                <div className="mt-8">
                  <a
                    href="#"
                    className="inline-block border border-primary px-8 py-4 font-['Inter'] text-[14px] tracking-[0.05em] font-medium uppercase tracking-[0.1em] text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
                  >
                    {section.cta}
                  </a>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
