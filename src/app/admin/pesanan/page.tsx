import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAllOrders, cancelExpiredOrders } from "@/lib/admin";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata = { title: "Kelola Pesanan — EGOISM ADMIN" };

export default async function AdminPesananPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    redirect("/");
  }

  // Otomatis batalkan pesanan yang belum dibayar > 24 jam setiap kali admin buka halaman ini
  await cancelExpiredOrders();

  const initialOrders = await getAllOrders();

  return <AdminOrdersClient initialOrders={initialOrders} />;
}

