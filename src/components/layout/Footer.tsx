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
          <p className="text-[12px] text-secondary mt-3 leading-relaxed max-w-[200px]">
            Premium gymwear & streetwear,<br />crafted in Indonesia.
          </p>
          {/* Social Media */}
          <div className="flex flex-col mt-6">
            <h4 className="text-[11px] leading-[16px] tracking-[0.1em] font-semibold text-secondary mb-3 uppercase">
              FOLLOW US
            </h4>
            <a
              href="https://www.instagram.com/egoism.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-secondary hover:text-primary transition-colors duration-200 w-fit group"
              aria-label="Follow EGOISM on Instagram"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              <span className="text-[13px] font-medium tracking-wide">@egoism.id</span>
            </a>
          </div>
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
