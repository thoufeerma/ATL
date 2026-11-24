"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Search, ChevronDown, Phone, MessageCircle, MapPin, ArrowRight, ArrowUpRight, Plus,
  Scale, Receipt, Printer, Package, Hash, Tag, Droplets, MoreHorizontal,
} from "lucide-react";
import type { CategoryNode } from "@/lib/category-data";
import { withCatalogueCategories } from "@/lib/category-fallback";
import { categoryImage } from "@/lib/category-images";
import { PHONE_NUMBER, PHONE_DISPLAY, whatsappLink } from "@/lib/contact";

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

function toMenu(tree: CategoryNode[]): MenuCategory[] {
  return tree.map((cat) => ({
    label: cat.title,
    slug: cat.slug,
    href: `/products?cat=${cat.slug}`,
    items: (cat.children || []).map((child) => ({
      label: child.title,
      href: `/products?cat=${cat.slug}&sub=${child.slug}`,
    })),
  }));
}

// Shown immediately, and kept if the live menu can't be loaded.
const CATALOGUE_MENU = toMenu(withCatalogueCategories());

function CategoryIcon({ slug, className = "h-5 w-5" }: { slug: string; className?: string }) {
  const Icon = slug.includes("weighing")
    ? Scale
    : slug.includes("billing")
      ? Receipt
      : slug.includes("printing")
        ? Printer
        : slug.includes("counting")
          ? Hash
          : slug.includes("sealing")
            ? Package
            : slug.includes("labelling")
              ? Tag
              : slug.includes("filling")
                ? Droplets
                : MoreHorizontal;
  return <Icon className={className} />;
}

const LINKS: { label: string; href: string; mega?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Brands", href: "/brands" },
  { label: "Services", href: "/services" },
  { label: "Support", href: "/support" },
  { label: "Blog", href: "/blog" },
];

const POPULAR = [
  { label: "Retail scales", href: "/products?cat=weighing&sub=retail-scales" },
  { label: "Billing machines", href: "/products?cat=billing-solutions" },
  { label: "Band sealers", href: "/products?cat=sealing&sub=band-sealing" },
  { label: "Jewellery scales", href: "/products?cat=weighing&sub=jewellery-scale" },
  { label: "Currency counters", href: "/products?cat=counting" },
];

