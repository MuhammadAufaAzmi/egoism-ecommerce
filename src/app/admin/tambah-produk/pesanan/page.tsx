import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/admin";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata = { title: "Order Management — EGOISM ADMIN" };

export default async function AdminPesananPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("user_role")?.value !== "ADMIN") {
    redirect("/");
  }

  // Tarik data mentah pesanan dari database
  const initialOrders = await getAllOrders();

  return <AdminOrdersClient initialOrders={initialOrders} />;
}
