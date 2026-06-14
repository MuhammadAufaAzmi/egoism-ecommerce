import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminAnalytics } from "@/lib/admin";

const STATUS_COLOR: Record<string, string> = {
  DIPROSES: "text-amber-600 bg-amber-50 border-amber-200",
  DIKIRIM: "text-blue-600 bg-blue-50 border-blue-200",
  DITERIMA: "text-green-600 bg-green-50 border-green-200",
  DIBATALKAN: "text-red-500 bg-red-50 border-red-200",
};

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    redirect("/");
  }

  const analytics = await getAdminAnalytics();

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12 border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-secondary mb-2">EGOISM</p>
            <h1 className="text-[36px] md:text-[48px] font-bold uppercase tracking-wide">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[12px] text-secondary uppercase tracking-widest">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <>
            {/* Row 1: Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="border border-outline-variant/30 p-6 bg-surface">
                <p className="text-[11px] uppercase tracking-widest text-secondary mb-3">Total Pesanan</p>
                <p className="text-[32px] font-bold leading-none">{analytics.totalOrders}</p>
              </div>
              <div className="border border-outline-variant/30 p-6 bg-surface">
                <p className="text-[11px] uppercase tracking-widest text-secondary mb-3">Total Produk</p>
                <p className="text-[32px] font-bold leading-none">{analytics.totalProducts}</p>
              </div>
              <div className="border border-outline-variant/30 p-6 bg-surface">
                <p className="text-[11px] uppercase tracking-widest text-secondary mb-3">Total Pelanggan</p>
                <p className="text-[32px] font-bold leading-none">{analytics.totalUsers}</p>
              </div>
              <div className="border border-outline-variant/30 p-6 bg-surface">
                <p className="text-[11px] uppercase tracking-widest text-secondary mb-3">Pesanan Bulan Ini</p>
                <p className="text-[32px] font-bold leading-none">{analytics.monthlyOrdersCount}</p>
              </div>
            </div>

            {/* Row 2: Revenue cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <div className="border border-outline-variant/30 p-8 bg-surface">
                <p className="text-[11px] uppercase tracking-widest text-secondary mb-3">Total Pendapatan (All Time)</p>
                <p className="text-[28px] font-bold text-emerald-600">{analytics.formattedRevenue}</p>
              </div>
              <div className="border border-primary/30 p-8 bg-surface">
                <p className="text-[11px] uppercase tracking-widest text-secondary mb-3">Pendapatan Bulan Ini</p>
                <p className="text-[28px] font-bold text-primary">{analytics.formattedMonthlyRevenue}</p>
              </div>
            </div>

            {/* Recent Orders Table */}
            {analytics.recentOrders && analytics.recentOrders.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[14px] font-bold uppercase tracking-widest text-secondary">
                    Pesanan Terbaru
                  </h2>
                  <Link
                    href="/admin/pesanan"
                    className="text-[11px] uppercase tracking-widest text-primary/70 hover:text-primary border-b border-primary/30 hover:border-primary transition-colors"
                  >
                    LIHAT SEMUA →
                  </Link>
                </div>
                <div className="border border-outline-variant/30 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface">
                        <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Order</th>
                        <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold hidden md:table-cell">Pelanggan</th>
                        <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Total</th>
                        <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Status</th>
                        <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold hidden md:table-cell">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-[13px] font-medium text-primary">
                              {order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className="text-[13px] text-secondary">{order.customer}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[13px] font-semibold text-primary">{order.total}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-semibold border px-2 py-1 uppercase tracking-widest ${STATUS_COLOR[order.status] ?? "text-secondary border-stone-200"}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className="text-[12px] text-secondary">{order.date}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/admin/tambah-produk"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-primary transition-colors mb-4 block">add_circle</span>
            <h2 className="text-[20px] font-bold uppercase tracking-wide mb-2">
              Tambah Produk
            </h2>
            <p className="text-[13px] text-secondary">
              Tambah garment baru ke database.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/produk"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-primary transition-colors mb-4 block">inventory_2</span>
            <h2 className="text-[20px] font-bold uppercase tracking-wide mb-2">
              Kelola Produk
            </h2>
            <p className="text-[13px] text-secondary">
              Edit dan hapus produk yang ada.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/pesanan"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-primary transition-colors mb-4 block">shopping_bag</span>
            <h2 className="text-[20px] font-bold uppercase tracking-wide mb-2">
              Kelola Pesanan
            </h2>
            <p className="text-[13px] text-secondary">
              Lihat dan update status pesanan.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/users"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-primary transition-colors mb-4 block">group</span>
            <h2 className="text-[20px] font-bold uppercase tracking-wide mb-2">
              Kelola User
            </h2>
            <p className="text-[13px] text-secondary">
              Lihat data pelanggan terdaftar.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/promo"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-primary transition-colors mb-4 block">local_offer</span>
            <h2 className="text-[20px] font-bold uppercase tracking-wide mb-2">
              Promo Code
            </h2>
            <p className="text-[13px] text-secondary">
              Buat dan kelola kode voucher.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">
              OPEN →
            </p>
          </Link>
          <Link
            href="/admin/shipping"
            className="group border border-outline-variant/30 p-8 bg-surface hover:border-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-primary transition-colors mb-4 block">local_shipping</span>
            <h2 className="text-[20px] font-bold uppercase tracking-wide mb-2">
              Zona Pengiriman
            </h2>
            <p className="text-[13px] text-secondary">
              Kelola ongkir per zona.
            </p>
            <p className="text-[12px] uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">
              OPEN →
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
