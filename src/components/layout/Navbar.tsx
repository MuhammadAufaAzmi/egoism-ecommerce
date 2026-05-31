"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCartItems } from "@/lib/products";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  // Search autocomplete
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const getCookie = (name: string) => {
    // Fungsi ini tidak lagi dipakai untuk membaca cookie auth (user_role, user_id)
    // karena cookie tersebut sekarang httpOnly: true. 
    // Dipertahankan jika dibutuhkan untuk hal lain.
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const checkAuthAndCart = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();
      
      setIsLoggedIn(authData.authenticated);

      if (authData.authenticated && authData.user?.id) {
        try {
          const items = await getCartItems(authData.user.id);
          const total = items.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0,
          );
          setCartCount(total);
        } catch (error) {
          console.error("Gagal menarik data keranjang:", error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Gagal verifikasi auth", err);
      setIsLoggedIn(false);
      setCartCount(0);
    }
  };

  useEffect(() => {
    checkAuthAndCart();
    setIsSearchOpen(false); // Tutup search bar setiap kali pindah halaman
  }, [pathname]);

  // Scroll-triggered navbar enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setIsOpen(false);
      setCartCount(0);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout gagal", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setIsSearchOpen(false);
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Fetch autocomplete suggestions dengan debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "COLLECTION", href: "/koleksi" },
    { label: "MEN", href: "/men" },
    { label: "WOMEN", href: "/women" },
  ];

  return (
    <>
      <nav className={`sticky top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? "bg-background/95 border-outline-variant/30 shadow-sm" : "bg-background/80 border-transparent"}`}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-16 h-[90px] flex items-center justify-between">
          <div className="flex-1 md:flex-none">
            <Link
              href="/"
              className="text-[24px] md:text-[28px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-opacity"
            >
              EGOISM
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 pb-1 border-b ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-secondary border-transparent hover:text-primary hover:border-primary/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center justify-end space-x-6 flex-1 md:flex-none">
            {/* SEARCH BUTTON (DESKTOP) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-secondary hover:text-primary transition-colors"
              title="Search Garment"
              aria-label="Open search bar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link
              href="/wishlist"
              className="text-secondary hover:text-primary transition-colors"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <Link
              href="/keranjang"
              className="relative text-secondary hover:text-primary transition-colors"
              aria-label="Shopping bag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/my-account"
                  className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 pb-1 border-b ${
                    pathname === "/my-account"
                      ? "text-primary border-primary"
                      : "text-secondary border-transparent hover:text-primary hover:border-primary/50"
                  }`}
                >
                  MY ACCOUNT
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-[13px] font-medium tracking-[0.15em] text-red-400 hover:text-red-500 transition-colors uppercase border border-red-400/40 px-4 py-2 hover:border-red-400"
                >
                  SIGN OUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[13px] font-medium tracking-[0.15em] text-secondary hover:text-primary transition-colors uppercase border border-primary/30 px-4 py-2 hover:border-primary"
              >
                SIGN IN
              </Link>
            )}
          </div>

          {/* MOBILE HAMBURGER & SEARCH */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-primary focus:outline-none"
              aria-label="Toggle search bar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-primary focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* SEARCH BAR DROPDOWN OVERLAY */}
        {isSearchOpen && (
          <div
            ref={searchRef}
            className="absolute top-[90px] left-0 w-full bg-surface border-b border-outline-variant/30 px-5 py-6 flex flex-col items-center animate-in slide-in-from-top-2 duration-300 z-50"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-2xl flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="SEARCH GARMENT..."
                className="w-full bg-transparent border-b border-primary focus:outline-none py-3 text-[14px] text-primary uppercase placeholder:text-secondary tracking-widest"
                autoFocus
              />
              {loadingSuggestions ? (
                <span className="absolute right-0 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <button
                  type="submit"
                  className="absolute right-0 text-[12px] font-bold text-primary uppercase tracking-widest hover:opacity-70"
                >
                  ENTER
                </button>
              )}
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="w-full max-w-2xl mt-3 border border-outline-variant/30 bg-surface shadow-lg">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produk/${product.slug}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-surface-container transition-colors border-b border-outline-variant/20 last:border-none"
                  >
                    <div className="relative w-12 h-14 flex-shrink-0 bg-surface-container overflow-hidden">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium uppercase tracking-wide text-primary truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-secondary uppercase tracking-widest mt-0.5">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-[12px] font-semibold text-primary flex-shrink-0">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </Link>
                ))}
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="block text-center text-[11px] uppercase tracking-widest text-secondary hover:text-primary py-3 transition-colors"
                >
                  SEE ALL RESULTS FOR &ldquo;{searchQuery}&rdquo; →
                </Link>
              </div>
            )}

            {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && !loadingSuggestions && (
              <div className="w-full max-w-2xl mt-2 text-center text-[11px] text-secondary uppercase tracking-widest py-3">
                No results for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* MOBILE DROPDOWN */}
        {isOpen && (
          <div className="md:hidden bg-background border-b border-outline-variant/30 px-5 py-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-[14px] font-medium tracking-[0.1em] text-secondary hover:text-primary transition-colors uppercase py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-outline-variant/30 pt-4 flex flex-col space-y-3">
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="text-[14px] font-medium tracking-[0.1em] text-secondary hover:text-primary transition-colors uppercase py-2"
              >
                WISHLIST
              </Link>
              <Link
                href="/keranjang"
                onClick={() => setIsOpen(false)}
                className="text-[14px] font-medium tracking-[0.1em] text-secondary hover:text-primary transition-colors uppercase py-2"
              >
                CART ({cartCount})
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/my-account"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-primary text-primary font-medium tracking-[0.1em] py-3 uppercase text-[13px] hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    MY ACCOUNT
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-center bg-red-950/20 text-red-400 border border-red-400/30 font-medium tracking-[0.1em] py-3 uppercase text-[13px]"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-primary text-on-primary font-medium tracking-[0.1em] py-3 uppercase text-[13px]"
                >
                  SIGN IN
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
