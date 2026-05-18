"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCartItems } from "@/lib/products";
import { getUserAddresses } from "@/lib/account";
import { processCheckout } from "@/lib/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("manual");

  useEffect(() => {
    const fetchData = async () => {
      const cookies = document.cookie.split(";");
      const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));

      if (!userIdCookie) {
        router.push("/login");
        return;
      }

      const userId = userIdCookie.split("=")[1];
      const items = await getCartItems(userId);
      const addresses = await getUserAddresses();

      setCartItems(items);
      setAddress(addresses.find((a: any) => a.isDefault) || addresses[0]);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!address) {
      alert(
        "Silakan tambah alamat pengiriman di menu My Account terlebih dahulu.",
      );
      router.push("/my-account");
      return;
    }

    setIsProcessing(true);
    const result = await processCheckout();

    if (result.success) {
      router.push(`/payment/${result.orderId}`);
    } else {
      alert(result.message);
      setIsProcessing(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary tracking-widest text-[12px] uppercase">
        LOADING CHECKOUT...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-[120px] bg-background text-center flex flex-col items-center">
        <p className="text-[14px] font-['Inter'] text-secondary uppercase tracking-widest mb-6">
          Keranjang Anda Kosong.
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

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-surface-container-lowest text-primary px-5 md:px-16 flex justify-center font-['Inter']">
      <div className="w-full max-w-6xl">
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[40px] font-bold uppercase tracking-wide mb-10 border-b border-outline-variant/30 pb-4">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* KOLOM KIRI: ALAMAT & BARANG */}
          <div className="lg:col-span-3 space-y-10">
            <section>
              <h2 className="text-[12px] font-semibold tracking-widest uppercase text-secondary mb-4">
                SHIPPING ADDRESS
              </h2>
              {address ? (
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
              ) : (
                <div className="border border-red-500/50 p-6 text-red-400 text-[13px] uppercase tracking-wider">
                  Belum ada alamat. Silakan atur di Profil Anda.
                </div>
              )}
            </section>

            <section>
              <h2 className="text-[12px] font-semibold tracking-widest uppercase text-secondary mb-4">
                ORDER SUMMARY
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
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold uppercase text-[13px]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-secondary uppercase tracking-wider mt-1">
                        Color: {item.color} | Size: {item.size}
                      </p>
                      <p className="text-[11px] text-secondary uppercase tracking-wider mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-[13px] font-semibold mt-2 text-primary">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(item.price * item.quantity)}
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
              <div className="flex justify-between text-[13px] mb-4 text-secondary">
                <span>SUBTOTAL</span>
                <span>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[13px] mb-6 text-secondary border-b border-outline-variant/30 pb-4">
                <span>SHIPPING</span>
                <span>FREE</span>
              </div>

              <div className="flex justify-between text-[16px] font-bold mb-8 text-primary">
                <span>TOTAL</span>
                <span>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalAmount)}
                </span>
              </div>

              {/* PAYMENT SECTION (Sesuai Gambar) */}
              <div className="border-t border-outline-variant/30 pt-6 mb-8">
                <h2 className="text-[18px] font-medium mb-6 font-['Playfair_Display'] tracking-wide">
                  Payment
                </h2>

                <div className="space-y-4 mb-8">
                  {/* Option 1: Direct Bank Transfer (Active) */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="manual"
                      checked={paymentMethod === "manual"}
                      onChange={() => setPaymentMethod("manual")}
                      className="mt-1.5 w-4 h-4 accent-primary"
                    />
                    <div className="flex-1">
                      <span className="text-[14px] font-medium block mb-2">
                        Direct bank transfer (require manual payment
                        confirmation)
                      </span>
                      {paymentMethod === "manual" && (
                        <div className="text-[13px] text-secondary bg-surface-container/20 p-4 border border-outline-variant/30">
                          We accept bank transfer payment via BCA and Mandiri
                          bank.
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Disclaimer Warning Text */}
                <div className="text-[12px] text-red-500/90 space-y-4 mb-8 leading-relaxed tracking-wide">
                  <p>
                    Orders require approximately 7–8 working days to be
                    processed before dispatch. Please note that orders that have
                    been paid or confirmed cannot be cancelled.
                  </p>
                  <p>
                    Setiap pesanan membutuhkan waktu sekitar 7–8 hari kerja
                    untuk diproses sebelum pengiriman. Mohon diperhatikan bahwa
                    pesanan yang telah dibayarkan atau dikonfirmasi tidak dapat
                    dibatalkan.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !address}
                className="w-full bg-primary text-on-primary font-bold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300 disabled:opacity-50"
              >
                {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
