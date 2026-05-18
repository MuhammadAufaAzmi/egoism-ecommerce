import { getProductsByCategory } from "@/lib/products";
import MenClient from "./MenClient";

export const metadata = { title: "Men — EGOISM" };

export default async function MenPage() {
  // Tetap mempertahankan struktur server async yang stabil untuk menarik data
  const products = await getProductsByCategory("men");

  return (
    <div className="pt-[90px]">
      {/* Header Statis */}
      <div className="w-full px-5 md:px-16 py-20 md:py-[120px] max-w-[1440px] mx-auto">
        <p className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold font-['Inter'] text-secondary uppercase mb-4">
          COLLECTION
        </p>
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[80px] leading-[40px] md:leading-[90px] font-bold uppercase tracking-tight text-primary">
          MEN
        </h1>
      </div>

      {/* Menyuntikkan komponen klien yang membawa fitur Sort & Filter interaktif */}
      <MenClient initialProducts={products} />
    </div>
  );
}
