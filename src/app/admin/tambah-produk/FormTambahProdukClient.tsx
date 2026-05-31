"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/products";

export default function FormTambahProdukClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    category: "men",
    description: "",
    colors: "",
  });

  const [selectedFitTypes, setSelectedFitTypes] = useState<string[]>(["regular"]);

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const availableActivities = ["hyrox", "crossfit", "running", "powerlifting", "pilates", "yoga", "gym"];
  const availableFitTypes = [
    { value: "regular", label: "Regular" },
    { value: "oversized", label: "Oversized" },
    { value: "long-sleeve", label: "Long sleeve" },
    { value: "muscle-tank", label: "Muscle tank" },
    { value: "crop-tank", label: "Crop tank" },
    { value: "crop", label: "Crop regular fit" },
    { value: "crop-oversize", label: "Crop Oversize" },
  ];

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string[]>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const availableSizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (fit: string, size: string) => {
    setSelectedSizes((prev) => {
      const current = prev[fit] || [];
      const updated = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];
      return { ...prev, [fit]: updated };
    });
  };

  const handleFitTypeChange = (fit: string) => {
    setSelectedFitTypes((prev) => {
      const isRemoving = prev.includes(fit);
      if (isRemoving) {
        setSelectedSizes((prevSizes) => {
          const newSizes = { ...prevSizes };
          delete newSizes[fit];
          return newSizes;
        });
        return prev.filter((f) => f !== fit);
      }
      return [...prev, fit];
    });
  };

  const handleActivityChange = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const hasSizes = Object.values(selectedSizes).some((sizes) => sizes.length > 0);
    if (!hasSizes) {
      setMessage({ type: "error", text: "Pilih minimal satu ukuran produk untuk Fit Type yang dipilih!" });
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

      const savedGalleryPaths: string[] = [];
      for (const file of galleryFiles) {
        const galFormData = new FormData();
        galFormData.append("file", file);
        const galRes = await fetch("/api/upload", { method: "POST", body: galFormData });
        const galData = await galRes.json();
        if (galData.success) savedGalleryPaths.push(galData.imagePath);
      }

      const cleanColorsArray = formData.colors
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c !== "");

      const cleanPayload = {
        name: String(formData.name).trim(),
        slug: String(formData.slug).toLowerCase().replace(/\s+/g, "-").trim(),
        price: Number(formData.price),
        category: String(formData.category),
        fitType: selectedFitTypes.length > 0 ? selectedFitTypes : ["regular"],
        activity: [...selectedActivities],
        image: savedImagePath,
        images: savedGalleryPaths,
        description: String(formData.description).trim(),
        sizes: selectedSizes,
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
        setSelectedFitTypes(["regular"]);
        setSelectedActivities([]);
        setSelectedSizes({});
        setImageFile(null);
        setImagePreview("");
        setGalleryFiles([]);
        setGalleryPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (galleryInputRef.current) galleryInputRef.current.value = "";
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
          <h1 className="text-[28px] md:text-[36px] font-bold uppercase tracking-wide">
            Control Panel
          </h1>
          <p className="text-[12px] text-secondary uppercase tracking-widest mt-1">
            Add New Garment to Database (Color Control Integrated)
          </p>
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 text-[14px] font-medium uppercase tracking-wider border ${
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
          className="space-y-6 text-[14px]"
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

          {/* Fit Type */}
          <div className="flex flex-col space-y-2">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">
              Fit Type / Model
            </span>
            <div className="flex flex-wrap gap-4 pt-2">
              {availableFitTypes.map((fit) => (
                <label
                  key={fit.value}
                  className={`flex items-center justify-center border px-5 py-2 cursor-pointer transition-colors text-[13px] font-medium tracking-wide ${selectedFitTypes.includes(fit.value) ? "bg-primary text-on-primary border-primary" : "bg-background text-primary border-outline-variant/50 hover:border-primary"}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFitTypes.includes(fit.value)}
                    onChange={() => handleFitTypeChange(fit.value)}
                    className="sr-only"
                    title={`Fit Type ${fit.label}`}
                  />
                  {fit.label}
                </label>
              ))}
            </div>
          </div>

          {/* Activity Tags */}
          <div className="flex flex-col space-y-2">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">
              Activity Tags
            </span>
            <p className="text-[11px] text-secondary tracking-wider">Pilih aktivitas yang sesuai dengan produk ini</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {availableActivities.map((activity) => (
                <label
                  key={activity}
                  className={`flex items-center justify-center border px-4 py-2 cursor-pointer transition-colors text-[12px] font-medium tracking-wide uppercase ${selectedActivities.includes(activity) ? "bg-primary text-on-primary border-primary" : "bg-background text-primary border-outline-variant/50 hover:border-primary"}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity)}
                    onChange={() => handleActivityChange(activity)}
                    className="sr-only"
                    title={`Activity ${activity}`}
                  />
                  {activity}
                </label>
              ))}
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
                <div className="flex flex-col items-center space-y-3 w-full relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Garment Preview"
                    className="h-32 object-contain border border-outline-variant/30"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-4 right-1/2 translate-x-[4rem] bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-[14px] shadow-md hover:bg-red-600 transition-colors"
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                  <p className="text-[11px] text-secondary uppercase tracking-widest mt-2">
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

          <div className="flex flex-col space-y-2 mt-4">
            <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">
              Product Gallery Images (Multiple)
            </span>
            <div
              onClick={() => galleryInputRef.current?.click()}
              className="w-full bg-background border border-dashed border-outline-variant/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors min-h-[120px]"
            >
              <input
                id="gallery-upload-input"
                type="file"
                multiple
                ref={galleryInputRef}
                onChange={handleGalleryChange}
                accept="image/*"
                className="sr-only"
                title="Upload Gallery Images"
              />
              <div className="text-center">
                <p className="text-[13px] text-primary/70 font-medium">
                  CLICK TO ADD GALLERY IMAGES
                </p>
                <p className="text-[11px] text-secondary uppercase tracking-widest mt-1">
                  Upload multiple photos for product gallery
                </p>
              </div>
            </div>
            
            {galleryPreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {galleryPreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-24 h-32 border border-outline-variant/30">
                    <img src={preview} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-md"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes per Fit Type */}
          {selectedFitTypes.length > 0 && (
            <div className="flex flex-col space-y-4">
              <span className="font-semibold uppercase tracking-wider text-secondary text-[12px]">
                Available Sizes
              </span>
              {selectedFitTypes.map((fit) => {
                const fitLabel = availableFitTypes.find(f => f.value === fit)?.label || fit;
                return (
                  <div key={fit} className="flex flex-col space-y-2 border border-outline-variant/30 p-4">
                    <span className="text-[11px] font-semibold text-primary uppercase">{fitLabel} Sizes</span>
                    <div className="flex flex-wrap gap-4 pt-2">
                      {availableSizes.map((size) => {
                        const isSelected = selectedSizes[fit]?.includes(size) || false;
                        return (
                          <label
                            key={`${fit}-${size}`}
                            className={`flex items-center justify-center border px-5 py-2 cursor-pointer transition-colors text-[13px] font-medium tracking-wide ${isSelected ? "bg-primary text-on-primary border-primary" : "bg-background text-primary border-outline-variant/50 hover:border-primary"}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSizeChange(fit, size)}
                              className="sr-only"
                              title={`Size ${size} for ${fitLabel}`}
                            />
                            {size}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
