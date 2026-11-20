import { decodeEntities } from "./html";

const UNIT_FACTOR: Record<string, number> = { mg: 1e-6, g: 1e-3, gm: 1e-3, kg: 1, t: 1e3, ton: 1e3, tons: 1e3 };

function magnitude(value: string) {
  const m = value.trim().match(/^([\d.]+)\s*([a-zA-Z]+)?/);
  if (!m) return NaN;
  return parseFloat(m[1]) * (UNIT_FACTOR[m[2]?.toLowerCase() ?? ""] ?? 1);
}

// Unit-aware natural sort: "92 g" < "1 kg" < "10 kg" < "1 Ton".
export function compareMeasure(a: string, b: string) {
  const x = magnitude(a);
  const y = magnitude(b);
  if (!Number.isNaN(x) && !Number.isNaN(y) && x !== y) return x - y;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function sortOptions(options: string[]) {
  return [...options].sort(compareMeasure);
}

export function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

// Normalises an attribute option / term name for comparison.
export function normalizeTerm(value: string) {
  return decodeEntities(value).trim().toLowerCase();
}

const toNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * Selling price and MRP for a WooCommerce product (or variation).
 * WooCommerce "Regular price" = MRP, "Sale price" = selling price.
 * Variable parents have no regular_price, so fall back to the <del> amount in price_html.
 */
export function getPricing(p: any): { price: number | null; mrp: number | null } {
  const price = toNum(p?.price);
  let mrp = toNum(p?.regular_price);
  if (!mrp && typeof p?.price_html === "string") {
    const del = p.price_html.match(/<del[^>]*>([\s\S]*?)<\/del>/i);
    if (del) {
      const digits = decodeEntities(del[1].replace(/<[^>]+>/g, "")).replace(/[^\d.]/g, "");
      mrp = toNum(digits);
    }
  }
  return { price, mrp: price && mrp && mrp > price ? mrp : null };
}
