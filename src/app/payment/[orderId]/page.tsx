"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_MB = 2;

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Order data state
  const [orderData, setOrderData] = useState<{
    total: number;
    items: string;
    status: string;
  } | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  // Fetch order data on mount
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrderData(data.order);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setOrderLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFileError("");
    setFile(null);
    setFilePreview("");

    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError("File harus berupa gambar (.jpg, .jpeg, atau .png).");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError("Bukti transfer wajib diunggah.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orderId", orderId);

      const res = await fetch("/api/payment-proof", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Gagal mengirim bukti transfer.");
      }

      setIsDone(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE
  if (isDone) {
    return (
      <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center items-center ">
        <div className="w-full max-w-2xl bg-surface border border-outline-variant/30 p-8 md:p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-950/20 text-green-500 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold uppercase tracking-wide mb-2">
            Bukti Transfer Diterima
          </h1>
          <p className="text-[13px] text-secondary uppercase tracking-widest mb-8">
            Tim kami akan memverifikasi pembayaran Anda maksimal 1×24 jam.
          </p>
          <div className="space-y-4">
            <Link
              href="/my-account"
              className="block w-full bg-primary text-on-primary font-bold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300"
            >
              LIHAT STATUS PESANAN
            </Link>
            <Link
              href="/koleksi"
              className="block w-full text-secondary font-semibold uppercase tracking-[0.15em] py-4 border border-outline-variant/50 hover:border-primary hover:text-primary transition-colors duration-300"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center ">
      <div className="w-full max-w-2xl">
        <div className="mb-10 border-b border-outline-variant/30 pb-4">
          <p className="text-[11px] text-secondary uppercase tracking-widest mb-1">
            Order {orderId}
          </p>
          <h1 className="text-[28px] md:text-[36px] font-bold uppercase tracking-wide">
            Payment Instructions
          </h1>
        </div>

        {/* Total Yang Harus Dibayar */}
        <div className="border border-primary/20 bg-primary/[0.03] p-6 mb-8">
          <p className="text-[11px] text-secondary tracking-widest uppercase mb-2 font-semibold">
            Total Yang Harus Dibayar
          </p>
          {orderLoading ? (
            <div className="h-10 bg-outline-variant/20 animate-pulse w-48" />
          ) : orderData ? (
            <>
              <p className="text-[32px] md:text-[40px] font-bold tracking-wide">
                {formatRupiah(orderData.total)}
              </p>
              <div className="mt-4 pt-4 border-t border-outline-variant/20">
                <p className="text-[10px] text-secondary tracking-widest uppercase mb-2 font-semibold">
                  Ringkasan Pesanan
                </p>
                <pre className="text-[12px] text-secondary whitespace-pre-wrap leading-relaxed">
                  {orderData.items}
                </pre>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-secondary">
              Tidak dapat memuat data pesanan.
            </p>
          )}
        </div>

        {/* Info Bank Transfer */}
        <div className="border border-outline-variant/50 p-6 bg-surface mb-8 space-y-4">
          <p className="text-[11px] text-secondary tracking-widest uppercase border-b border-outline-variant/30 pb-3 mb-4">
            Transfer ke salah satu rekening berikut
          </p>

          <div className="flex justify-between items-center p-4 border border-outline-variant/30 bg-surface-container-lowest">
            <div>
              <p className="text-[14px] font-bold mb-1">
                BCA (Bank Central Asia)
              </p>
              <p className="text-[11px] text-secondary uppercase tracking-widest">
                A/N EGOISM STUDIOS
              </p>
            </div>
            <p className="text-[16px] font-bold tracking-widest">
              872 123 4567
            </p>
          </div>

          <div className="flex justify-between items-center p-4 border border-outline-variant/30 bg-surface-container-lowest">
            <div>
              <p className="text-[14px] font-bold mb-1">Bank Mandiri</p>
              <p className="text-[11px] text-secondary uppercase tracking-widest">
                A/N EGOISM STUDIOS
              </p>
            </div>
            <p className="text-[16px] font-bold tracking-widest">
              137 000 123 4567
            </p>
          </div>

          <p className="text-[12px] text-secondary leading-relaxed pt-2">
            Transfer sesuai nominal exact. Simpan bukti transfer lalu upload di
            form di bawah. Pesanan diaktifkan setelah verifikasi maksimal 1×24
            jam.
          </p>
        </div>

        {/* Form Upload Bukti */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-4">
              Upload Bukti Transfer
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[180px] ${
                fileError
                  ? "border-red-500/50 bg-red-950/10"
                  : "border-outline-variant/50 hover:border-primary"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
              />

              {filePreview ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filePreview}
                    alt="Preview bukti transfer"
                    className="max-h-52 object-contain border border-outline-variant/30"
                  />
                  <p className="text-[11px] text-secondary uppercase tracking-widest">
                    Klik untuk ganti file
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[13px] text-primary/70 font-medium mb-1">
                    KLIK UNTUK UPLOAD BUKTI TRANSFER
                  </p>
                  <p className="text-[11px] text-secondary uppercase tracking-widest">
                    JPG, JPEG, PNG — Maks. 2MB
                  </p>
                </div>
              )}
            </div>

            {fileError && (
              <p className="mt-2 text-[11px] text-red-400 uppercase tracking-wider">
                {fileError}
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 text-[12px] font-medium uppercase tracking-wider border bg-red-950/20 border-red-500/50 text-red-400">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !file}
            className="w-full bg-primary text-on-primary font-bold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "MENGIRIM..." : "KIRIM BUKTI PEMBAYARAN"}
          </button>
        </form>
      </div>
    </div>
  );
}
