import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-surface relative">
      {/* Subtle gradient top-border accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-outline-variant to-transparent" aria-hidden="true" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 md:px-16 py-16 md:py-20 max-w-[1440px] mx-auto">
        {/* Brand & Story */}
        <div className="col-span-1 md:col-span-1 mb-10 md:mb-0">
          <Link
            href="/"
            className="text-2xl md:text-3xl uppercase tracking-widest text-primary font-bold"
          >
            EGOISM
          </Link>
          <p className="text-[13px] text-secondary mt-5 leading-relaxed max-w-[320px]">
            Premium gymwear & streetwear,<br />crafted in Indonesia.
          </p>
          
          {/* Social Media */}
          <div className="flex flex-col mt-8">
            <h4 className="text-[11px] leading-[16px] tracking-[0.1em] font-semibold text-secondary mb-4 uppercase">
              COMMUNITY
            </h4>
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/egoism.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@egoism.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors duration-200"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.33 6.32A6.32 6.32 0 0017.65 16V8.16a8.44 8.44 0 004 1.88V6.62a4.93 4.93 0 01-2.06-.03z" />
                </svg>
              </a>
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.01 2.01c-5.5 0-9.96 4.46-9.96 9.96 0 1.94.55 3.76 1.5 5.3L2 22l4.87-1.48a9.92 9.92 0 005.14 1.41c5.5 0 9.96-4.46 9.96-9.96S17.51 2.01 12.01 2.01zm5.24 14.37c-.22.61-1.25 1.15-1.72 1.21-.43.05-.98.11-2.92-.69-2.32-.97-3.8-3.35-3.92-3.51-.11-.16-.94-1.25-.94-2.38s.59-1.69.8-1.92c.2-.21.44-.27.59-.27.15 0 .3 0 .42.02.13.01.3-.05.46.33.17.4.58 1.4.63 1.51.05.11.08.24.01.38-.07.15-.11.23-.21.35-.11.12-.23.25-.33.35-.11.1-.22.21-.1.41.11.2.5 .83 1.07 1.34.73.66 1.34.86 1.54.97.21.11.33.1.45-.04.13-.15.54-.63.69-.85.15-.22.3-.18.49-.11.2.07 1.25.59 1.47.7.21.11.36.16.41.25.06.09.06.52-.16 1.13z"/>
                </svg>
              </a>
              <a
                href="https://threads.net/@egoism.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors duration-200"
                aria-label="Threads"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.3 10.3c-.1-.7-.4-1.3-.9-1.8-.7-.6-1.6-.9-2.7-.9-1.2 0-2.2.4-2.9 1.1-.8.7-1.1 1.7-1.1 3.2 0 1.4.4 2.5 1.1 3.2.7.7 1.7 1.1 2.8 1.1.9 0 1.7-.2 2.3-.7v.1c0 1.5-1 2.4-2.4 2.4-1 0-1.7-.4-2.1-.9l-1.3 1.3c.7.9 2 1.5 3.5 1.5 2.5 0 4.1-1.5 4.1-4.2V8h-1.6v2.3zm-3.6 4.3c-1 0-1.6-.6-1.6-1.7 0-1.2.6-1.7 1.6-1.7 1 0 1.6.6 1.6 1.7 0 1.2-.6 1.7-1.6 1.7z" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </a>
            </div>
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
