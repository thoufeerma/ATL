"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ChevronDown, Menu, X,
  Scale, Receipt, Printer, Package, Hash, Tag, Droplets, MoreHorizontal, ChevronRight, ArrowRight
} from "lucide-react";
import type { CategoryNode } from "@/lib/category-data";

type MenuCategory = {
  label: string;
  slug: string;
  href: string;
  items: { label: string; href: string }[];
};

// Loaded once per browser session: the Navbar remounts on every page, and refetching
// the category tree each time made navigation feel slow.
let menuPromise: Promise<CategoryNode[]> | null = null;
function loadMenuTree() {
  if (!menuPromise) {
    menuPromise = fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error(`Menu request failed (${res.status})`);
        return res.json() as Promise<CategoryNode[]>;
      })
      .catch((err) => {
        menuPromise = null;
        throw err;
      });
  }
  return menuPromise;
}

function getCategoryIcon(slug: string) {
  if (slug.includes('weighing')) return <Scale className="w-5 h-5" />;
  if (slug.includes('billing')) return <Receipt className="w-5 h-5" />;
  if (slug.includes('printing')) return <Printer className="w-5 h-5" />;
  if (slug.includes('counting')) return <Hash className="w-5 h-5" />;
  if (slug.includes('sealing')) return <Package className="w-5 h-5" />;
  if (slug.includes('labelling')) return <Tag className="w-5 h-5" />;
  if (slug.includes('filling')) return <Droplets className="w-5 h-5" />;
  return <MoreHorizontal className="w-5 h-5" />;
}

