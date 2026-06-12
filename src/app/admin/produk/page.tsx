"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/products";
import { deleteProduct } from "@/lib/admin-products";
import { useToast } from "@/components/ui/Toast";

export default function AdminProdukPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then((data) => {
      const sorted = data.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
      setProducts(sorted);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingSlug(slug);
    const result = await deleteProduct(slug);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
    setDeletingSlug(null);
  };

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary tracking-widest text-[12px] uppercase">
        LOADING PRODUCTS...
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-[1440px]">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-4"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Kembali ke Dashboard
            </Link>
            <h1 className="text-[28px] md:text-[42px] font-bold uppercase tracking-wide">
              Kelola Produk
            </h1>
            <p className="text-[12px] text-secondary uppercase tracking-widest mt-1">
              {products.length} produk terdaftar
            </p>
          </div>
          <Link
            href="/admin/tambah-produk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            TAMBAH PRODUK
          </Link>
        </div>

        {/* Search */}
        <div className="bg-surface border border-outline-variant/30 p-4 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
              search
            </span>
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama, slug, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-outline-variant/50 pl-10 pr-4 py-3 text-[13px] text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-surface border border-outline-variant/30 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">Gambar</th>
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">Produk</th>
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">Kategori</th>
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">Harga</th>
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">Size</th>
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary">Terakhir Diedit</th>
                  <th className="p-4 font-semibold uppercase tracking-widest text-[10px] text-secondary text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <span className="material-symbols-outlined text-[48px] text-outline-variant/50 block mb-3">inventory_2</span>
                      <p className="text-secondary uppercase tracking-wider text-[12px] font-medium">
                        {searchQuery ? "Tidak ada produk yang cocok." : "Belum ada produk."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4">
                        <div className="w-16 h-16 bg-surface-container-low relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-primary text-[13px] uppercase">{product.name}</p>
                        <p className="text-[11px] text-secondary mt-0.5">/{product.slug}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-outline-variant/50 text-secondary">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-primary">{formatIDR(product.price)}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.sizes && typeof product.sizes === 'object' && !Array.isArray(product.sizes) ? (
                            Object.entries(product.sizes).map(([fit, sizes]: [string, any]) => (
                              <div key={fit} className="flex flex-col gap-1 w-full text-[10px]">
                                <span className="font-semibold text-secondary uppercase border-b border-outline-variant/30 pb-0.5">{fit}</span>
                                <div className="flex gap-1 flex-wrap">
                                  {Array.isArray(sizes) && sizes.map((s: string) => (
                                    <span key={`${fit}-${s}`} className="px-1.5 py-0.5 border border-outline-variant/30 text-secondary">{s}</span>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : product.sizes && Array.isArray(product.sizes) ? (
                            product.sizes.map((s: string) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 border border-outline-variant/30 text-secondary">{s}</span>
                            ))
                          ) : (
                            <span className="text-[10px] text-secondary">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-[10px] text-secondary uppercase tracking-widest">
                          {product.updatedAt 
                            ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(product.updatedAt)).replace('.', ':')
                            : "N/A"}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/produk/${product.slug}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest border border-outline-variant/30 text-secondary hover:border-primary hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.slug, product.name)}
                            disabled={deletingSlug === product.slug}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            {deletingSlug === product.slug ? "..." : "Hapus"}
                          </button>
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
  );
}
