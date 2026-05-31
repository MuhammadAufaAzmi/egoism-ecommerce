"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminPromoPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrder: "0",
    maxUses: "0",
    expiresAt: "",
    isActive: true,
  });

  const loadPromos = async () => {
    try {
      const res = await fetch("/api/admin/promo");
      const data = await res.json();
      if (data.success) setPromos(data.promos);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verify admin
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.authenticated || d.user?.role !== "ADMIN") router.push("/");
      else loadPromos();
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrder: Number(form.minOrder),
          maxUses: Number(form.maxUses),
          expiresAt: form.expiresAt || null,
          isActive: form.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Promo code berhasil dibuat!" });
        setShowForm(false);
        setForm({ code: "", discountType: "percent", discountValue: "", minOrder: "0", maxUses: "0", expiresAt: "", isActive: true });
        loadPromos();
      } else {
        setMessage({ type: "error", text: data.message || "Gagal membuat promo." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await fetch("/api/admin/promo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    loadPromos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus promo code ini?")) return;
    await fetch(`/api/admin/promo?id=${id}`, { method: "DELETE" });
    loadPromos();
  };

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-10 border-b border-outline-variant/30 pb-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-[11px] uppercase tracking-widest text-secondary hover:text-primary mb-2 block">
              ← Admin Dashboard
            </Link>
            <h1 className="text-[32px] md:text-[40px] font-bold uppercase tracking-wide">Promo Code</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-on-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            {showForm ? "BATAL" : "+ BUAT PROMO"}
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 px-4 py-3 text-[12px] font-medium uppercase tracking-wider border ${message.type === "success" ? "bg-green-950/20 border-green-500/50 text-green-400" : "bg-red-950/20 border-red-500/50 text-red-400"}`}>
            {message.text}
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="border border-outline-variant/50 p-8 mb-10 bg-surface space-y-6">
            <h2 className="text-[13px] font-semibold uppercase tracking-widest text-secondary">Buat Promo Code Baru</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Kode Promo *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="Contoh: SALE20"
                  required
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary font-bold uppercase tracking-widest"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Tipe Diskon *</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary cursor-pointer"
                >
                  <option value="percent">Persen (%)</option>
                  <option value="fixed">Nominal Tetap (Rp)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">
                  Nilai Diskon * {form.discountType === "percent" ? "(contoh: 20 = 20%)" : "(contoh: 50000 = Rp50.000)"}
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "percent" ? "20" : "50000"}
                  required
                  min={1}
                  max={form.discountType === "percent" ? 100 : undefined}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Min. Pembelian (Rp) — 0 = tidak ada</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  min={0}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Maks. Penggunaan — 0 = tidak terbatas</label>
                <input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  min={0}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Berlaku Hingga — kosong = selamanya</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="isActive" className="text-[13px] text-primary">Aktifkan langsung</label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-on-primary px-8 py-3 text-[12px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {saving ? "MENYIMPAN..." : "SIMPAN PROMO CODE"}
              </button>
            </div>
          </form>
        )}

        {/* Promo List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-outline-variant/30">
            <p className="text-[14px] text-secondary uppercase tracking-widest">Belum ada promo code.</p>
          </div>
        ) : (
          <div className="border border-outline-variant/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface">
                  {["Kode", "Tipe", "Diskon", "Min. Order", "Dipakai", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-widest text-secondary px-5 py-3 font-semibold first:pl-6 last:pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((promo) => (
                  <tr key={promo.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold tracking-widest text-primary">{promo.code}</p>
                      {promo.expiresAt && (
                        <p className="text-[10px] text-secondary mt-0.5">
                          Exp: {new Date(promo.expiresAt).toLocaleDateString("id-ID")}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12px] text-secondary uppercase">
                        {promo.discountType === "percent" ? "Persen" : "Fixed"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-primary">
                        {promo.discountType === "percent" ? `${promo.discountValue}%` : formatIDR(promo.discountValue)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12px] text-secondary">
                        {promo.minOrder > 0 ? formatIDR(promo.minOrder) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] text-secondary">
                        {promo.usedCount}{promo.maxUses > 0 ? ` / ${promo.maxUses}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold border px-2 py-1 uppercase tracking-widest ${promo.isActive ? "text-green-600 border-green-200 bg-green-50" : "text-secondary border-outline-variant/40"}`}>
                        {promo.isActive ? "AKTIF" : "NONAKTIF"}
                      </span>
                    </td>
                    <td className="px-5 pr-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleToggle(promo.id, promo.isActive)}
                          className="text-[11px] uppercase tracking-widest text-secondary hover:text-primary border border-outline-variant/30 hover:border-primary px-2 py-1 transition-colors"
                        >
                          {promo.isActive ? "NONAKTIFKAN" : "AKTIFKAN"}
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="text-[11px] uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                        >
                          HAPUS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
