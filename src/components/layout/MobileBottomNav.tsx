"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "home", activeIcon: "home", label: "Home" },
  { href: "/koleksi", icon: "grid_view", activeIcon: "grid_view", label: "Koleksi" },
  { href: "/search", icon: "search", activeIcon: "search", label: "Cari" },
  { href: "/keranjang", icon: "shopping_bag", activeIcon: "shopping_bag", label: "Keranjang" },
  { href: "/my-account", icon: "person", activeIcon: "person", label: "Akun" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Fetch cart count
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/cart/count");
        if (res.ok) {
          const data = await res.json();
          setCartCount(data.count || 0);
        }
      } catch {
        // ignore
      }
    };
    fetchCount();
  }, [pathname]); // Re-fetch saat navigasi

  // Hide on admin pages, my-account (has own nav), dan checkout
  const hiddenPaths = ["/admin", "/my-account", "/checkout"];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30" />

      <div className="relative flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map(({ href, icon, activeIcon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isCart = href === "/keranjang";

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative min-w-[48px] ${
                isActive
                  ? "text-primary"
                  : "text-secondary hover:text-primary"
              }`}
              aria-label={label}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}

              {/* Cart badge */}
              <span className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] transition-all duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isActive ? activeIcon : icon}
                </span>
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-primary text-on-primary text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>

              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
