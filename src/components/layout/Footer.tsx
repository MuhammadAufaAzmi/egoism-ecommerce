import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-surface border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-5 md:px-16 py-16 md:py-20 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="col-span-1 mb-10 md:mb-0">
          <Link
            href="/"
            className="font-['Playfair_Display'] text-2xl uppercase tracking-widest text-primary font-bold"
          >
            EGOISM
          </Link>
        </div>

        {/* Customer Service */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary mb-2 uppercase">
            CUSTOMER SERVICE
          </h4>
          <Link
            href="/kontak"
            className="text-[16px] leading-[24px] font-['Inter'] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Contact Us
          </Link>
          <Link
            href="/return-policy"
            className="text-[16px] leading-[24px] font-['Inter'] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Returns
          </Link>
          <Link
            href="/shipping-info"
            className="text-[16px] leading-[24px] font-['Inter'] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Shipping
          </Link>
        </div>

        {/* Legal */}
        <div className="col-span-1 flex flex-col gap-4 mt-8 md:mt-0">
          <h4 className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary mb-2 uppercase">
            LEGAL
          </h4>
          {/* PERBAIKAN: Mengganti tag <a> menjadi komponen <Link> dan mengarahkan href ke rute yang tepat */}
          <Link
            href="/terms"
            className="text-[16px] leading-[24px] font-['Inter'] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-[16px] leading-[24px] font-['Inter'] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Privacy
          </Link>
        </div>

        {/* Newsletter */}
        <div className="col-span-1 flex flex-col gap-4 mt-8 md:mt-0">
          <h4 className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary mb-2 uppercase">
            NEWSLETTER
          </h4>
          <div className="relative w-full border-b border-primary pb-2 mt-2">
            <input
              className="w-full bg-transparent border-none outline-none text-[14px] tracking-[0.05em] font-['Inter'] text-primary placeholder:text-secondary focus:ring-0 p-0"
              placeholder="ENTER EMAIL"
              type="email"
            />
            <button className="absolute right-0 top-0 text-primary text-[14px] tracking-[0.05em] font-['Inter'] hover:opacity-70 transition-opacity">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-5 md:px-16 pb-8 max-w-[1440px] mx-auto flex justify-center border-t border-outline-variant pt-8 mt-10">
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary">
          © 2024 EGOISM. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
