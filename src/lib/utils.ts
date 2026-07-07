import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductPrice(product: any, fitType?: string, size?: string): number {
  if (!product.priceOverrides || product.priceOverrides === "{}" || !fitType || !size) return product.price;
  try {
    const overrides = typeof product.priceOverrides === 'string' ? JSON.parse(product.priceOverrides) : product.priceOverrides;
    if (overrides[fitType] && overrides[fitType][size]) {
      return Number(overrides[fitType][size]);
    }
  } catch (e) {
    console.error("Failed to parse price overrides", e);
  }
  return product.price;
}
