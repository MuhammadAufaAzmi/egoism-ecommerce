import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/admin";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata = { title: "Order Management — EGOISM ADMIN" };

export default async function AdminPesananPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    redirect("/");
  }

  // Tarik data mentah pesanan dari database
  const initialOrders = await getAllOrders();

  return <AdminOrdersClient initialOrders={initialOrders} />;
}
