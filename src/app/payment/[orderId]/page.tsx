import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Payment Instruction — EGOISM" };

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;

  // Mencari data pesanan berdasarkan ID yang dilempar dari checkout
  const order: any = await (prisma as any).order.findUnique({
    where: { orderNumber: orderId },
  });

  if (!order) {
    redirect("/");
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center items-center font-['Inter']">
      <div className="w-full max-w-2xl bg-surface border border-outline-variant/30 p-8 md:p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-950/20 text-green-600 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
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
            ></path>
          </svg>
        </div>

        <h1 className="font-['Playfair_Display'] text-[28px] font-bold uppercase tracking-wide mb-2">
          Order Successfully Placed
        </h1>
        <p className="text-[13px] text-secondary uppercase tracking-widest mb-8">
          Please complete your payment to proceed.
        </p>

        {/* KOTAK RINCIAN PESANAN */}
        <div className="border border-outline-variant/50 p-6 bg-surface-container/20 text-left mb-8 space-y-4">
          <div className="flex justify-between border-b border-outline-variant/30 pb-3">
            <span className="text-[11px] text-secondary tracking-widest uppercase">
              Order ID
            </span>
            <span className="text-[14px] font-bold tracking-wider text-primary">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-3">
            <span className="text-[11px] text-secondary tracking-widest uppercase">
              Total Amount
            </span>
            <span className="text-[16px] font-bold text-amber-500 tracking-wider">
              {formatRupiah(order.total)}
            </span>
          </div>

          {/* KOTAK INSTRUKSI TRANSFER */}
          <div className="pt-4 space-y-6">
            <span className="text-[11px] text-secondary tracking-widest uppercase block mb-4 border-b border-outline-variant/30 pb-2">
              Manual Bank Transfer Details
            </span>

            {/* Bank BCA */}
            <div className="flex justify-between items-center bg-surface-container-lowest p-4 border border-outline-variant/50">
              <div>
                <p className="text-[14px] font-bold text-primary mb-1">
                  BCA (Bank Central Asia)
                </p>
                <p className="text-[12px] text-secondary uppercase tracking-widest">
                  A/N EGOISM STUDIOS
                </p>
              </div>
              <p className="text-[16px] font-bold tracking-widest text-primary">
                872 123 4567
              </p>
            </div>

            {/* Bank Mandiri */}
            <div className="flex justify-between items-center bg-surface-container-lowest p-4 border border-outline-variant/50">
              <div>
                <p className="text-[14px] font-bold text-primary mb-1">
                  Bank Mandiri
                </p>
                <p className="text-[12px] text-secondary uppercase tracking-widest">
                  A/N EGOISM STUDIOS
                </p>
              </div>
              <p className="text-[16px] font-bold tracking-widest text-primary">
                137 000 123 4567
              </p>
            </div>
          </div>
        </div>

        <div className="text-[12px] text-secondary space-y-2 mb-8 leading-relaxed">
          <p>
            Setelah melakukan transfer, pesanan Anda akan kami verifikasi secara
            manual maksimal dalam 1x24 jam.
          </p>
          <p>Anda dapat memantau status pesanan pada menu Dasbor Akun Anda.</p>
        </div>

        {/* TOMBOL NAVIGASI LANJUTAN */}
        <div className="space-y-4">
          <Link
            href="/my-account"
            className="block w-full bg-primary text-on-primary font-bold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300"
          >
            I HAVE TRANSFERRED (GO TO DASHBOARD)
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