// Pages that open with a dark hero: the nav stays transparent over it until you scroll.
const HERO_PAGES: string[] = ["/", "/about", "/services", "/industries", "/brands", "/support", "/contact", "/blog", "/products"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>(CATALOGUE_MENU);
  const [activeCat, setActiveCat] = useState(0);

  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadMenuTree()
      .then((tree) => tree.length && setMenu(toMenu(tree)))
      .catch((error) => console.warn("Using the built-in category menu; live menu failed to load", error));
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything when the page changes.
  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock page scroll behind the mobile menu and search; Escape closes whichever is open.
  const overlayOpen = mobileOpen || searchOpen;
  useEffect(() => {
    if (!overlayOpen && !productsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setSearchOpen(false);
      setProductsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const root = document.documentElement;
    if (overlayOpen) root.style.overflow = "hidden";
    // Hides the floating WhatsApp button (see globals.css); the menu has its own.
    if (mobileOpen) root.dataset.menuOpen = "";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      delete root.dataset.menuOpen;
    };
  }, [overlayOpen, productsOpen, mobileOpen]);

  const isHeroPage = HERO_PAGES.includes(pathname) || pathname.startsWith("/blog/");
  // Three looks: transparent over a dark hero, a full white bar at the top of other pages,
  // and a floating frosted pill once the page scrolls. The open mobile menu forces dark.
  const floating = isScrolled && !mobileOpen;
  const dark = mobileOpen || (isHeroPage && !isScrolled);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!productsOpen) setActiveCat(0);
    setProductsOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setProductsOpen(false), 160);
  };

  const current = menu[Math.min(activeCat, menu.length - 1)];
  const currentImage = current ? categoryImage(current.slug) : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Contact strip (desktop): collapses once the page scrolls */}
        <div
          className={`hidden lg:block overflow-hidden bg-secondary text-[13px] text-white/75 transition-[max-height] duration-300 ${
            isScrolled ? "max-h-0" : "max-h-10"
          }`}
        >
          <div className="container mx-auto flex h-9 items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Sales, installation &amp; service across Kerala since 2003
            </span>
            <div className="flex items-center gap-6">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
                <Phone className="h-3.5 w-3.5" /> {PHONE_DISPLAY}
              </a>
              <a href="tel:04712334553" className="transition-colors hover:text-white">0471 2334553</a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#4ade80] transition-colors hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Full-width background, only for the white bar at the top of non-hero pages and the open mobile menu */}
        <div
          className={`transition-[background-color,border-color,padding] duration-500 ${
            mobileOpen
              ? "bg-[#080c15] border-b border-white/10"
              : !floating && !dark
                ? "bg-white border-b border-border"
                : "border-b border-transparent"
          } ${floating ? "pt-3" : ""}`}
        >
          <div className="container mx-auto">
            <div
              className={`relative flex items-center justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                floating
                  ? "h-16 rounded-2xl border border-secondary/10 bg-white/80 px-3 shadow-[0_12px_40px_-12px_rgba(18,26,43,0.25)] backdrop-blur-xl backdrop-saturate-150 sm:px-4"
                  : "h-[72px] border border-transparent px-0"
              }`}
            >
              <Link href="/" aria-label="Accurate Trade Links home" className="flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Accurate Trade Links"
                  className={`w-auto object-contain transition-all duration-500 ${floating ? "h-9" : "h-10 md:h-11"}`}
                />
              </Link>

              {/* Desktop links, with a pill that slides to whichever link you point at */}
              <nav aria-label="Main" className="hidden flex-1 justify-center xl:flex">
                <ul
                  className={`flex items-center text-[15px] font-medium transition-colors ${dark ? "text-white" : "text-secondary"}`}
                  onMouseLeave={() => setHovered(null)}
                >
                  {LINKS.map((l) => {
                    const active = isActive(l.href);
                    const inner = (
                      <>
                        {hovered === l.label && (
                          <motion.span
                            layoutId="nav-hover"
                            className={`absolute inset-0 -z-10 rounded-full ${dark ? "bg-white/10" : "bg-secondary/[0.06]"}`}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        )}
                        {l.label}
                        {l.mega && (
                          <ChevronDown className={`h-4 w-4 opacity-60 transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`} />
                        )}
                        {active && (
                          <span aria-hidden className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                        )}
                      </>
                    );
                    const cls = "relative z-0 flex items-center gap-1 rounded-full px-3.5 py-2 transition-colors";
                    return (
                      <li key={l.label} onMouseEnter={() => setHovered(l.label)}>
                        {l.mega ? (
                          <button
                            type="button"
                            className={cls}
                            aria-expanded={productsOpen}
                            aria-haspopup="true"
                            onMouseEnter={openMega}
                            onMouseLeave={closeMega}
                            onClick={() => setProductsOpen((p) => !p)}
                          >
                            {inner}
                          </button>
                        ) : (
                          <Link href={l.href} className={cls} aria-current={active ? "page" : undefined}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search products"
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    dark ? "text-white hover:bg-white/10" : "text-secondary hover:bg-secondary/[0.06]"
                  }`}
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/engineer/login"
                  className={`hidden rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:block ${
                    dark ? "text-white hover:bg-white/10" : "text-secondary hover:bg-secondary/[0.06]"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="group hidden items-center gap-1.5 rounded-full bg-primary py-2.5 pl-4 pr-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(227,6,19,0.7)] transition-colors hover:bg-[#c00510] sm:flex"
                >
                  Get a quote
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>

                {/* Menu button: two lines that turn into a cross */}
                <button
                  type="button"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden ${
                    dark ? "text-white hover:bg-white/10" : "text-secondary hover:bg-secondary/[0.06]"
                  }`}
                >
                  <span
                    className={`absolute h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${
                      mobileOpen ? "rotate-45" : "-translate-y-[4px]"
                    }`}
                  />
                  <span
                    className={`absolute h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${
                      mobileOpen ? "-rotate-45" : "translate-y-[4px]"
                    }`}
                  />
                </button>
              </div>

              {/* Products mega menu: categories on the left, the pointed-at one's subcategories and photo on the right */}
              <AnimatePresence>
                {productsOpen && current && (
                  <motion.div
                    key="mega"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-x-0 top-full hidden justify-center pt-3 xl:flex"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.985 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="grid w-[min(980px,calc(100vw-2rem))] grid-cols-[15rem_1fr_17rem] overflow-hidden rounded-2xl border border-secondary/10 bg-white text-secondary shadow-[0_30px_80px_-30px_rgba(18,26,43,0.45)]"
                    >
                      <div className="flex flex-col border-r border-border bg-muted/50 p-3">
                        <ul className="space-y-0.5">
                          {menu.map((cat, i) => {
                            const on = cat === current;
                            return (
                              <li key={cat.slug}>
                                <Link
                                  href={cat.href}
                                  onMouseEnter={() => setActiveCat(i)}
                                  onFocus={() => setActiveCat(i)}
                                  onClick={() => setProductsOpen(false)}
                                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    on ? "bg-white text-secondary shadow-sm" : "text-secondary/70 hover:text-secondary"
                                  }`}
                                >
                                  <span className={`transition-colors ${on ? "text-primary" : "text-muted-foreground"}`}>
                                    <CategoryIcon slug={cat.slug} className="h-[18px] w-[18px]" />
                                  </span>
                                  <span className="flex-1">{cat.label}</span>
                                  <ArrowRight className={`h-4 w-4 text-primary transition-all ${on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`} />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <Link
                          href="/products"
                          onClick={() => setProductsOpen(false)}
                          className="mt-auto px-3 pt-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                        >
                          View all products
                        </Link>
                      </div>

                      <div className="min-h-[22rem] p-6">
                        <h3 className="text-lg font-semibold tracking-[-0.02em]">{current.label}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {current.items.length ? `${current.items.length} ranges` : "Browse the full range"}
                        </p>
                        {current.items.length > 0 && (
                          <ul className="mt-4 grid grid-cols-2 gap-x-2">
                            {current.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setProductsOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-secondary/75 transition-colors hover:bg-muted hover:text-secondary"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <Link
                        href={current.href}
                        onClick={() => setProductsOpen(false)}
                        className="group relative m-3 ml-0 overflow-hidden rounded-xl bg-secondary"
                      >
                        {currentImage && (
                          <Image
                            key={currentImage}
                            src={currentImage}
                            alt=""
                            fill
                            sizes="272px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        <span className="absolute inset-0 bg-gradient-to-t from-[#080c15] via-[#080c15]/40 to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                          <span className="block text-sm text-white/70">Shop the range</span>
                          <span className="mt-0.5 flex items-center justify-between gap-2 font-semibold">
                            All {current.label}
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-primary">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside the mega menu to close it */}
      {productsOpen && <div className="fixed inset-0 z-40" onClick={() => setProductsOpen(false)} />}

      {/* Mobile menu: full screen, under the bar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#080c15] text-white xl:hidden"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_50%_at_80%_10%,#000,transparent)]" />
            <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-[110px]" />

            <div className="container relative mx-auto flex min-h-full flex-col pb-8 pt-[96px] lg:pt-[132px]">
              <nav aria-label="Mobile">
                <ul>
                  {LINKS.map((l, i) => (
                    <motion.li
                      key={l.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: EASE, delay: 0.04 + i * 0.035 }}
                      className="border-b border-white/10"
                    >
                      {l.mega ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setMobileProducts((o) => !o)}
                            aria-expanded={mobileProducts}
                            className="flex w-full items-center justify-between py-4 text-left font-display text-[2rem] leading-none"
                          >
                            {l.label}
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-transform duration-300 ${
                                mobileProducts ? "rotate-45 border-primary text-primary" : ""
                              }`}
                            >
                              <Plus className="h-4 w-4" />
                            </span>
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileProducts && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <ul className="grid grid-cols-1 gap-1 pb-4 sm:grid-cols-2">
                                  {menu.map((cat) => (
                                    <li key={cat.slug}>
                                      <Link
                                        href={cat.href}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                                      >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-primary">
                                          <CategoryIcon slug={cat.slug} className="h-[18px] w-[18px]" />
                                        </span>
                                        <span className="flex-1 font-medium">{cat.label}</span>
                                        {cat.items.length > 0 && <span className="text-xs text-white/40">{cat.items.length}</span>}
                                      </Link>
                                    </li>
                                  ))}
                                  <li className="sm:col-span-2">
                                    <Link
                                      href="/products"
                                      className="mt-1 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white/60 hover:text-white"
                                    >
                                      View all products <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  </li>
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={l.href}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          className={`flex items-center justify-between py-4 font-display text-[2rem] leading-none transition-colors ${
                            isActive(l.href) ? "text-primary" : "hover:text-white/70"
                          }`}
                        >
                          {l.label}
                          <ArrowUpRight className="h-5 w-5 text-white/30" />
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.35 }}
                className="mt-auto pt-10"
              >
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={whatsappLink("Hello ATL, I would like to know about:")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1faa53] font-semibold"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 font-semibold"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                  <Link
                    href="/contact"
                    className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-full bg-primary font-semibold"
                  >
                    Get a quote <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-white/45">
                  <span>{PHONE_DISPLAY}</span>
                  <Link href="/engineer/login" className="font-semibold text-white/70 hover:text-white">
                    Engineer login
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <AnimatePresence>{searchOpen && <SearchDialog menu={menu} onClose={() => setSearchOpen(false)} />}</AnimatePresence>
    </MotionConfig>
  );
}

// Pop-up search: a big input, popular searches and the main categories.
function SearchDialog({ menu, onClose }: { menu: MenuCategory[]; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#080c15]/60 px-4 pb-10 pt-20 backdrop-blur-sm sm:pt-28"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white text-secondary shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
      >
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-border px-5">
          <Search className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scales, billing machines, sealers…"
            aria-label="Search products"
            className="h-16 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-secondary"
          >
            Esc
          </button>
        </form>

        <div className="p-5">
          <p className="text-xs font-semibold text-muted-foreground">Popular</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={onClose}
                className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-secondary/40"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold text-muted-foreground">Categories</p>
          <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
            {menu.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-secondary/70 transition-colors group-hover:bg-white group-hover:text-primary">
                    <CategoryIcon slug={cat.slug} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{cat.label}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
