"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCartItems } from "@/lib/products";
import { getUserId, getUserAddresses, saveUserAddress, isGuestUser } from "@/lib/account";
import { processCheckout } from "@/lib/checkout";
import { useToast } from "@/components/ui/Toast";

interface ShippingZone {
  zone: string;
  province: string;
  cost: number;
  etd: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPembayaranMethod] = useState("manual");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Inline address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [provinceList, setProvinsiList] = useState<string[]>([]);
  const [addressForm, setAddressForm] = useState({
    label: "Rumah",
    recipient: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    guestEmail: "",
  });

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Shipping states
  const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState("");

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch ongkir dari database lokal berdasarkan provinsi
  const fetchShippingZone = useCallback(async (province: string) => {
    setLoadingShipping(true);
    setShippingError("");
    setShippingZone(null);

    try {
      const res = await fetch(
        `/api/shipping/zones?province=${encodeURIComponent(province)}`,
      );
      const data = await res.json();

      if (data.success && data.zone) {
        setShippingZone(data.zone);
      } else {
        setShippingError(
          "Pengiriman ke provinsi ini belum didukung secara otomatis atau sedang ada gangguan jaringan. Silakan hubungi WhatsApp Admin untuk bantuan manual, atau coba gunakan alamat lain.",
        );
      }
    } catch {
      setShippingError("Gagal mengambil data ongkir.");
    } finally {
      setLoadingShipping(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getUserId();

        if (!userId) {
          router.push("/login");
          return;
        }

        // Fetch cart dan address secara parallel
        const [items, addrs, guestCheck] = await Promise.all([
          getCartItems(userId),
          getUserAddresses(),
          isGuestUser(),
        ]);

        setCartItems(items || []);
        setIsGuest(!!guestCheck);

        const validAddresses = Array.isArray(addrs) ? addrs : [];
        setAddresses(validAddresses);
        const defaultAddr =
          validAddresses.find((a: any) => a.isDefault) || validAddresses[0];

        setAddress(defaultAddr || null);

        // Auto-fetch ongkir berdasarkan provinsi di alamat
        if (defaultAddr?.province) {
          fetchShippingZone(defaultAddr.province);
        }

        // Fetch province list untuk inline form
        const res = await fetch("/api/shipping/zones");
        const data = await res.json();
        if (data.success) {
          setProvinsiList(data.zones.map((z: any) => z.province));
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        setFetchError(
          "Gagal memuat data checkout. Silakan refresh halaman atau coba lagi nanti.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, fetchShippingZone]);

  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      showToast("Anda harus menyetujui Syarat & Ketentuan.", "warning");
      return;
    }

    if (!address) {
      showToast("Silakan tambah alamat pengiriman terlebih dahulu.", "warning");
      setShowAddressForm(true);
      return;
    }

    if (!shippingZone) {
      showToast(
        "Ongkir belum tersedia. Pastikan alamat sudah benar.",
        "warning",
      );
      return;
    }

    if (cartItems.length === 0) {
      showToast("Keranjang belanja Anda kosong.", "warning");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await processCheckout({
        promoCode: promoApplied?.code,
        shippingZone: address.province,
        shippingAddress: `${address.recipient} - ${address.phone}\n${address.address}, ${address.city}, ${address.province} ${address.postal}`,
      });

      if (result.success && result.orderId) {
        setOrderSuccess(true);
        showToast(
          "Pesanan berhasil dibuat! Menuju halaman pembayaran...",
          "success",
        );
        window.location.href = `/payment/${result.orderId}`;
      } else {
        showToast(
          result.message || "Gagal memproses pesanan. Silakan coba lagi.",
          "error",
        );
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast(
        "Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.",
        "error",
      );
      setIsProcessing(false);
    }
  };

  // Simpan alamat baru langsung dari checkout
  const handleSaveAddress = async () => {
    if (
      !addressForm.recipient ||
      !addressForm.phone ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.province ||
      !addressForm.postal
    ) {
      showToast("Lengkapi semua field alamat.", "warning");
      return;
    }
    if (isGuest && !addressForm.guestEmail) {
      showToast("Email wajib diisi untuk pelanggan Guest agar resi dapat dikirim.", "warning");
      return;
    }

    setSavingAddress(true);
    try {
      // Hilangkan guestEmail dari data address karena tidak ada di schema Address
      const { guestEmail, ...addressData } = addressForm;
      const res = await saveUserAddress(addressData, undefined, isGuest ? guestEmail : undefined);
      
      if (!res.success) {
        showToast(res.message || "Gagal menyimpan alamat.", "error");
        setSavingAddress(false);
        return;
      }
      
      const addrs = await getUserAddresses();
      const validAddresses = Array.isArray(addrs) ? addrs : [];
      setAddresses(validAddresses);
      const newAddr = validAddresses[validAddresses.length - 1];
      setAddress(newAddr);
      if (newAddr?.province) fetchShippingZone(newAddr.province);
      setShowAddressForm(false);
      showToast("Alamat berhasil disimpan!", "success");
    } catch {
      showToast("Gagal menyimpan alamat.", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  // Apply promo code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoApplied(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, orderTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoApplied(data.promo);
        showToast(data.message, "success");
      } else {
        setPromoError(data.message);
      }
    } catch {
      setPromoError("Gagal memvalidasi kode promo.");
    } finally {
      setPromoLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  
  let shippingCost = shippingZone?.cost || 0;
  const isJabodetabek = shippingZone && (
    shippingZone.province.toLowerCase().includes("jakarta") || 
    shippingZone.province.toLowerCase().includes("banten") || 
    shippingZone.province.toLowerCase().includes("jawa barat")
  );
  
  if (isJabodetabek) {
    shippingCost = 0;
  }

  const discountAmount = promoApplied?.discountAmount || 0;
  const grandTotal = subtotal + shippingCost - discountAmount;

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // ========================
  // LOADING STATE
  // ========================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
        <div className="inline-block w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
        <p className="tracking-widest text-[12px] uppercase">
          MEMUAT DATA CHECKOUT...
        </p>
      </div>
    );
  }

  // ========================
  // FETCH ERROR STATE
  // ========================
  if (fetchError) {
    return (
      <div className="min-h-screen pt-[120px] bg-background text-center flex flex-col items-center px-5">
        <div className="w-16 h-16 bg-red-950/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-[14px] text-red-400 uppercase tracking-widest mb-2">
          TERJADI KESALAHAN
        </p>
        <p className="text-[13px] text-secondary mb-8 max-w-md">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="border border-primary px-8 py-3 text-[12px] tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-colors"
        >
          COBA LAGI
        </button>
      </div>
    );
  }

  // ========================
  // SUCCESS / REDIRECTING STATE
  // ========================
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
        <div className="inline-block w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
        <p className="tracking-widest text-[12px] uppercase">
          MENGALIHKAN KE PEMBAYARAN...
        </p>
      </div>
    );
  }

  // ========================
  // EMPTY CART STATE
  // ========================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-[120px] bg-background text-center flex flex-col items-center px-5">
        <p className="text-[14px] text-secondary uppercase tracking-widest mb-6">
          KERANJANG ANDA KOSONG.
        </p>
        <Link
          href="/koleksi"
          className="border border-primary px-8 py-3 text-[12px] tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-colors"
        >
          KEMBALI BELANJA
        </Link>
      </div>
    );
  }

  // ========================
  // Cek apakah checkout bisa dilakukan
  // ========================
  const canPlaceOrder =
    agreeTerms &&
    address &&
    shippingZone &&
    !isProcessing &&
    !loadingShipping &&
    cartItems.length > 0;

  // ========================
  // MAIN CHECKOUT UI
  // ========================
  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-surface-container-lowest text-primary px-5 md:px-16 flex justify-center ">
      <div className="w-full max-w-6xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 text-[11px] uppercase tracking-widest text-secondary">
          <span className="text-secondary/50">KERANJANG</span>
          <span className="text-secondary/30">→</span>
          <span className="text-primary font-bold">CHECKOUT</span>
          <span className="text-secondary/30">→</span>
          <span className="text-secondary/50">PEMBAYARAN</span>
        </div>

        <h1 className="text-[32px] md:text-[40px] font-bold uppercase tracking-wide mb-10 border-b border-outline-variant/30 pb-4">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* KOLOM KIRI: ALAMAT & BARANG */}
          <div className="lg:col-span-3 space-y-10">
            {/* ===== SECTION 1: ALAMAT PENGIRIMAN ===== */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[12px] font-semibold tracking-widest uppercase text-secondary">
                  ALAMAT PENGIRIMAN
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-[11px] tracking-widest uppercase text-primary/70 hover:text-primary transition-colors border-b border-primary/30 hover:border-primary"
                >
                  {address
                    ? showAddressForm
                      ? "CANCEL"
                      : "EDIT / ADD"
                    : "ADD ADDRESS"}
                </button>
              </div>

              {/* Pilih dari alamat yang sudah ada */}
              {addresses.length > 1 && !showAddressForm && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {addresses.map((addr: any) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setAddress(addr);
                        if (addr.province) fetchShippingZone(addr.province);
                      }}
                      className={`text-[11px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                        address?.id === addr.id
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant/40 hover:border-primary"
                      }`}
                    >
                      {addr.label}
                    </button>
                  ))}
                </div>
              )}

              {address && !showAddressForm ? (
                <div className="border border-outline-variant/50 p-6 bg-surface-container/20">
                  <p className="font-bold uppercase text-[14px] mb-1">
                    {address.recipient} ({address.label})
                  </p>
                  <p className="text-[13px] text-secondary mb-1">
                    {address.phone}
                  </p>
                  <p className="text-[13px] text-secondary">
                    {address.address}
                  </p>
                  <p className="text-[13px] text-secondary">
                    {address.city}, {address.province} {address.postal}
                  </p>
                </div>
              ) : !showAddressForm ? (
                <div className="border border-red-500/50 p-6 bg-red-950/10">
                  <p className="text-red-400 text-[13px] uppercase tracking-wider mb-3">
                    Belum ada alamat pengiriman.
                  </p>
                </div>
              ) : null}

              {/* Inline Address Form */}
              {showAddressForm && (
                <div className="border border-outline-variant/50 p-6 bg-surface-container/10 space-y-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-2">
                    TAMBAH ALAMAT BARU
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(
                      [
                        { label: "Label (contoh: Rumah)", key: "label" },
                        { label: "Nama Penerima", key: "recipient" },
                        { label: "Nomor Telepon", key: "phone" },
                      ] as { label: string; key: keyof typeof addressForm }[]
                    ).map(({ label, key }) => (
                      <div key={key}>
                        <label className="text-[10px] uppercase tracking-widest text-secondary block mb-1">
                          {label}
                        </label>
                        <input
                          type="text"
                          value={addressForm[key]}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              [key]: e.target.value,
                            })
                          }
                          placeholder={label}
                          className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[13px] text-primary"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary block mb-1">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        value={addressForm.address}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            address: e.target.value,
                          })
                        }
                        placeholder="Alamat jalan..."
                        className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[13px] text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-secondary block mb-1">
                        Kota
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        placeholder="Kota"
                        className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[13px] text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-secondary block mb-1">
                        Provinsi
                      </label>
                      <select
                        value={addressForm.province}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            province: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[13px] text-primary cursor-pointer"
                      >
                        <option value="">Select Provinsi</option>
                        {provinceList.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-secondary block mb-1">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={addressForm.postal}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postal: e.target.value,
                          })
                        }
                        placeholder="Kode Pos"
                        className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[13px] text-primary"
                      />
                    </div>
                    {isGuest && (
                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-secondary block mb-1">
                          Alamat Email (Untuk Info Resi)
                        </label>
                        <input
                          type="email"
                          value={addressForm.guestEmail}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              guestEmail: e.target.value,
                            })
                          }
                          placeholder="Alamat email Anda"
                          className="w-full bg-transparent border-b border-primary/50 focus:border-primary focus:outline-none py-2 text-[13px] text-primary"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                      className="bg-primary text-on-primary px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {savingAddress ? "SAVING..." : "SAVE ADDRESS"}
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="border border-outline-variant/50 text-secondary px-4 py-2.5 text-[11px] uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* ===== SECTION 2: PENGIRIMAN / ONGKIR ===== */}
            <section>
              <h2 className="text-[12px] font-semibold tracking-widest uppercase text-secondary mb-4">
                PENGIRIMAN
              </h2>

              {loadingShipping ? (
                <div className="border border-outline-variant/30 p-8 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
                  <p className="text-[12px] text-secondary uppercase tracking-widest">
                    Menghitung ongkir...
                  </p>
                </div>
              ) : shippingError ? (
                <div className="border border-amber-500/30 bg-amber-50/10 p-6">
                  <p className="text-[13px] text-amber-600 uppercase tracking-wider mb-3">
                    {shippingError}
                  </p>
                  {address?.province && (
                    <button
                      onClick={() => fetchShippingZone(address.province)}
                      className="text-[11px] tracking-widest uppercase text-amber-600 border border-amber-500/30 px-4 py-2 hover:bg-amber-500/10 transition-colors"
                    >
                      RECALCULATE
                    </button>
                  )}
                </div>
              ) : shippingZone ? (
                <div className="border border-primary/50 bg-surface-container/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold uppercase tracking-wide">
                        Zona {shippingZone.zone}
                      </p>
                      <p className="text-[11px] text-secondary mt-0.5">
                        {shippingZone.province} • Estimasi {shippingZone.etd}
                      </p>
                    </div>
                    <p className="text-[16px] font-bold text-primary whitespace-nowrap ml-4">
                      {formatIDR(shippingZone.cost)}
                    </p>
                  </div>
                </div>
              ) : !address ? (
                <div className="border border-outline-variant/30 p-6 text-[13px] text-secondary uppercase tracking-wider text-center">
                  Pilih atau tambah alamat untuk menghitung ongkir.
                </div>
              ) : (
                <div className="border border-outline-variant/30 p-6 text-center">
                  <p className="text-[13px] text-secondary uppercase tracking-wider mb-3">
                    Ongkir belum dihitung.
                  </p>
                  <button
                    onClick={() => fetchShippingZone(address.province)}
                    className="text-[11px] tracking-widest uppercase text-primary border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-colors"
                  >
                    CALCULATE PENGIRIMAN
                  </button>
                </div>
              )}
            </section>

            {/* ===== SECTION 3: RINGKASAN PESANAN ===== */}
            <section>
              <h2 className="text-[12px] font-semibold tracking-widest uppercase text-secondary mb-4">
                RINGKASAN PESANAN
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-outline-variant/30 pb-4"
                  >
                    <div className="w-20 h-24 relative bg-surface flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        loading="lazy"
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold uppercase text-[13px]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-secondary uppercase tracking-wider mt-1">
                        Warna: {item.color} | Ukuran: {item.size}
                      </p>
                      <p className="text-[11px] text-secondary uppercase tracking-wider mt-1">
                        Jumlah: {item.quantity}
                      </p>
                      <p className="text-[13px] font-semibold mt-2 text-primary">
                        {formatIDR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: PAYMENT & TOMBOL */}
          <div className="lg:col-span-2">
            <div className="border border-outline-variant/50 p-6 lg:sticky lg:top-32 bg-surface-container-lowest">
              <div className="flex justify-between text-[13px] mb-3 text-secondary">
                <span>SUBTOTAL ({totalQuantity} barang)</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] mb-3 text-secondary">
                <span>PENGIRIMAN</span>
                <span>
                  {loadingShipping
                    ? "Menghitung..."
                    : shippingZone
                      ? shippingCost === 0 ? "GRATIS (JABODETABEK)" : formatIDR(shippingCost)
                      : !address
                        ? "Butuh alamat"
                        : "Belum tersedia"}
                </span>
              </div>
              {shippingZone && (
                <div className="text-[10px] text-secondary/70 mb-3 uppercase tracking-wider">
                  Zona {shippingZone.zone} • Est. {shippingZone.etd}
                </div>
              )}

              {/* Promo Code / Voucher */}
              <div className="border-t border-outline-variant/30 pt-4 mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-3">
                  KODE PROMO
                </p>
                {promoApplied ? (
                  <div className="flex items-center justify-between bg-green-950/10 border border-green-500/30 px-3 py-2">
                    <div>
                      <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest">
                        {promoApplied.code}
                      </p>
                      <p className="text-[10px] text-green-600/80 mt-0.5">
                        -{formatIDR(promoApplied.discountAmount)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPromoApplied(null);
                        setPromoCode("");
                        setPromoError("");
                      }}
                      className="text-[10px] text-secondary hover:text-red-400 uppercase tracking-widest"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      placeholder="MASUKKAN KODE"
                      className="flex-1 bg-transparent border border-outline-variant/50 focus:border-primary focus:outline-none px-3 py-2 text-[12px] text-primary uppercase tracking-widest"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                      className="bg-primary text-on-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 disabled:opacity-50 transition-opacity flex-shrink-0"
                    >
                      {promoLoading ? "..." : "APPLY"}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[10px] text-red-400 mt-1.5 uppercase tracking-wider">
                    {promoError}
                  </p>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[13px] mb-3 text-green-600">
                  <span>DISKON</span>
                  <span>-{formatIDR(discountAmount)}</span>
                </div>
              )}

              <div className="border-t border-outline-variant/30 pt-4 mb-6" />

              <div className="flex justify-between text-[16px] font-bold mb-8 text-primary">
                <span>TOTAL</span>
                <span>{formatIDR(grandTotal)}</span>
              </div>

              {/* PAYMENT SECTION */}
              <div className="border-t border-outline-variant/30 pt-6 mb-8">
                <h2 className="text-[18px] font-medium mb-6 tracking-wide">
                  Pembayaran
                </h2>

                <div className="space-y-4 mb-8">
                  {/* Option 1: Direct Bank Transfer (Active) */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="manual"
                      checked={paymentMethod === "manual"}
                      onChange={() => setPembayaranMethod("manual")}
                      className="mt-1.5 w-4 h-4 accent-primary"
                    />
                    <div className="flex-1">
                      <span className="text-[14px] font-medium block mb-2">
                        Direct bank transfer (require manual payment
                        confirmation)
                      </span>
                      {paymentMethod === "manual" && (
                        <div className="text-[13px] text-secondary bg-surface-container/20 p-4 border border-outline-variant/30">
                          Kami menerima pembayaran via transfer bank dan e-wallet. Detail akan diberikan pada halaman selanjutnya.
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Disclaimer Warning Text */}
                <div className="text-[12px] text-red-500/90 space-y-4 mb-8 leading-relaxed tracking-wide">
                  <p>
                    Orders require approximately 7–8 working days to be
                    processed before dispatch. Orders can be cancelled directly
                    through your Account page as long as they have not been
                    dispatched yet.
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="terms" className="text-[12px] cursor-pointer text-primary">
                    Saya setuju dengan Syarat & Ketentuan
                  </label>
                </div>
              </div>

              {/* Pesan info jika belum bisa checkout */}
              {!canPlaceOrder && !isProcessing && (
                <div className="text-[11px] text-amber-600 bg-amber-50/10 border border-amber-500/20 p-3 mb-4 uppercase tracking-wider text-center">
                  {!address
                    ? "PLEASE ADD ALAMAT PENGIRIMAN"
                    : !shippingZone && loadingShipping
                      ? "CALCULATING PENGIRIMAN..."
                      : !shippingZone
                        ? "PENGIRIMAN UNAVAILABLE"
                        : ""}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
                className="w-full bg-primary text-on-primary font-bold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="inline-block w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    MEMPROSES PESANAN...
                  </span>
                ) : (
                  "PLACE ORDER"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
