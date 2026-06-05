import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { title: "Kebijakan Privasi — EGOISM" };

const sections = [
  {
    num: "01",
    title: "PENGUMPULAN DATA",
    primary:
      "KETIKA ANDA MEMBELI PAKAIAN DARI TOKO KAMI, KAMI MENGUMPULKAN INFORMASI PRIBADI YANG ANDA BERIKAN SEPERTI NAMA, ALAMAT, DAN ALAMAT EMAIL ANDA SESUAI DENGAN UU NO. 27 TAHUN 2022 TENTANG PELINDUNGAN DATA PRIBADI (UU PDP).",
    secondary:
      "KETIKA ANDA MENJELAJAHI TOKO KAMI, KAMI JUGA SECARA OTOMATIS MENERIMA ALAMAT PROTOKOL INTERNET (IP) KOMPUTER ANDA UNTUK MEMBERIKAN KAMI INFORMASI YANG MEMBANTU KAMI MEMPELAJARI TENTANG BROWSER DAN SISTEM OPERASI ANDA.",
    cta: null,
  },
  {
    num: "02",
    title: "PERSETUJUAN",
    primary:
      "DENGAN MEMBERIKAN INFORMASI PRIBADI KEPADA KAMI UNTUK MENYELESAIKAN TRANSAKSI, MEMVERIFIKASI PEMBAYARAN ANDA, MENEMPATKAN PESANAN, ATAU MENGATUR PENGIRIMAN, ANDA MENYIRATKAN PERSETUJUAN ANDA.",
    secondary:
      "JIKA KAMI MEMINTA INFORMASI PRIBADI ANDA UNTUK ALASAN SEKUNDER, SEPERTI KAMPANYE PEMASARAN EKSKLUSIF, KAMI AKAN MEMINTA PERSETUJUAN EKSPLISIT ANDA SECARA LANGSUNG ATAU MEMBERIKAN ANDA KESEMPATAN UNTUK MENOLAK.",
    cta: null,
  },
  {
    num: "03",
    title: "KEAMANAN",
    primary:
      "UNTUK MELINDUNGI INFORMASI PRIBADI ANDA, KAMI MENGAMBIL TINDAKAN PENCEGAHAN DAN MENGIKUTI PRAKTIK TERBAIK INDUSTRI UNTUK MEMASTIKAN INFORMASI TERSEBUT TIDAK HILANG, DISALAHGUNAKAN, ATAU DIAKSES SECARA TIDAK PANTAS.",
    secondary:
      "Meskipun TIDAK ADA METODE TRANSMISI MELALUI INTERNET ATAU PENYIMPANAN ELEKTRONIK YANG 100% AMAN, KAMI MENERAPKAN STANDAR INDUSTRI YANG DITERIMA SECARA UMUM DAN ENKRIPSI LANJUTAN UNTUK MELINDUNGI IDENTITAS ANDA.",
    cta: null,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col">
      <PageHeader title="Kebijakan Privasi" subtitle="LEGAL" />

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
                  <p className="text-[16px] leading-[24px] text-secondary max-w-2xl leading-relaxed uppercase">
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
