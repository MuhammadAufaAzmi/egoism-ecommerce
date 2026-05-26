import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-surface relative">
      {/* Subtle gradient top-border accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-outline-variant to-transparent" aria-hidden="true" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 md:px-16 py-16 md:py-20 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="col-span-1 mb-10 md:mb-0">
          <Link
            href="/"
            className="text-2xl uppercase tracking-widest text-primary font-bold"
          >
            EGOISM
          </Link>
        </div>

        {/* Customer Service */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary mb-2 uppercase">
            CUSTOMER SERVICE
          </h4>
          <Link
            href="/kontak"
            className="text-[16px] leading-[24px] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Contact Us
          </Link>
          <Link
            href="/return-policy"
            className="text-[16px] leading-[24px] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Returns
          </Link>
          <Link
            href="/shipping-info"
            className="text-[16px] leading-[24px] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Shipping
          </Link>
        </div>

        {/* Legal */}
        <div className="col-span-1 flex flex-col gap-4 mt-8 md:mt-0">
          <h4 className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary mb-2 uppercase">
            LEGAL
          </h4>
          {/* PERBAIKAN: Mengganti tag <a> menjadi komponen <Link> dan mengarahkan href ke rute yang tepat */}
          <Link
            href="/terms"
            className="text-[16px] leading-[24px] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-[16px] leading-[24px] text-secondary hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 decoration-1"
          >
            Privacy
          </Link>
        </div>


      </div>

      <div className="w-full px-5 md:px-16 pb-8 max-w-[1440px] mx-auto flex justify-center border-t border-outline-variant/40 pt-8 mt-10">
        <p className="text-[12px] leading-[16px] tracking-[0.15em] font-semibold text-secondary/70">
          © 2026 EGOISM. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
