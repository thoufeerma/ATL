import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { formatINR } from "@/lib/product-utils";
import { whatsappLink } from "@/lib/contact";
import { iconFor } from "@/lib/product-icon";

export interface MappedProduct {
  id: number;
  name: string;
  category: string;
  sub: string;
  brand: string;
  price: number;
  mrp?: number | null; // regular price, shown struck through when above the selling price
  image: string; // empty when the product has no photo
  capacity: string;
  accuracy: string;
}

export function ProductGrid({ products }: { products: MappedProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-secondary/10 bg-white px-6 py-16 sm:px-12 sm:py-20">
        <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.05] text-secondary">Nothing listed here yet.</h2>
        <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
          We stock far more than is online. Tell us what you need and we will send models and prices, usually the same day.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={whatsappLink("Hello ATL, I am looking for:")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1faa53] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#22bd5c]"
          >
            <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
          </a>
          <Link
            href="/products"
            className="rounded-full border border-secondary/15 px-6 py-3.5 font-semibold text-secondary transition-colors hover:bg-secondary hover:text-white"
          >
            Clear filters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
      {products.map((product) => (
        <li key={product.id}>
          <Link
            href={`/products/${product.id}`}
            className="group flex h-full flex-col rounded-2xl bg-white p-2 sm:p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(18,26,43,0.25)]"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/60">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              ) : (
                <NoPhoto name={`${product.name} ${product.category}`} />
              )}
              <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-secondary opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100 group-hover:text-primary" />
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-4">
              {product.brand !== "Generic" && <p className="text-xs sm:text-sm text-muted-foreground">{product.brand}</p>}
              <h3 className="mt-1 font-semibold leading-snug tracking-[-0.02em] text-secondary sm:text-lg line-clamp-2">{product.name}</h3>
              {product.capacity !== "-" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {product.capacity} · {product.accuracy}
                </p>
              )}
              <div className="mt-auto pt-4">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-secondary tabular-nums">
                    {product.price > 0 ? formatINR(product.price) : "Price on request"}
                  </span>
                  {product.mrp && (
                    <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
                      MRP <s>{formatINR(product.mrp)}</s>
                    </span>
                  )}
                </div>
                {product.price > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Incl. GST
                    {product.mrp && (
                      <span className="font-semibold text-emerald-700"> · Save {formatINR(product.mrp - product.price)}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Placeholder for products without a photo: a faint measuring grid and a matching icon.
function NoPhoto({ name }: { name: string }) {
  const Icon = iconFor(name);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-border bg-white shadow-[0_10px_30px_-12px_rgba(31,41,55,0.25)] transition-transform duration-500 group-hover:-translate-y-1">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-secondary/70" strokeWidth={1.4} />
      </div>
    </div>
  );
}
