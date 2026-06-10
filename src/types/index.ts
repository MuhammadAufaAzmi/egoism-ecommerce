export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: "men" | "women" | "unisex";
  image: string;
  images?: string[];
  description?: string;
  sizes?: string[];
  colors?: { name: string; image: string }[];
  fitType?: "oversized" | "regular" | "crop" | "crop-tank" | "women-tank";
  activity?: string[];
  isNew?: boolean;
  isSale?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface NavLink {
  label: string;
  href: string;
}
