"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/products";

export default function FormTambahProdukClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    category: "men",
    description: "",
    colors: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (selectedSizes.length === 0) {
      setMessage({ type: "error", text: "Pilih minimal satu ukuran produk!" });
      setLoading(false);
      return;
    }

    if (!imageFile) {
      setMessage({
        type: "error",
        text: "Silakan unggah foto pakaian terlebih dahulu!",
      });
      setLoading(false);
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        setMessage({
          type: "error",
          text: uploadData.message || "Gagal mengunggah foto.",
        });
        setLoading(false);
        return;
      }

      const savedImagePath = uploadData.imagePath;

      const cleanColorsArray = formData.colors
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c !== "");

      const cleanPayload = {
        name: String(formData.name).trim(),
        slug: String(formData.slug).toLowerCase().replace(/\s+/g, "-").trim(),
        price: Number(formData.price),
        category: String(formData.category),
        image: savedImagePath,
        description: String(formData.description).trim(),
        sizes: [...selectedSizes],
        colors: cleanColorsArray.length > 0 ? cleanColorsArray : ["BLACK"],
        isNew: true,
      };

      const result = await createProduct(cleanPayload);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setFormData({
          name: "",
          slug: "",
          price: "",
          category: "men",
          description: "",
          colors: "",
        });
        setSelectedSizes([]);
        setImageFile(null);
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Terjadi gangguan koneksi sistem upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[120px] pb-24 min-h-screen bg-background text-primary px-5 md:px-16 flex justify-center">
      <div className="w-full max-w-2xl bg-surface border border-outline-variant/30 p-8 md:p-12 shadow-md">
        <div className="mb-10 border-b border-outline-variant/30 pb-4">
          <h1 className="font-['Playfair_Display'] text-[28px] md:text-[36px] font-bold uppercase tracking-wide">
            Control Panel
          </h1>
          <p className="font-['Inter'] text-[12px] text-secondary uppercase tracking-widest mt-1">
            Add New Garment to Database (Color Control Integrated)
          </p>
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 text-[14px] font-['Inter'] font-medium uppercase tracking-wider border ${
              message.type === "success"
                ? "bg-green-950/20 border-green-500/50 text-green-400"
                : "bg-red-950/20 border-red-500/50 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 font-['Inter'] text-[14px]"
        >
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="prod-name"
              className="font-semibold uppercase tracking-wider text-secondary text-[12px]"
            >
              Product Name
            </label>
            <input
              id="prod-name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. VOID TEE"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="prod-slug"
              className="font-semibold uppercase tracking-wider text-secondary text-[12px]"
            >
              Url Slug (Unique)
            </label>
            <input
              id="prod-slug"
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. void-tee"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="prod-price"
                className="font-semibold uppercase tracking-wider text-secondary text-[12px]"
              >
                Price (IDR)
              </label>
              <input
                id="prod-price"
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="349000"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="prod-category"
                className="font-semibold uppercase tracking-wider text-secondary text-[12px]"
              >
                Category
              </label>
              <select
                id="prod-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="men">MEN</option>
                <option value="women">WOMEN</option>
                <option value="unisex">UNISEX</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="prod-colors"
              className="font-semibold uppercase tracking-wider text-secondary text-[12px]"
            >
              Available Colors (Separate with comma)
            </label>
            <input
              id="prod-colors"
              type="text"
              name="colors"
              required
              value={formData.colors}
              onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. BLACK, WHITE, DARK ASH"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">
              Product Garment Image
            </span>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-background border border-dashed border-outline-variant/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors min-h-[160px]"
            >
              <input
                id="file-upload-input"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="sr-only"
                title="Upload Product Image"
              />

              {imagePreview ? (
                <div className="flex flex-col items-center space-y-3 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Garment Preview"
                    className="h-32 object-contain border border-outline-variant/30"
                  />
                  <p className="text-[11px] text-secondary uppercase tracking-widest">
                    Click area to change file
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[13px] text-primary/70 font-medium">
                    CLICK TO UPLOAD GARMENT IMAGE
                  </p>
                  <p className="text-[11px] text-secondary uppercase tracking-widest mt-1">
                    Supports PNG, JPG, WEBP format
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">
              Available Sizes
            </span>
            <div className="flex flex-wrap gap-4 pt-2">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center border px-5 py-2 cursor-pointer transition-colors text-[13px] font-medium tracking-wide ${selectedSizes.includes(size) ? "bg-primary text-on-primary border-primary" : "bg-background text-primary border-outline-variant/50 hover:border-primary"}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="sr-only"
                    title={`Size ${size}`}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="prod-desc"
              className="font-semibold uppercase tracking-wider text-secondary text-[12px]"
            >
              Product Description
            </label>
            <textarea
              id="prod-desc"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-background border border-outline-variant/50 p-3 text-primary focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Write specifications or structural garment description..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-semibold uppercase tracking-[0.15em] py-4 border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "SAVING IMAGES & DATA..." : "PUBLISH GARMENT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
