import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Info — EGOISM" };

export default function ShippingInfoPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen pt-[160px] pb-[120px] px-5 md:px-16 max-w-[1440px] mx-auto">
      <header className="mb-20 text-center">
        <h1 className="font-['Playfair_Display'] text-[48px] leading-[56px] tracking-[-0.01em] font-semibold uppercase text-primary tracking-widest">
          SHIPPING INFO
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
        {/* Domestic */}
        <section className="flex flex-col border-t border-outline-variant pt-8">
          <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-medium uppercase mb-8 text-primary">
            DOMESTIC SHIPPING
          </h2>
          <div className="space-y-6 text-[16px] leading-[24px] font-['Inter'] text-secondary">
            <p className="uppercase">STANDARD DELIVERY: 3-5 BUSINESS DAYS. FLAT RATE IDR 25,000.</p>
            <p className="uppercase">EXPRESS DELIVERY: 1-2 BUSINESS DAYS. FLAT RATE IDR 50,000.</p>
            <p className="uppercase">FREE STANDARD SHIPPING ON ALL DOMESTIC ORDERS OVER IDR 1,000,000.</p>
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase">
                CARRIERS: JNE, J&T, SICEPAT.
              </p>
            </div>
          </div>
        </section>

        {/* International */}
        <section className="flex flex-col border-t border-outline-variant pt-8">
          <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-medium uppercase mb-8 text-primary">
            INTERNATIONAL SHIPPING
          </h2>
          <div className="space-y-6 text-[16px] leading-[24px] font-['Inter'] text-secondary">
            <p className="uppercase">WORLDWIDE EXPRESS: 5-10 BUSINESS DAYS. RATES CALCULATED AT CHECKOUT.</p>
            <p className="uppercase">DUTIES AND TAXES ARE NOT INCLUDED IN THE FINAL PRICE AT CHECKOUT.</p>
            <p className="uppercase">CUSTOMERS ARE RESPONSIBLE FOR ALL IMPORT DUTIES AND LOCAL TAXES.</p>
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase">
                CARRIERS: DHL EXPRESS.
              </p>
            </div>
          </div>
        </section>

        {/* Processing */}
        <section className="flex flex-col border-t border-outline-variant pt-8">
          <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-medium uppercase mb-8 text-primary">
            PROCESSING TIMES
          </h2>
          <div className="space-y-6 text-[16px] leading-[24px] font-['Inter'] text-secondary">
            <p className="uppercase">ALL ORDERS ARE PROCESSED WITHIN 1-2 BUSINESS DAYS.</p>
            <p className="uppercase">ORDERS PLACED AFTER 4PM WIB WILL BE PROCESSED THE FOLLOWING BUSINESS DAY.</p>
            <p className="uppercase">ORDERS ARE NOT SHIPPED OR DELIVERED ON WEEKENDS OR NATIONAL HOLIDAYS.</p>
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase">
                TRACKING INFO SENT VIA EMAIL UPON DISPATCH.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
