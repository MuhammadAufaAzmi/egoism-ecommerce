"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  saveUserAddress,
  deleteUserAddress,
  setAddressDefault,
  getUserOrders,
} from "@/lib/account";

type Tab = "profile" | "address" | "orders";

export default function MyAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<any>({
    firstName: "",
    lastName: "",
    memberSince: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/login");
        } else {
          getUserProfile().then((profileData) => {
            if (profileData) setSidebarUser(profileData);
          });
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const navItems: { label: string; icon: string; tab: Tab }[] = [
    { label: "PROFIL SAYA", icon: "person", tab: "profile" },
    { label: "ALAMAT PENGIRIMAN", icon: "location_on", tab: "address" },
    { label: "RIWAYAT PESANAN", icon: "shopping_bag", tab: "orders" },
  ];

  return (
    <div className="flex min-h-screen bg-surface-container-lowest text-on-surface ">
      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed left-0 top-0 h-full flex flex-col w-72 lg:w-80 bg-surface-container-lowest border-r border-stone-100 z-[60] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="px-10 pt-12 pb-8 border-b border-stone-100">
          <Link
            href="/"
            className="text-[24px] font-bold uppercase tracking-[0.2em] text-primary block"
          >
            EGOISM
          </Link>
          <p className="text-[13px] text-secondary mt-3">
            {sidebarUser.firstName} {sidebarUser.lastName}
          </p>
          <p className="text-[11px] tracking-[0.08em] font-semibold text-secondary/60 mt-0.5 uppercase">
            Member sejak {sidebarUser.memberSince}
          </p>
        </div>

        <nav className="flex flex-col gap-1 px-6 py-8 flex-grow">
          {navItems.map(({ label, icon, tab }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 py-3 px-4 text-left transition-colors duration-200 text-[12px] tracking-[0.12em] font-semibold uppercase w-full ${
                activeTab === tab
                  ? "text-primary bg-surface-container border-l-2 border-primary"
                  : "text-secondary hover:text-primary hover:bg-surface-container/50"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-4 mt-auto px-8 py-8 border-t border-stone-100">
          <Link
            href="/"
            className="flex items-center gap-4 text-[12px] tracking-[0.12em] font-semibold text-secondary hover:text-primary transition-colors uppercase"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            KEMBALI KE TOKO
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 text-[12px] tracking-[0.12em] font-semibold text-red-400 hover:text-red-500 transition-colors uppercase"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            SIGN OUT
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/20 z-[59] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN ── */}
      <div className="flex-1 lg:ml-80 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-stone-100 px-5 md:px-16 h-[70px] flex items-center justify-between">
          <button
            className="lg:hidden text-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <p className="text-[12px] tracking-[0.15em] font-semibold text-secondary uppercase hidden lg:block">
            {navItems.find((n) => n.tab === activeTab)?.label}
          </p>
          <div className="flex items-center gap-6 ml-auto">
            <Link
              href="/keranjang"
              className="text-[12px] tracking-[0.1em] font-semibold text-secondary hover:text-primary transition-colors uppercase"
            >
              CART
            </Link>
          </div>
        </header>

        <main className="flex-1 px-5 md:px-16 py-16 max-w-4xl w-full">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "address" && <AddressTab />}
          {activeTab === "orders" && <OrdersTab />}
        </main>

        <footer className="border-t border-stone-100 px-5 md:px-16 py-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <span className="text-[20px] font-bold uppercase tracking-wider text-primary block mb-1">
              EGOISM
            </span>
            <p className="text-[11px] tracking-[0.1em] font-semibold text-secondary uppercase">
              © 2026 EGOISM STUDIOS. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex gap-8">
            <Link
              href="/shipping-info"
              className="text-[11px] tracking-[0.1em] font-semibold text-secondary hover:text-primary transition-colors uppercase"
            >
              Shipping
            </Link>
            <Link
              href="/return-policy"
              className="text-[11px] tracking-[0.1em] font-semibold text-secondary hover:text-primary transition-colors uppercase"
            >
              Returns
            </Link>
            <Link
              href="/kontak"
              className="text-[11px] tracking-[0.1em] font-semibold text-secondary hover:text-primary transition-colors uppercase"
            >
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB 1 — PROFIL 
───────────────────────────────────────── */
function ProfileTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    memberSince: "",
  });

  useEffect(() => {
    getUserProfile().then((data) => {
      if (data) setForm(data);
    });
  }, []);

  const handleSave = async () => {
    await updateUserProfile(form);
    setEditing(false);
    window.location.reload();
  };

  const fields = [
    { label: "First Name", key: "firstName" as const, type: "text" },
    { label: "Last Name", key: "lastName" as const, type: "text" },
    { label: "Email", key: "email" as const, type: "email" },
    { label: "No. Telepon", key: "phone" as const, type: "tel" },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-14">
        <div>
          <h2 className="text-[40px] md:text-[48px] leading-tight font-semibold text-primary uppercase mb-4">
            Profil Saya
          </h2>
          <div className="h-px w-20 bg-stone-200" />
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-[12px] tracking-[0.12em] font-semibold text-secondary hover:text-primary transition-colors uppercase border border-stone-200 hover:border-primary px-4 py-2 mt-2"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            EDIT
          </button>
        )}
      </div>

      <div className="space-y-10 max-w-2xl">
        <div className="flex items-center gap-6 pb-10 border-b border-stone-100">
          <div className="w-20 h-20 bg-surface-container border border-stone-200 flex items-center justify-center flex-shrink-0">
            <span className="text-[32px] font-bold text-secondary">
              {form.firstName ? form.firstName[0] : "E"}
            </span>
          </div>
          <div>
            <p className="text-[22px] font-medium text-primary uppercase">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-[12px] tracking-[0.08em] text-secondary mt-1">
              {form.email}
            </p>
            <p className="text-[11px] tracking-[0.1em] font-semibold text-secondary/60 uppercase mt-1">
              Member sejak {form.memberSince}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {fields.map(({ label, key, type }) => (
            <div key={key} className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] font-semibold text-secondary block uppercase">
                {label}
              </label>
              {editing ? (
                <input
                  type={type}
                  value={form[key]}
                  disabled={key === "email"}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-transparent border-b border-primary focus:ring-0 py-3 text-[16px] text-primary transition-colors outline-none disabled:opacity-50"
                />
              ) : (
                <p className="py-3 text-[16px] text-primary border-b border-stone-100">
                  {form[key] || "-"}
                </p>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleSave}
              className="bg-primary text-on-primary px-12 py-4 text-[13px] tracking-[0.12em] font-semibold uppercase hover:opacity-80 transition-opacity"
            >
              SIMPAN
            </button>
            <button
              onClick={() => {
                setEditing(false);
                window.location.reload();
              }}
              className="border border-stone-200 text-secondary px-10 py-4 text-[13px] tracking-[0.12em] font-semibold uppercase hover:border-primary hover:text-primary transition-all"
            >
              BATAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB 2 — ALAMAT PENGIRIMAN
───────────────────────────────────────── */
function AddressTab() {
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [provinceList, setProvinceList] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [form, setForm] = useState({
    label: "",
    recipient: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal: "",
  });

  const loadAddresses = () => {
    getUserAddresses().then(setAddresses);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // Ambil daftar provinsi dari tabel ShippingZone di database lokal
  useEffect(() => {
    setLoadingProvinces(true);
    fetch("/api/shipping/zones")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const names = data.zones.map((z: any) => z.province);
          setProvinceList(names);
        }
      })
      .finally(() => setLoadingProvinces(false));
  }, []);

  const openAdd = () => {
    setForm({
      label: "",
      recipient: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postal: "",
    });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (a: any) => {
    setForm({
      label: a.label,
      recipient: a.recipient,
      phone: a.phone,
      address: a.address,
      city: a.city,
      province: a.province,
      postal: a.postal,
    });
    setEditId(a.id);
    setShowForm(true);
  };

  const saveForm = async () => {
    if (!form.label.trim()) {
      showToast("Label alamat wajib diisi.", "warning");
      return;
    }
    if (!form.recipient.trim()) {
      showToast("Nama penerima wajib diisi.", "warning");
      return;
    }
    if (!form.phone.trim()) {
      showToast("No. telepon wajib diisi.", "warning");
      return;
    }
    if (!form.address.trim()) {
      showToast("Alamat lengkap wajib diisi.", "warning");
      return;
    }
    if (!form.city.trim()) {
      showToast("Kota wajib diisi.", "warning");
      return;
    }
    if (!form.province) {
      showToast("Silakan pilih provinsi.", "warning");
      return;
    }
    if (!form.postal.trim()) {
      showToast("Kode pos wajib diisi.", "warning");
      return;
    }

    await saveUserAddress(form, editId || undefined);
    setShowForm(false);
    loadAddresses();
  };

  const deleteAddress = async (id: string) => {
    await deleteUserAddress(id);
    loadAddresses();
  };

  const setDefault = async (id: string) => {
    await setAddressDefault(id);
    loadAddresses();
  };

  const textFields = [
    {
      label: "Label Alamat (cth: Rumah, Kantor)",
      key: "label" as const,
      colSpan: "md:col-span-2",
    },
    { label: "Nama Penerima", key: "recipient" as const },
    { label: "No. Telepon", key: "phone" as const },
    {
      label: "Alamat Lengkap",
      key: "address" as const,
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-14">
        <div>
          <h2 className="text-[40px] md:text-[48px] leading-tight font-semibold text-primary uppercase mb-4">
            Alamat Pengiriman
          </h2>
          <div className="h-px w-20 bg-stone-200" />
          <p className="text-[14px] text-secondary mt-4">
            Alamat ini akan otomatis terisi saat checkout.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 text-[12px] tracking-[0.12em] font-semibold text-secondary hover:text-primary border border-stone-200 hover:border-primary px-4 py-2 mt-2 transition-colors uppercase"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            TAMBAH
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-12 border border-outline-variant p-8 bg-surface-container/30">
          <h3 className="text-[13px] tracking-[0.15em] font-semibold text-primary uppercase mb-8">
            {editId !== null ? "EDIT ALAMAT" : "TAMBAH ALAMAT BARU"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {textFields.map(({ label, key, colSpan }) => (
              <div key={key} className={`space-y-2 ${colSpan ?? ""}`}>
                <label className="text-[11px] tracking-[0.15em] font-semibold text-secondary block uppercase">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-transparent border-b border-primary focus:ring-0 py-3 text-[15px] text-primary outline-none"
                  placeholder={label}
                />
              </div>
            ))}
          </div>
          {/* Provinsi, Kota, Kode Pos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] font-semibold text-secondary block uppercase">
                Provinsi
              </label>
              <select
                value={form.province}
                onChange={(e) => {
                  setForm({ ...form, province: e.target.value });
                }}
                className="w-full bg-transparent border-b border-primary focus:ring-0 py-3 text-[15px] text-primary outline-none cursor-pointer"
              >
                <option value="">
                  {loadingProvinces ? "Memuat..." : "Pilih Provinsi"}
                </option>
                {provinceList.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] font-semibold text-secondary block uppercase">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-transparent border-b border-primary focus:ring-0 py-3 text-[15px] text-primary outline-none"
                placeholder="Contoh: Tangerang Selatan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] font-semibold text-secondary block uppercase">
                Kode Pos
              </label>
              <input
                type="text"
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
                className="w-full bg-transparent border-b border-primary focus:ring-0 py-3 text-[15px] text-primary outline-none"
                placeholder="Kode Pos"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={saveForm}
              className="bg-primary text-on-primary px-10 py-4 text-[13px] tracking-[0.12em] font-semibold uppercase hover:opacity-80 transition-opacity"
            >
              SIMPAN
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-stone-200 text-secondary px-8 py-4 text-[13px] tracking-[0.12em] font-semibold uppercase hover:border-primary hover:text-primary transition-all"
            >
              BATAL
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-200">
          <span className="material-symbols-outlined text-[48px] text-stone-300 block mb-4">
            location_off
          </span>
          <p className="text-[14px] text-secondary mb-6">
            Belum ada alamat tersimpan.
          </p>
          <button
            onClick={openAdd}
            className="bg-primary text-on-primary px-10 py-4 text-[13px] tracking-[0.12em] font-semibold uppercase hover:opacity-80 transition-opacity"
          >
            + TAMBAH ALAMAT
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border p-8 transition-colors ${addr.isDefault ? "border-primary" : "border-stone-100"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] tracking-[0.12em] font-bold text-primary uppercase">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] tracking-[0.1em] font-semibold bg-primary text-on-primary px-2 py-0.5 uppercase">
                      UTAMA
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEdit(addr)}
                    className="text-[11px] tracking-[0.1em] font-semibold text-secondary hover:text-primary transition-colors uppercase flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      edit
                    </span>{" "}
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-[11px] tracking-[0.1em] font-semibold text-red-400 hover:text-red-500 transition-colors uppercase flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      delete
                    </span>{" "}
                    Hapus
                  </button>
                </div>
              </div>

              <p className="text-[15px] font-semibold text-primary mb-1">
                {addr.recipient}
              </p>
              <p className="text-[14px] text-secondary mb-1">{addr.phone}</p>
              <p className="text-[14px] text-secondary">{addr.address}</p>
              <p className="text-[14px] text-secondary">
                {addr.city}, {addr.province} {addr.postal}
              </p>

              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  className="mt-4 text-[11px] tracking-[0.12em] font-semibold text-secondary hover:text-primary border border-stone-200 hover:border-primary px-4 py-2 transition-colors uppercase"
                >
                  JADIKAN ALAMAT UTAMA
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB 3 — RIWAYAT PESANAN (with Timeline)
───────────────────────────────────────── */
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getUserOrders().then(setOrders);
  }, []);

  // Step order: 0=MENUNGGU KONFIRMASI, 1=DIPROSES, 2=DIKIRIM, 3=DITERIMA
  const STATUS_STEPS = ["MENUNGGU KONFIRMASI", "DIPROSES", "DIKIRIM", "DITERIMA"];

  const getStepIndex = (status: string) => {
    if (status === "DIBATALKAN") return -1;
    return STATUS_STEPS.indexOf(status);
  };

  const statusColor: Record<string, string> = {
    DITERIMA: "text-green-600 border-green-200 bg-green-50",
    DIKIRIM: "text-blue-500 border-blue-200 bg-blue-50",
    DIPROSES: "text-amber-500 border-amber-200 bg-amber-50",
    "MENUNGGU KONFIRMASI": "text-orange-500 border-orange-200 bg-orange-50",
    DIBATALKAN: "text-red-400 border-red-200 bg-red-50",
  };

  return (
    <div>
      <header className="mb-14">
        <h2 className="text-[40px] md:text-[48px] leading-tight font-semibold text-primary uppercase mb-4">
          Riwayat Pesanan
        </h2>
        <div className="h-px w-20 bg-stone-200" />
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-200">
          <span className="material-symbols-outlined text-[48px] text-stone-300 block mb-4">
            shopping_bag
          </span>
          <p className="text-[14px] text-secondary mb-6">Belum ada pesanan.</p>
          <Link
            href="/koleksi"
            className="bg-primary text-on-primary px-10 py-4 text-[13px] tracking-[0.12em] font-semibold uppercase hover:opacity-80 transition-opacity inline-block"
          >
            MULAI BELANJA
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const stepIndex = getStepIndex(order.status);
            const isCancelled = order.status === "DIBATALKAN";
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="border border-stone-100 overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full text-left px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors"
                >
                  <div>
                    <p className="text-[13px] tracking-[0.1em] font-bold text-primary uppercase">
                      {order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[12px] tracking-[0.08em] font-semibold text-secondary uppercase mt-0.5">
                      {order.date}
                    </p>
                    <p className="text-[13px] text-secondary mt-1 line-clamp-1">
                      {order.items}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <p className="text-[16px] font-semibold text-primary">
                      {order.total}
                    </p>
                    <span
                      className={`text-[11px] tracking-[0.1em] font-semibold border px-3 py-1 uppercase ${statusColor[order.status] ?? "text-secondary border-stone-200"}`}
                    >
                      {order.status}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-secondary">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </div>
                </button>

                {/* Expanded: Timeline + Tracking */}
                {isExpanded && (
                  <div className="border-t border-stone-100 px-8 py-8 bg-surface/50">
                    {/* Status Timeline */}
                    {!isCancelled ? (
                      <div className="mb-8">
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-5">
                          Status Pesanan
                        </p>
                        <div className="flex items-start gap-0">
                          {STATUS_STEPS.map((step, idx) => {
                            const isDone = idx <= stepIndex;
                            const isCurrent = idx === stepIndex;
                            return (
                              <div key={step} className="flex flex-1 items-start">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isDone
                                        ? "bg-primary border-primary"
                                        : "bg-transparent border-stone-200"
                                    } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-1" : ""}`}
                                  >
                                    {isDone && (
                                      <svg
                                        viewBox="0 0 24 24"
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth={2.5}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <p
                                    className={`text-[10px] font-semibold uppercase tracking-widest mt-2 text-center ${
                                      isDone ? "text-primary" : "text-stone-300"
                                    }`}
                                  >
                                    {step}
                                  </p>
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                  <div
                                    className={`flex-1 h-0.5 mt-4 mx-1 transition-colors ${
                                      idx < stepIndex ? "bg-primary" : "bg-stone-200"
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200">
                        <span className="material-symbols-outlined text-red-400">cancel</span>
                        <p className="text-[13px] text-red-500 font-medium">
                          Pesanan ini telah dibatalkan.
                        </p>
                      </div>
                    )}

                    {/* Tracking Number */}
                    {order.trackingNumber && (order.status === "DIKIRIM" || order.status === "DITERIMA") && (
                      <div className="bg-blue-50 border border-blue-200 px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-blue-500 font-semibold mb-0.5">
                            Nomor Resi
                          </p>
                          <p className="text-[16px] font-bold text-blue-700 tracking-wider">
                            {order.trackingNumber}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(order.trackingNumber);
                          }}
                          className="text-[11px] text-blue-500 border border-blue-300 px-3 py-1.5 hover:bg-blue-100 transition-colors uppercase tracking-widest"
                        >
                          SALIN
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
