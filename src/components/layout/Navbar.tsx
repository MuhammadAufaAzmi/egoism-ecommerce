"use client";

import React, { useState, useEffect } from "react";
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

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const checkAuthAndCart = async () => {
    if (typeof window !== "undefined") {
      const role = getCookie("user_role");
      const userId = getCookie("user_id");

      setIsLoggedIn(!!role);

      if (userId) {
        try {
          const items = await getCartItems(userId);
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
    }
  };

  useEffect(() => {
    checkAuthAndCart();
    setIsSearchOpen(false); // Tutup search bar setiap kali pindah halaman
  }, [pathname]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      document.cookie =
        "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsLoggedIn(false);
      setIsOpen(false);
      setCartCount(0);
      router.push("/");
      router.refresh();
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

  const navLinks = [
    { label: "COLLECTION", href: "/koleksi" },
    { label: "MEN", href: "/men" },
    { label: "WOMEN", href: "/women" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30 font-['Inter']">
        <div className="max-w-[1440px] mx-auto px-5 md:px-16 h-[90px] flex items-center justify-between">
          <div className="flex-1 md:flex-none">
            <Link
              href="/"
              className="font-['Playfair_Display'] text-[24px] md:text-[28px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-opacity"
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
              href="/keranjang"
              className="text-[13px] font-medium tracking-[0.15em] text-secondary hover:text-primary transition-colors uppercase"
            >
              CART ({cartCount})
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
          <div className="absolute top-[90px] left-0 w-full bg-surface border-b border-outline-variant/30 px-5 py-6 flex justify-center animate-in slide-in-from-top-2 duration-300">
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-2xl flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH GARMENT..."
                className="w-full bg-transparent border-b border-primary focus:outline-none py-3 text-[14px] font-['Inter'] text-primary uppercase placeholder:text-secondary tracking-widest"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 text-[12px] font-bold text-primary uppercase tracking-widest hover:opacity-70"
              >
                ENTER
              </button>
            </form>
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
