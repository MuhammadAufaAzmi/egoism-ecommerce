"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ShippingZone {
  id: string;
  zone: string;
  province: string;
  cost: number;
  etd: string;
}

const ZONE_OPTIONS = ["JABODETABEK", "JAWA", "SUMATERA", "KALIMANTAN", "SULAWESI", "BALI & NUSA TENGGARA", "MALUKU & PAPUA"];

export default function AdminShippingPage() {
  const router = useRouter();
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({ zone: "JAWA", province: "", cost: "", etd: "" });

  const loadZones = async () => {
    const res = await fetch("/api/shipping/zones");
    const data = await res.json();
    if (data.success) setZones(data.zones);
    setLoading(false);
  };

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.authenticated || d.user?.role !== "ADMIN") router.push("/");
      else loadZones();
    });
  }, [router]);

  const openAdd = () => {
    setForm({ zone: "JAWA", province: "", cost: "", etd: "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (z: ShippingZone) => {
    setForm({ zone: z.zone, province: z.province, cost: String(z.cost), etd: z.etd });
    setEditId(z.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.province || !form.cost || !form.etd) {
      setMessage({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const method = editId ? "PATCH" : "POST";
      const res = await fetch("/api/admin/shipping", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...form, cost: Number(form.cost) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: editId ? "Zona berhasil diupdate!" : "Zona berhasil ditambahkan!" });
        setShowForm(false);
        loadZones();
      } else {
        setMessage({ type: "error", text: data.message || "Gagal menyimpan." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus zona pengiriman ini?")) return;
    await fetch(`/api/admin/shipping?id=${id}`, { method: "DELETE" });
    loadZones();
  };

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  // Group zones by zone name
  const grouped = ZONE_OPTIONS.reduce((acc, z) => {
    acc[z] = zones.filter((zone) => zone.zone === z);
    return acc;
  }, {} as Record<string, ShippingZone[]>);

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-10 border-b border-outline-variant/30 pb-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-[11px] uppercase tracking-widest text-secondary hover:text-primary mb-2 block">
              ← Admin Dashboard
            </Link>
            <h1 className="text-[32px] md:text-[40px] font-bold uppercase tracking-wide">Zona Pengiriman</h1>
          </div>
          <button
            onClick={openAdd}
            className="bg-primary text-on-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            + TAMBAH ZONA
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 px-4 py-3 text-[12px] font-medium uppercase tracking-wider border ${message.type === "success" ? "bg-green-950/20 border-green-500/50 text-green-400" : "bg-red-950/20 border-red-500/50 text-red-400"}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="border border-outline-variant/50 p-8 mb-10 bg-surface space-y-6">
            <h2 className="text-[13px] font-semibold uppercase tracking-widest text-secondary">
              {editId ? "Edit Zona Pengiriman" : "Tambah Zona Pengiriman Baru"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Zona *</label>
                <select
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary cursor-pointer"
                >
                  {ZONE_OPTIONS.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Provinsi *</label>
                <input
                  type="text"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  placeholder="Contoh: DKI Jakarta"
                  required
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Ongkir (Rp) *</label>
                <input
                  type="number"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  placeholder="Contoh: 15000"
                  required
                  min={0}
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Estimasi (ETD) *</label>
                <input
                  type="text"
                  value={form.etd}
                  onChange={(e) => setForm({ ...form, etd: e.target.value })}
                  placeholder="Contoh: 1-2 hari"
                  required
                  className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[14px] text-primary"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-on-primary px-8 py-3 text-[12px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {saving ? "MENYIMPAN..." : "SIMPAN"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-outline-variant/50 text-secondary px-6 py-3 text-[12px] uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
                BATAL
              </button>
            </div>
          </form>
        )}

        {/* Zones grouped */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {ZONE_OPTIONS.map((zoneName) => {
              const zoneItems = grouped[zoneName] || [];
              if (zoneItems.length === 0) return null;
              return (
                <div key={zoneName}>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-4 border-b border-outline-variant/30 pb-3">
                    {zoneName}
                  </h2>
                  <div className="border border-outline-variant/30 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-outline-variant/30 bg-surface">
                          <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Provinsi</th>
                          <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Ongkir</th>
                          <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">ETD</th>
                          <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zoneItems.map((z) => (
                          <tr key={z.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface/50 transition-colors">
                            <td className="px-6 py-4 text-[13px] text-primary">{z.province}</td>
                            <td className="px-6 py-4 text-[13px] font-semibold text-primary">{formatIDR(z.cost)}</td>
                            <td className="px-6 py-4 text-[12px] text-secondary">{z.etd}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-4">
                                <button onClick={() => openEdit(z)} className="text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors">EDIT</button>
                                <button onClick={() => handleDelete(z.id)} className="text-[11px] uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors">HAPUS</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {zones.length === 0 && (
              <div className="text-center py-20 border border-dashed border-outline-variant/30">
                <p className="text-[14px] text-secondary uppercase tracking-widest">Belum ada zona pengiriman.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
