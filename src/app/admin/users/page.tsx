import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Kelola User — Admin EGOISM" };

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("user_role")?.value !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true, wishlists: true } },
    },
  });

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-10 border-b border-outline-variant/30 pb-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-[11px] uppercase tracking-widest text-secondary hover:text-primary mb-2 block">
              ← Admin Dashboard
            </Link>
            <h1 className="text-[32px] md:text-[40px] font-bold uppercase tracking-wide">
              Kelola Pelanggan
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[32px] font-bold">{users.length}</p>
            <p className="text-[11px] uppercase tracking-widest text-secondary">Total User</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="border border-outline-variant/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface">
                <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Nama</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold hidden lg:table-cell">No. HP</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold">Pesanan</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-secondary px-6 py-3 font-semibold hidden md:table-cell">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-secondary text-[13px] uppercase tracking-widest">
                    Belum ada pelanggan terdaftar.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-primary">
                        {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-[13px] text-secondary">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-[13px] text-secondary">{user.phone || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-semibold text-primary">{user._count.orders}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-[12px] text-secondary">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
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
