import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminAnalytics } from "@/lib/admin";

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("user_role")?.value !== "ADMIN") {
    redirect("/");
  }

  const analytics = await getAdminAnalytics();

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-12 border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-[36px] md:text-[48px] font-bold uppercase tracking-wide">
            Admin Dashboard
          </h1>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border border-outline-variant/30 p-8 bg-surface">
              <p className="text-[12px] uppercase tracking-widest text-secondary mb-2">Total Pesanan</p>
              <p className="text-[36px] font-bold">{analytics.totalOrders}</p>
            </div>
            <div className="border border-outline-variant/30 p-8 bg-surface">
              <p className="text-[12px] uppercase tracking-widest text-secondary mb-2">Total Pendapatan</p>
              <p className="text-[36px] font-bold text-emerald-600">{analytics.formattedRevenue}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/tambah-produk"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <h2 className="text-[28px] font-bold uppercase tracking-wide">
              Tambah Produk
            </h2>
            <p className="text-[13px] text-secondary mt-3">
              Tambah garment baru ke database.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-6">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/produk"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <h2 className="text-[28px] font-bold uppercase tracking-wide">
              Kelola Produk
            </h2>
            <p className="text-[13px] text-secondary mt-3">
              Edit dan hapus produk yang ada.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-6">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/pesanan"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <h2 className="text-[28px] font-bold uppercase tracking-wide">
              Kelola Pesanan
            </h2>
            <p className="text-[13px] text-secondary mt-3">
              Lihat dan update status pesanan.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-6">
              OPEN →
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
