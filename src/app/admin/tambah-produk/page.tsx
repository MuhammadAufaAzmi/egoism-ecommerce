import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormTambahProdukClient from "./FormTambahProdukClient";

export default async function TambahProdukPage() {
  // 1. Ambil data role dari cookies browser secara aman di sisi server
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  // 2. JIKA BUKAN ADMIN (atau belum login), TOLAK AKSES SECARA PAKSA & LEMPAR KE HOME
  if (userRole !== "ADMIN") {
    redirect("/");
  }

  // 3. Jika lolos verifikasi (dia adalah ADMIN), tampilkan Form Control Panel aslimu
  return <FormTambahProdukClient />;
}
