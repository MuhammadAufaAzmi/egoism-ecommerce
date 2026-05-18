"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/lib/admin";
import { useRouter } from "next/navigation";

interface AdminOrdersClientProps {
  initialOrders: any[];
}

export default function AdminOrdersClient({
  initialOrders,
}: AdminOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      // Perbarui UI secara langsung tanpa refresh
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } else {
      alert("Gagal merubah status pesanan.");
    }
    setLoadingId(null);
    router.refresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return "text-green-400 bg-green-950/30 border-green-500/50";
      case "DIKIRIM":
        return "text-blue-400 bg-blue-950/30 border-blue-500/50";
      case "DIPROSES":
        return "text-amber-400 bg-amber-950/30 border-amber-500/50";
      case "DIBATALKAN":
        return "text-red-400 bg-red-950/30 border-red-500/50";
      default:
        return "text-secondary border-outline-variant";
    }
  };

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-[1440px] bg-surface border border-outline-variant/30 p-8 md:p-12 shadow-md">
        <div className="mb-10 border-b border-outline-variant/30 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-['Playfair_Display'] text-[28px] md:text-[36px] font-bold uppercase tracking-wide">
              Order Management
            </h1>
            <p className="font-['Inter'] text-[12px] text-secondary uppercase tracking-widest mt-1">
              Control Panel & Fulfillment Center
            </p>
          </div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-primary border border-outline-variant/50 px-4 py-2">
            TOTAL ORDERS: {orders.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-['Inter'] text-[13px] border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/50 uppercase tracking-widest text-[11px] text-secondary">
                <th className="p-4 font-semibold">Order ID & Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Garments</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold text-right">
                  Fulfillment Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-secondary uppercase tracking-wider"
                  >
                    NO ACTIVE ORDERS IN DATABASE.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-primary">
                        {order.orderNumber}
                      </p>
                      <p className="text-[11px] text-secondary mt-1">
                        {order.date}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-primary uppercase">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-secondary mt-1">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td
                      className="p-4 max-w-[250px] truncate text-secondary"
                      title={order.items}
                    >
                      {order.items || "-"}
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      {order.total}
                    </td>
                    <td className="p-4 text-right">
                      {loadingId === order.id ? (
                        <span className="text-[11px] tracking-widest text-secondary animate-pulse uppercase">
                          UPDATING...
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          aria-label={`Ubah status pengiriman untuk pesanan ${order.orderNumber}`}
                          className={`border px-3 py-2 text-[11px] font-bold tracking-widest uppercase cursor-pointer outline-none appearance-none text-center ${getStatusColor(order.status)}`}
                        >
                          <option
                            value="DIPROSES"
                            className="bg-surface text-primary"
                          >
                            DIPROSES
                          </option>
                          <option
                            value="DIKIRIM"
                            className="bg-surface text-primary"
                          >
                            DIKIRIM
                          </option>
                          <option
                            value="DITERIMA"
                            className="bg-surface text-primary"
                          >
                            DITERIMA
                          </option>
                          <option
                            value="DIBATALKAN"
                            className="bg-surface text-primary"
                          >
                            DIBATALKAN
                          </option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
