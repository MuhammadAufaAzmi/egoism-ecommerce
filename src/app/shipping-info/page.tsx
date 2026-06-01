import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { title: "Shipping Info — EGOISM" };

export default function ShippingInfoPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen">
      <PageHeader title="Shipping Information" subtitle="DELIVERY" />

      <section className="max-w-[1440px] mx-auto px-5 md:px-16 pb-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {/* Processing */}
          <ScrollReveal delay={0}>
            <section className="flex flex-col border-t border-outline-variant pt-8">
              <h2 className="text-[32px] leading-[40px] font-medium uppercase mb-8 text-primary">
                WAKTU PEMROSESAN
              </h2>
              <div className="space-y-6 text-[16px] leading-[24px] text-secondary">
                <p className="uppercase">SEMUA KOLEKSI EGOISM DIPRODUKSI SECARA PRE-ORDER.</p>
                <p className="uppercase">PESANAN ANDA MEMBUTUHKAN WAKTU 7-8 HARI KERJA UNTUK DIPROSES DAN DISIAPKAN SEBELUM DIKIRIMKAN.</p>
                <p className="uppercase">KAMI TIDAK MELAKUKAN PENGIRIMAN PADA AKHIR PEKAN (SABTU/MINGGU) MAUPUN HARI LIBUR NASIONAL.</p>
              </div>
            </section>
          </ScrollReveal>

          {/* Rates */}
          <ScrollReveal delay={150}>
            <section className="flex flex-col border-t border-outline-variant pt-8">
              <h2 className="text-[32px] leading-[40px] font-medium uppercase mb-8 text-primary">
                ONGKOS KIRIM
              </h2>
              <div className="space-y-6 text-[16px] leading-[24px] text-secondary">
                <p className="uppercase">BIAYA PENGIRIMAN DIHITUNG SECARA OTOMATIS SAAT ANDA MELAKUKAN CHECKOUT BERDASARKAN PROVINSI TUJUAN ANDA.</p>
                <p className="uppercase">TARIF PENGIRIMAN MENYESUAIKAN STANDAR LOGISTIK REKANAN KAMI DI INDONESIA.</p>
                <div className="mt-12 pt-8 border-t border-outline-variant">
                  <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary uppercase">
                    KURIR: JNT, JNE, ATAU SICEPAT.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Tracking */}
          <ScrollReveal delay={300}>
            <section className="flex flex-col border-t border-outline-variant pt-8">
              <h2 className="text-[32px] leading-[40px] font-medium uppercase mb-8 text-primary">
                PELACAKAN
              </h2>
              <div className="space-y-6 text-[16px] leading-[24px] text-secondary">
                <p className="uppercase">SETELAH PESANAN DIKIRIM, ANDA DAPAT MEMANTAU STATUS PESANAN (DIPROSES, DIKIRIM, DITERIMA) KAPAN SAJA.</p>
                <p className="uppercase">PEMANTAUAN DAPAT DILAKUKAN LANGSUNG MELALUI MENU RIWAYAT PESANAN DI DALAM AKUN ANDA.</p>
                <div className="mt-12 pt-8 border-t border-outline-variant">
                  <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-secondary uppercase">
                    NOMOR RESI AKAN DITAMPILKAN DI AKUN ANDA.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
