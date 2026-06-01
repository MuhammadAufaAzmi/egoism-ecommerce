import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { title: "Return Policy — EGOISM" };

const sections = [
  {
    num: "01",
    title: "SYARAT PENUKARAN",
    primary:
      "KAMI MEMBERLAKUKAN SISTEM PENGECEKAN KUALITAS YANG KETAT. PENUKARAN BARANG HANYA DILAYANI JIKA TERDAPAT CACAT PRODUKSI ATAU KESALAHAN PENGIRIMAN DARI PIHAK EGOISM.",
    secondary:
      "KELUHAN HARUS DIAJUKAN MAKSIMAL 3 HARI SETELAH PAKET BERSTATUS DITERIMA. BAJU HARUS DALAM KONDISI BARU (BELUM DICUCI, BELUM DIPAKAI, BEBAS BAU) DAN TAG MASIH TERPASANG LENGKAP.",
    cta: null,
    href: null,
  },
  {
    num: "02",
    title: "CARA PENGAJUAN",
    primary:
      "TIDAK ADA PORTAL RETUR OTOMATIS. JIKA ANDA MENERIMA BARANG CACAT, SEGERA KIRIMKAN EMAIL KAMI DENGAN JUDUL 'RETUR - [NOMOR PESANAN]'.",
    secondary:
      "SERTAKAN VIDEO UNBOXING ATAU FOTO DETAIL BAGIAN YANG CACAT. TIM KAMI AKAN MENGEVALUASI DAN MEMANDU PROSES SELANJUTNYA MELALUI EMAIL.",
    cta: "HUBUNGI CUSTOMER SERVICE",
    href: "mailto:egoismliftingtee@gmail.com",
  },
  {
    num: "03",
    title: "PENGEMBALIAN DANA",
    primary:
      "KARENA SISTEM KAMI PRE-ORDER EKSKLUSIF, KAMI TIDAK MENERIMA PENGEMBALIAN DANA (REFUND) UNTUK ALASAN BERUBAH PIKIRAN ATAU SALAH PILIH UKURAN.",
    secondary:
      "PENGEMBALIAN UANG SECARA PENUH HANYA AKAN DIPROSES JIKA STOK BARANG PENGGANTI DARI PIHAK KAMI TELAH HABIS TOTAL.",
    cta: null,
    href: null,
  },
];

export default function ReturnPolicyPage() {
  return (
    <div className="bg-surface-container-lowest text-primary min-h-screen flex flex-col">
      <PageHeader title="Return Policy" subtitle="CUSTOMER SERVICE" />

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
                        href={section.href || "#"}
                        className="inline-block border border-primary px-8 py-4 text-[14px] tracking-[0.05em] font-medium uppercase tracking-[0.1em] text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
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
