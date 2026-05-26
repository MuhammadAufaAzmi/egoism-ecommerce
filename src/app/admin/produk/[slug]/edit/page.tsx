"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { updateProduct } from "@/lib/admin-products";
import { useToast } from "@/components/ui/Toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    category: "men",
    description: "",
    colors: "",
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const availableSizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

  useEffect(() => {
    getProductBySlug(slug).then((product) => {
      if (!product) {
        showToast("Produk tidak ditemukan.", "error");
        router.push("/admin/produk");
        return;
      }
      setFormData({
        name: product.name,
        slug: product.slug,
        price: String(product.price),
        category: product.category,
        description: product.description || "",
        colors: product.colors?.join(", ") || "",
      });
      setSelectedSizes(product.sizes || []);
      setCurrentImage(product.image);
      setCurrentGallery(product.images || []);
      setLoading(false);
    });
  }, [slug, router, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeCurrentGalleryImage = (index: number) => {
    setCurrentGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (selectedSizes.length === 0) {
      showToast("Pilih minimal satu ukuran produk!", "warning");
      setSaving(false);
      return;
    }

    try {
      let imagePath = currentImage;

      // Upload new image if selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadFormData });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          showToast(uploadData.message || "Gagal mengunggah foto.", "error");
          setSaving(false);
          return;
        }
        imagePath = uploadData.imagePath;
      }

      const savedGalleryPaths: string[] = [];
      for (const file of galleryFiles) {
        const galFormData = new FormData();
        galFormData.append("file", file);
        const galRes = await fetch("/api/upload", { method: "POST", body: galFormData });
        const galData = await galRes.json();
        if (galData.success) savedGalleryPaths.push(galData.imagePath);
      }

      const finalGallery = [...currentGallery, ...savedGalleryPaths];

      const cleanColorsArray = formData.colors
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c !== "");

      const result = await updateProduct(slug, {
        name: formData.name.trim(),
        slug: formData.slug.toLowerCase().replace(/\s+/g, "-").trim(),
        price: Number(formData.price),
        category: formData.category,
        image: imagePath,
        images: finalGallery,
        description: formData.description.trim(),
        sizes: [...selectedSizes],
        colors: cleanColorsArray.length > 0 ? cleanColorsArray : ["BLACK"],
      });

      if (result.success) {
        showToast(result.message, "success");
        router.push("/admin/produk");
        router.refresh();
      } else {
        showToast(result.message, "error");
      }
    } catch {
      showToast("Terjadi gangguan koneksi.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary tracking-widest text-[12px] uppercase">
        LOADING PRODUCT...
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-2xl bg-surface border border-outline-variant/30 p-8 md:p-12 shadow-md">
        <Link
          href="/admin/produk"
          className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Kembali ke Daftar Produk
        </Link>
        <div className="mb-10 border-b border-outline-variant/30 pb-4">
          <h1 className="text-[28px] md:text-[36px] font-bold uppercase tracking-wide">
            Edit Produk
          </h1>
          <p className="text-[12px] text-secondary uppercase tracking-widest mt-1">
            /{slug}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-[14px]">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Product Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold uppercase tracking-wider text-secondary text-[12px]">URL Slug</label>
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Price (IDR)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange}
                className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors appearance-none">
                <option value="men">MEN</option>
                <option value="women">WOMEN</option>
                <option value="unisex">UNISEX</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Colors (comma separated)</label>
            <input type="text" name="colors" value={formData.colors} onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. BLACK, WHITE, DARK ASH" />
          </div>

          {/* Image */}
          <div className="flex flex-col space-y-2">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Product Image</span>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-background border border-dashed border-outline-variant/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors min-h-[160px]"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="sr-only" />
              {imagePreview || currentImage ? (
                <div className="flex flex-col items-center space-y-3 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview || currentImage} alt="Preview" className="h-32 object-contain border border-outline-variant/30" />
                  <p className="text-[11px] text-secondary uppercase tracking-widest">
                    {imagePreview ? "Gambar baru dipilih — klik untuk ganti" : "Gambar saat ini — klik untuk ganti"}
                  </p>
                </div>
              ) : (
                <p className="text-[13px] text-primary/70 font-medium">KLIK UNTUK UPLOAD GAMBAR</p>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="flex flex-col space-y-2 mt-4">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Product Gallery Images (Multiple)</span>
            <div
              onClick={() => galleryInputRef.current?.click()}
              className="w-full bg-background border border-dashed border-outline-variant/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors min-h-[120px]"
            >
              <input type="file" multiple ref={galleryInputRef} onChange={handleGalleryChange} accept="image/*" className="sr-only" />
              <div className="text-center">
                <p className="text-[13px] text-primary/70 font-medium">KLIK UNTUK TAMBAH GAMBAR GALERI</p>
                <p className="text-[11px] text-secondary uppercase tracking-widest mt-1">Upload multiple photos for product gallery</p>
              </div>
            </div>
            
            {(currentGallery.length > 0 || galleryPreviews.length > 0) && (
              <div className="flex flex-wrap gap-4 mt-4">
                {currentGallery.map((preview, idx) => (
                  <div key={`cur-${idx}`} className="relative w-24 h-32 border border-outline-variant/30">
                    <img src={preview} alt={`Current Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeCurrentGalleryImage(idx); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-md">
                      X
                    </button>
                  </div>
                ))}
                {galleryPreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative w-24 h-32 border border-outline-variant/30">
                    <img src={preview} alt={`New Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-md">
                      X
                    </button>
                    <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1">BARU</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="flex flex-col space-y-2">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Available Sizes</span>
            <div className="flex flex-wrap gap-4 pt-2">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center border px-5 py-2 cursor-pointer transition-colors text-[13px] font-medium tracking-wide ${selectedSizes.includes(size) ? "bg-primary text-on-primary border-primary" : "bg-background text-primary border-outline-variant/50 hover:border-primary"}`}
                >
                  <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)} className="sr-only" />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="font-semibold uppercase tracking-wider text-secondary text-[12px]">Description</label>
            <textarea name="description" required rows={5} value={formData.description} onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors resize-none" />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-on-primary font-semibold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300 disabled:opacity-50"
            >
              {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
            <Link
              href="/admin/produk"
              className="px-8 py-4 border border-outline-variant/50 text-secondary font-semibold uppercase tracking-[0.15em] hover:border-primary hover:text-primary transition-colors text-center"
            >
              BATAL
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
