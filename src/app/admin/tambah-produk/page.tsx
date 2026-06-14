import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import FormTambahProdukClient from "./FormTambahProdukClient";

export default async function TambahProdukPage() {
  const session = await getSession();
  const userRole = session?.role;

  // 2. JIKA BUKAN ADMIN (atau belum login), TOLAK AKSES SECARA PAKSA & LEMPAR KE HOME
  if (userRole !== "ADMIN") {
    redirect("/");
  }

  // 3. Jika lolos verifikasi (dia adalah ADMIN), tampilkan Form Control Panel aslimu
  return <FormTambahProdukClient />;
}
