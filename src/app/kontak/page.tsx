import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — EGOISM" };

export default function KontakPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen pt-[120px] pb-[80px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16">
        {/* Header */}
        <section className="py-12 md:py-24">
          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] font-bold text-primary uppercase max-w-3xl">
            CONTACT
            <br />
            THE STUDIO
          </h1>
        </section>

        {/* Split Layout */}
        <section className="flex flex-col md:flex-row w-full gap-24 mt-12">
          {/* Left: Info */}
          <div className="w-full md:w-1/2 flex flex-col gap-16">
            <div>
              <h2 className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold font-['Inter'] text-secondary uppercase mb-6">
                ENQUIRIES
              </h2>
              <p className="font-['Playfair_Display'] text-[32px] leading-[40px] font-medium text-primary uppercase mb-2">
                CUSTOMER SERVICE
              </p>
              <a
                href="mailto:STUDIO@EGOISM.COM"
                className="text-[18px] leading-[28px] font-['Inter'] text-secondary hover:text-primary transition-colors duration-300"
              >
                STUDIO@EGOISM.COM
              </a>
            </div>
            <div>
              <h2 className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold font-['Inter'] text-secondary uppercase mb-6">
                HEADQUARTERS
              </h2>
              <p className="text-[18px] leading-[28px] font-['Inter'] text-secondary uppercase leading-relaxed">
                123 INDUSTRIAL BLVD
                <br />
                ARCHITECT CITY
                <br />
                AC 90210
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-10 w-full max-w-xl">
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold font-['Inter'] uppercase text-secondary"
                  htmlFor="name"
                >
                  NAME
                </label>
                <input
                  className="bg-transparent border-0 border-b border-primary p-0 py-3 text-[18px] font-['Inter'] text-primary placeholder:text-secondary/40 focus:ring-0 focus:outline-none focus:border-primary rounded-none"
                  id="name"
                  name="name"
                  placeholder="ENTER YOUR NAME"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold font-['Inter'] uppercase text-secondary"
                  htmlFor="email"
                >
                  EMAIL
                </label>
                <input
                  className="bg-transparent border-0 border-b border-primary p-0 py-3 text-[18px] font-['Inter'] text-primary placeholder:text-secondary/40 focus:ring-0 focus:outline-none focus:border-primary rounded-none"
                  id="email"
                  name="email"
                  placeholder="ENTER YOUR EMAIL"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold font-['Inter'] uppercase text-secondary"
                  htmlFor="message"
                >
                  MESSAGE
                </label>
                <textarea
                  className="bg-transparent border-0 border-b border-primary p-0 py-3 text-[18px] font-['Inter'] text-primary placeholder:text-secondary/40 focus:ring-0 focus:outline-none focus:border-primary rounded-none resize-none"
                  id="message"
                  name="message"
                  placeholder="HOW CAN WE ASSIST YOU?"
                  rows={4}
                />
              </div>
              <button
                type="button"
                className="bg-primary text-on-primary font-['Inter'] text-[14px] tracking-[0.05em] font-medium uppercase py-5 px-8 hover:opacity-80 transition-opacity duration-300 w-full rounded-none mt-4 tracking-widest"
              >
                SEND MESSAGE
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
