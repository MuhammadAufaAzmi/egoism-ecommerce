import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — EGOISM" };

const sections = [
  {
    num: "01",
    title: "COLLECTION",
    primary:
      "WHEN YOU PURCHASE A GARMENT FROM OUR STORE, WE COLLECT THE PERSONAL INFORMATION YOU GIVE US SUCH AS YOUR NAME, ADDRESS, AND EMAIL ADDRESS.",
    secondary:
      "WHEN YOU BROWSE OUR STORE, WE ALSO AUTOMATICALLY RECEIVE YOUR COMPUTER’S INTERNET PROTOCOL (IP) ADDRESS IN ORDER TO PROVIDE US WITH INFORMATION THAT HELPS US LEARN ABOUT YOUR BROWSER AND OPERATING SYSTEM.",
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
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col pt-[90px]">
      {/* Page Title */}
      <div className="w-full px-5 md:px-16 py-20 md:py-[120px] text-center md:text-left max-w-[1440px] mx-auto">
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] font-bold uppercase tracking-widest text-primary">
          PRIVACY POLICY
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
                    className="inline-block border border-primary px-8 py-4 font-['Inter'] text-[14px] tracking-[0.05em] font-medium uppercase text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
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
