"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { handleRemoveCartItem, handleUpdateCartQuantity } from "@/lib/products";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface SlideOverCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideOverCart({ isOpen, onClose }: SlideOverCartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (e) {
      console.error("Failed to fetch cart", e);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await handleRemoveCartItem(id);
    toast.success("Item removed");
  };

  const updateQuantity = async (id: string, current: number, change: number) => {
    const newQty = current + change;
    if (newQty < 1) return removeItem(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
    await handleUpdateCartQuantity(id, current, change);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const displayPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest">
            Shopping Bag ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Looks like you haven't added anything to your cart yet."
              className="border-none shadow-none mt-10"
              action={
                <Link
                  href="/koleksi"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors uppercase tracking-widest"
                >
                  Explore Collection
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/produk/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-bold uppercase hover:text-gray-600 truncate max-w-[150px]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-semibold">{displayPrice(item.price)}</p>
                      </div>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity, -1)}
                          className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs px-2 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity, 1)}
                          className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium uppercase text-gray-600">Subtotal</span>
              <span className="text-lg font-bold">{displayPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              Checkout Now
            </Link>
            <Link
              href="/keranjang"
              onClick={onClose}
              className="block w-full text-center py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-widest hover:text-black transition-colors mt-2"
            >
              View Full Bag
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