// Pages that have a dark hero — navbar starts transparent on these
const HERO_PAGES = ["/"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [megaMenuData, setMegaMenuData] = useState<MenuCategory[]>([]);
  const [activeCat, setActiveCat] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadCategories() {
      try {
        const tree = await loadMenuTree();
        const mappedData = tree.map((cat) => ({
          label: cat.title,
          slug: cat.slug,
          href: `/products?cat=${cat.slug}`,
          items: (cat.children || []).map((child) => ({
            label: child.title,
            href: `/products?cat=${cat.slug}&sub=${child.slug}`
          }))
        }));
        setMegaMenuData(mappedData);
      } catch (error) {
        console.error("Failed to load navbar categories", error);
      }
    }
    loadCategories();
  }, []);

  const isHeroPage = HERO_PAGES.includes(pathname);
  // On non-hero pages: always show solid white nav. On hero page: transparent until scroll.
  const solidNav = !isHeroPage || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu when route changes
  useEffect(() => { setProductsOpen(false); setMobileOpen(false); }, [pathname]);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!productsOpen) setActiveCat(0);
    setProductsOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setProductsOpen(false), 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navTextClass = solidNav ? "text-foreground" : "text-white";
  const navBg = solidNav
    ? "bg-white shadow-md py-2 border-b border-border"
    : "bg-transparent py-4";

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg}`}>
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="relative h-10 md:h-12 flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Accurate Trade Links Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden xl:flex flex-1 justify-center">
              <div className={`flex items-center gap-8 font-semibold text-[14px] ${navTextClass} transition-colors`}>
              <Link href="/" className="hover:text-primary transition-colors py-2">Home</Link>
              <Link href="/about" className="hover:text-primary transition-colors py-2">About</Link>

              {/* Products Mega Menu */}
              <div
                className="relative"
                ref={megaRef}
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
              >
                <button
                  onClick={() => setProductsOpen(p => !p)}
                  className="flex items-center gap-1 hover:text-primary transition-colors py-2 focus:outline-none"
                  aria-expanded={productsOpen}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Menu Panel: categories on the left, the hovered one's subcategories on the right */}
                {productsOpen && megaMenuData.length > 0 && (() => {
                  const current = megaMenuData[Math.min(activeCat, megaMenuData.length - 1)];
                  const close = () => setProductsOpen(false);
                  return (
                    <div
                      onMouseEnter={openMenu}
                      onMouseLeave={closeMenu}
                      onKeyDown={(e) => { if (e.key === "Escape") close(); }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white text-foreground shadow-2xl rounded-2xl border border-border grid grid-cols-[15rem_1fr] overflow-hidden z-50 font-normal"
                      style={{ width: "min(880px, 92vw)" }}
                    >
                      <div className="bg-muted/50 border-r border-border p-3 flex flex-col">
                        <ul className="space-y-0.5">
                          {megaMenuData.map((cat, i) => {
                            const active = cat === current;
                            return (
                              <li key={cat.slug}>
                                <Link
                                  href={cat.href}
                                  onMouseEnter={() => setActiveCat(i)}
                                  onFocus={() => setActiveCat(i)}
                                  onClick={close}
                                  aria-current={active ? "true" : undefined}
                                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    active ? "bg-white text-primary shadow-sm" : "text-foreground/80 hover:text-foreground"
                                  }`}
                                >
                                  <span className={active ? "text-primary" : "text-muted-foreground"}>{getCategoryIcon(cat.slug)}</span>
                                  <span className="flex-1">{cat.label}</span>
                                  <ChevronRight className={`w-4 h-4 transition-opacity ${active ? "opacity-100" : "opacity-0"}`} />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <Link
                          href="/products"
                          onClick={close}
                          className="mt-auto pt-3 px-3 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                          View all products
                        </Link>
                      </div>

                      <div className="p-6 min-h-[22rem]">
                        <div className="flex items-baseline justify-between gap-4 pb-4 mb-3 border-b border-border">
                          <h3 className="font-heading text-lg font-bold text-foreground">{current.label}</h3>
                          <Link
                            href={current.href}
                            onClick={close}
                            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary whitespace-nowrap"
                          >
                            View all
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                        {current.items.length > 0 ? (
                          <ul className="columns-2 gap-x-4">
                            {current.items.map((item) => (
                              <li key={item.href} className="break-inside-avoid">
                                <Link
                                  href={item.href}
                                  onClick={close}
                                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground px-3 py-2">
                            Browse the full {current.label} range.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <Link href="/industries" className="hover:text-primary transition-colors py-2">Industries</Link>
              <Link href="/brands" className="hover:text-primary transition-colors py-2">Brands</Link>
              <Link href="/services" className="hover:text-primary transition-colors py-2">Services</Link>
              <Link href="/support" className="hover:text-primary transition-colors py-2">Support</Link>
              <Link href="/blog" className="hover:text-primary transition-colors py-2">Blog</Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center justify-end gap-4">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className={`p-2 rounded-full transition-colors ${solidNav ? "hover:bg-muted text-foreground" : "hover:bg-white/10 text-white"}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Engineer Login */}
              <Link
                href="/engineer/login"
                className={`text-sm font-semibold border rounded-full px-4 py-1.5 transition-colors ${solidNav ? "border-border hover:bg-muted text-foreground" : "border-white/30 hover:bg-white/10 text-white"}`}
              >
                Login
              </Link>
            </div>

            {/* Mobile Actions (Menu Toggle) */}
            <div className="xl:hidden flex items-center gap-2">
              <button
                className={`p-2 rounded-lg transition-colors ${solidNav ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (expanded) */}
        {searchOpen && (
          <div className="border-t border-border bg-white px-4 md:px-8 py-3">
            <form onSubmit={handleSearch} className="container mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, brands..."
                className="flex-1 text-sm font-medium outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-b border-border shadow-xl absolute top-full left-0 w-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Products", "/products"],
                ["Industries", "/industries"],
                ["Brands", "/brands"],
                ["Services", "/services"],
                ["Support", "/support"],
                ["Blog", "/blog"],
                ["Contact", "/contact"],
                ["Login", "/engineer/login"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="block px-4 py-3 rounded-xl text-foreground font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}

            </div>
          </div>
        )}
      </nav>

      {/* Overlay to close mega menu */}
      {productsOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProductsOpen(false)}
        />
      )}
    </>
  );
}
