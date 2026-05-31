"use client";

import React, { useState, useMemo } from "react";
import { updateOrderStatus, deleteOrder, deleteAllOrders } from "@/lib/admin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: string;
  total: string;
  totalRaw: number;
  status: string;
  paymentProof: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  trackingNumber?: string;
}

interface AdminOrdersClientProps {
  initialOrders: Order[];
}

const STATUS_OPTIONS = [
  "MENUNGGU PEMBAYARAN",
  "MENUNGGU KONFIRMASI",
  "DIPROSES",
  "DIKIRIM",
  "DITERIMA",
  "DIBATALKAN",
];

const STATUS_FILTER_OPTIONS = ["SEMUA", ...STATUS_OPTIONS];

export default function AdminOrdersClient({
  initialOrders,
}: AdminOrdersClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  const [proofModal, setProofModal] = useState<{
    open: boolean;
    src: string;
    orderNumber: string;
  }>({ open: false, src: "", orderNumber: "" });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });
  const [trackingInput, setTrackingInput] = useState("");

  // Filter & search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        selectedFilter === "SEMUA" || order.status === selectedFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.items.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const menungguBayar = orders.filter(
      (o) => o.status === "MENUNGGU PEMBAYARAN"
    ).length;
    const menungguKonfirmasi = orders.filter(
      (o) => o.status === "MENUNGGU KONFIRMASI"
    ).length;
    const diproses = orders.filter((o) => o.status === "DIPROSES").length;
    const dikirim = orders.filter((o) => o.status === "DIKIRIM").length;
    const selesai = orders.filter((o) => o.status === "DITERIMA").length;
    const batal = orders.filter((o) => o.status === "DIBATALKAN").length;
    return { menungguBayar, menungguKonfirmasi, diproses, dikirim, selesai, batal };
  }, [orders]);

  const handleStatusChange = async (orderId: string, newStatus: string, tracking?: string) => {
    setLoadingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus, tracking);

    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, trackingNumber: tracking || o.trackingNumber } : o))
      );
      showToast("Status pesanan berhasil diubah.", "success");
    } else {
      showToast("Gagal merubah status pesanan.", "error");
    }
    setLoadingId(null);
    router.refresh();
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pesanan ${orderNumber} secara permanen? Data dan bukti transfer akan ikut terhapus.`)) return;

    setIsDeletingId(orderId);
    const result = await deleteOrder(orderId);

    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast("Pesanan berhasil dihapus.", "success");
      router.refresh();
    } else {
      showToast(result.message || "Gagal menghapus pesanan.", "error");
    }
    setIsDeletingId(null);
  };

  const handleDeleteAll = async () => {
    if (orders.length === 0) {
      showToast("Tidak ada pesanan untuk dihapus.", "error");
      return;
    }
    
    const confirmText = window.prompt('PERINGATAN BAHAYA!\n\nTindakan ini akan menghapus SELURUH pesanan secara permanen beserta bukti transfernya.\n\nKetik "HAPUS SEMUA" untuk melanjutkan:');
    if (confirmText !== "HAPUS SEMUA") {
      if (confirmText !== null) showToast("Dibatalkan: Konfirmasi tidak cocok.", "error");
      return;
    }

    setIsDeletingAll(true);
    const result = await deleteAllOrders();

    if (result.success) {
      setOrders([]);
      showToast(result.message, "success");
      router.refresh();
    } else {
      showToast(result.message || "Gagal menghapus semua pesanan.", "error");
    }
    setIsDeletingAll(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "DIKIRIM":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "DIPROSES":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "MENUNGGU KONFIRMASI":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "MENUNGGU PEMBAYARAN":
        return "text-gray-600 bg-gray-100 border-gray-300";
      case "DIBATALKAN":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-secondary border-outline-variant";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return "bg-emerald-500";
      case "DIKIRIM":
        return "bg-blue-500";
      case "DIPROSES":
        return "bg-amber-500";
      case "MENUNGGU KONFIRMASI":
        return "bg-orange-500 animate-pulse";
      case "MENUNGGU PEMBAYARAN":
        return "bg-gray-400";
      case "DIBATALKAN":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return "check_circle";
      case "DIKIRIM":
        return "local_shipping";
      case "DIPROSES":
        return "hourglass_top";
      case "MENUNGGU KONFIRMASI":
        return "schedule";
      case "MENUNGGU PEMBAYARAN":
        return "payments";
      case "DIBATALKAN":
        return "cancel";
      default:
        return "help";
    }
  };

  return (
    <>
      <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
        <div className="w-full max-w-[1440px]">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-4"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Kembali ke Dashboard
              </Link>
              <h1 className="text-[28px] md:text-[42px] font-bold uppercase tracking-wide">
                Kelola Pesanan
              </h1>
              <p className="text-[12px] text-secondary uppercase tracking-widest mt-1">
                Order Management & Fulfillment Center
              </p>
            </div>

            {orders.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={isDeletingAll}
                className={`inline-flex items-center gap-2 px-5 py-2.5 border border-red-500 text-red-500 text-[11px] font-bold uppercase tracking-widest transition-colors mb-2 sm:mb-0 ${
                  isDeletingAll ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500 hover:text-white"
                }`}
                title="Hapus Semua Pesanan (Sapu Bersih)"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isDeletingAll ? "hourglass_empty" : "delete_sweep"}
                </span>
                {isDeletingAll ? "MEMPROSES..." : "SAPU BERSIH"}
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              {
                label: "Menunggu Bayar",
                value: stats.menungguBayar,
                icon: "payments",
                color: "text-gray-600",
                bg: "bg-gray-50",
                border: "border-gray-200",
              },
              {
                label: "Perlu Konfirmasi",
                value: stats.menungguKonfirmasi,
                icon: "schedule",
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-200",
              },
              {
                label: "Diproses",
                value: stats.diproses,
                icon: "hourglass_top",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
              },
              {
                label: "Dikirim",
                value: stats.dikirim,
                icon: "local_shipping",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
              },
              {
                label: "Selesai",
                value: stats.selesai,
                icon: "check_circle",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
              },
              {
                label: "Dibatalkan",
                value: stats.batal,
                icon: "cancel",
                color: "text-red-600",
                bg: "bg-red-50",
                border: "border-red-200",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} border ${stat.border} p-4 transition-all duration-200 hover:shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`material-symbols-outlined text-[18px] ${stat.color}`}
                  >
                    {stat.icon}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-widest ${stat.color} font-semibold`}
                  >
                    {stat.label}
                  </span>
                </div>
                <p
                  className={`text-[28px] font-bold ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-surface border border-outline-variant/30 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari order ID, nama pelanggan, email, atau item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-outline-variant/50 pl-10 pr-4 py-3 text-[13px] text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Filter Status */}
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTER_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedFilter(status)}
                    className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest border transition-all duration-200 ${
                      selectedFilter === status
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-background text-secondary border-outline-variant/50 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-secondary uppercase tracking-widest">
                Menampilkan {filteredOrders.length} dari {orders.length} pesanan
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-surface border border-outline-variant/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse min-w-[1100px]">
                <thead>
                  <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">
                      Order ID
                    </th>
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">
                      Pelanggan
                    </th>
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">
                      Item Pesanan
                    </th>
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">
                      Total
                    </th>
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">
                      Bukti Bayar
                    </th>
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">
                      Status
                    </th>
                    <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-16 text-center"
                      >
                        <span className="material-symbols-outlined text-[48px] text-outline-variant/50 block mb-3">
                          inbox
                        </span>
                        <p className="text-secondary uppercase tracking-wider text-[12px] font-medium">
                          {searchQuery || selectedFilter !== "SEMUA"
                            ? "Tidak ada pesanan yang cocok dengan filter."
                            : "Belum ada pesanan masuk."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-surface-container-low/50 transition-colors ${
                          order.status === "MENUNGGU KONFIRMASI"
                            ? "bg-orange-50/30"
                            : ""
                        }`}
                      >
                        {/* Order ID & Date */}
                        <td className="p-4">
                          <p className="font-semibold text-primary text-[13px] tracking-wide">
                            {order.orderNumber}
                          </p>
                          <p className="text-[11px] text-secondary mt-1">
                            {order.date}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <p className="font-semibold text-primary text-[13px]">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-secondary mt-0.5">
                            {order.customerEmail}
                          </p>
                          <p className="text-[11px] text-secondary">
                            {order.customerPhone}
                          </p>
                        </td>

                        {/* Items & Tracking */}
                        <td className="p-4 max-w-[220px]">
                          <p
                            className="text-[12px] text-secondary whitespace-pre-line line-clamp-3 cursor-pointer hover:text-primary transition-colors"
                            title={order.items}
                            onClick={() => {
                              setDetailModal({ open: true, order });
                              setTrackingInput(order.trackingNumber || "");
                            }}
                          >
                            {order.items || "-"}
                          </p>
                          {order.trackingNumber && (
                            <p className="mt-2 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 inline-block border border-blue-200">
                              Resi: {order.trackingNumber}
                            </p>
                          )}
                        </td>

                        {/* Total */}
                        <td className="p-4">
                          <p className="font-bold text-primary text-[14px]">
                            {order.total}
                          </p>
                        </td>

                        {/* Payment Proof */}
                        <td className="p-4">
                          {order.paymentProof ? (
                            <button
                              onClick={() =>
                                setProofModal({
                                  open: true,
                                  src: order.paymentProof!,
                                  orderNumber: order.orderNumber,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                receipt_long
                              </span>
                              Lihat Bukti
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest border border-gray-200 bg-gray-50 text-gray-400">
                              <span className="material-symbols-outlined text-[14px]">
                                image_not_supported
                              </span>
                              Belum Ada
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${getStatusDot(
                                order.status
                              )}`}
                            />
                            {order.status}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Detail button */}
                            <button
                              onClick={() => {
                                setDetailModal({ open: true, order });
                                setTrackingInput(order.trackingNumber || "");
                              }}
                              className="p-2 border border-outline-variant/30 hover:border-primary text-secondary hover:text-primary transition-colors"
                              title="Lihat Detail"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                visibility
                              </span>
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                              disabled={isDeletingId === order.id}
                              className={`p-2 border border-outline-variant/30 transition-colors ${
                                isDeletingId === order.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:border-red-500 text-secondary hover:text-red-500"
                              }`}
                              title="Hapus Pesanan"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {isDeletingId === order.id ? "hourglass_empty" : "delete"}
                              </span>
                            </button>

                            {/* Status select */}
                            {loadingId === order.id ? (
                              <span className="text-[11px] tracking-widest text-secondary animate-pulse uppercase px-3 py-2">
                                UPDATING...
                              </span>
                            ) : (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
                                aria-label={`Ubah status pesanan ${order.orderNumber}`}
                                className={`border px-3 py-2 text-[10px] font-bold tracking-widest uppercase cursor-pointer outline-none appearance-none text-center min-w-[160px] ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option
                                    key={s}
                                    value={s}
                                    className="bg-surface text-primary"
                                  >
                                    {s}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {proofModal.open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setProofModal({ open: false, src: "", orderNumber: "" })}
        >
          <div
            className="bg-surface border border-outline-variant/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
              <div>
                <h3 className="text-[20px] font-bold uppercase tracking-wide">
                  Bukti Pembayaran
                </h3>
                <p className="text-[11px] text-secondary uppercase tracking-widest mt-1">
                  {proofModal.orderNumber}
                </p>
              </div>
              <button
                onClick={() =>
                  setProofModal({ open: false, src: "", orderNumber: "" })
                }
                className="p-2 border border-outline-variant/30 hover:border-primary text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofModal.src}
                alt={`Bukti pembayaran ${proofModal.orderNumber}`}
                className="w-full h-auto border border-outline-variant/30"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-outline-variant/30 flex justify-end gap-3">
              <a
                href={proofModal.src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest border border-outline-variant/50 text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  open_in_new
                </span>
                Buka di Tab Baru
              </a>
              <button
                onClick={() =>
                  setProofModal({ open: false, src: "", orderNumber: "" })
                }
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-widest bg-primary text-on-primary border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Order Modal */}
      {detailModal.open && detailModal.order && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDetailModal({ open: false, order: null })}
        >
          <div
            className="bg-surface border border-outline-variant/30 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
              <div>
                <h3 className="text-[20px] font-bold uppercase tracking-wide">
                  Detail Pesanan
                </h3>
                <p className="text-[11px] text-secondary uppercase tracking-widest mt-1">
                  {detailModal.order.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setDetailModal({ open: false, order: null })}
                className="p-2 border border-outline-variant/30 hover:border-primary text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 ">
              {/* Status */}
              <div className="flex items-center gap-3 p-4 border border-outline-variant/20 bg-surface-container-low/50">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    getStatusColor(detailModal.order.status).split(" ")[0]
                  }`}
                >
                  {getStatusIcon(detailModal.order.status)}
                </span>
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest">
                    Status
                  </p>
                  <p
                    className={`text-[14px] font-bold uppercase tracking-wider ${
                      getStatusColor(detailModal.order.status).split(" ")[0]
                    }`}
                  >
                    {detailModal.order.status}
                  </p>
                </div>
              </div>

              {/* Customer info */}
              <div>
                <p className="text-[10px] text-secondary uppercase tracking-widest mb-2 font-semibold">
                  Pelanggan
                </p>
                <div className="border border-outline-variant/20 p-4 space-y-1.5">
                  <p className="text-[14px] font-semibold">
                    {detailModal.order.customerName}
                  </p>
                  <p className="text-[12px] text-secondary">
                    {detailModal.order.customerEmail}
                  </p>
                  <p className="text-[12px] text-secondary">
                    {detailModal.order.customerPhone}
                  </p>
                </div>
              </div>

              {/* Order info */}
              <div>
                <p className="text-[10px] text-secondary uppercase tracking-widest mb-2 font-semibold">
                  Detail Pesanan
                </p>
                <div className="border border-outline-variant/20 p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[12px] text-secondary">Tanggal</span>
                    <span className="text-[12px] font-medium">
                      {detailModal.order.date}
                    </span>
                  </div>
                  <div className="border-t border-outline-variant/20 pt-3">
                    <span className="text-[12px] text-secondary block mb-2">
                      Item Pesanan
                    </span>
                    <pre className="text-[12px] font-medium whitespace-pre-wrap bg-background p-3 border border-outline-variant/20">
                      {detailModal.order.items}
                    </pre>
                  </div>
                  <div className="flex justify-between border-t border-outline-variant/20 pt-3">
                    <span className="text-[14px] font-bold uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-[14px] font-bold">
                      {detailModal.order.total}
                    </span>
                  </div>
                  {(detailModal.order.status === "DIPROSES" || detailModal.order.status === "DIKIRIM" || detailModal.order.status === "DITERIMA") && (
                    <div className="border-t border-outline-variant/20 pt-3 mt-3">
                      <label className="text-[10px] text-secondary uppercase tracking-widest mb-1 block font-semibold">
                        Nomor Resi Pengiriman
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Contoh: JNT123456789"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          className="flex-1 border border-outline-variant/50 px-3 py-2 text-[12px] bg-background focus:outline-none focus:border-primary text-primary"
                        />
                        {(detailModal.order.status === "DIKIRIM" || detailModal.order.status === "DITERIMA") && (
                          <button
                            onClick={() => handleStatusChange(detailModal.order!.id, detailModal.order!.status, trackingInput)}
                            className="bg-primary text-on-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
                          >
                            Update Resi
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment proof in detail */}
              {detailModal.order.paymentProof && (
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest mb-2 font-semibold">
                    Bukti Pembayaran
                  </p>
                  <div className="border border-outline-variant/20 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={detailModal.order.paymentProof}
                      alt="Bukti Pembayaran"
                      className="w-full max-h-[300px] object-contain border border-outline-variant/20 cursor-pointer"
                      onClick={() => {
                        setDetailModal({ open: false, order: null });
                        setProofModal({
                          open: true,
                          src: detailModal.order!.paymentProof!,
                          orderNumber: detailModal.order!.orderNumber,
                        });
                      }}
                    />
                    <p className="text-[10px] text-secondary text-center mt-2 uppercase tracking-widest">
                      Klik untuk memperbesar
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Quick Actions */}
            <div className="p-6 border-t border-outline-variant/30 flex flex-wrap gap-2">
              {detailModal.order.status === "MENUNGGU KONFIRMASI" && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(detailModal.order!.id, "DIPROSES");
                      setDetailModal({ open: false, order: null });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Konfirmasi & Proses
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(detailModal.order!.id, "DIBATALKAN");
                      setDetailModal({ open: false, order: null });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      cancel
                    </span>
                    Tolak
                  </button>
                </>
              )}
              {detailModal.order.status === "DIPROSES" && (
                <button
                  onClick={() => {
                    handleStatusChange(detailModal.order!.id, "DIKIRIM", trackingInput);
                    setDetailModal({ open: false, order: null });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    local_shipping
                  </span>
                  Tandai Dikirim
                </button>
              )}
              <button
                onClick={() => setDetailModal({ open: false, order: null })}
                className="flex-1 min-w-[120px] px-4 py-3 text-[11px] font-semibold uppercase tracking-widest bg-primary text-on-primary border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline animation style */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
