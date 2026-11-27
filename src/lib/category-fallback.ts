import type { CategoryNode } from "./category-data";

// The fixed product catalogue: the 8 main categories and their subcategories from the
// catalogue sheet, in its order. It is always shown, whatever WordPress returns. Live
// WordPress categories are merged in on top (their names and slugs win when they match),
// and any category added in WordPress that isn't listed here is shown after these.
//
// `slugs` lists the WordPress slug first, then known alternative spellings, so a category
// that was renamed or recreated in WordPress still matches.

type FallbackNode = { title: string; slugs: string[]; children?: FallbackNode[] };

const node = (title: string, ...slugs: string[]): FallbackNode => ({ title, slugs });

const CATALOGUE: FallbackNode[] = [
  {
    title: "Weighing",
    slugs: ["weighing-scale", "weighing"],
    children: [
      node("Retail Scales", "retail-scales"),
      node("Portable Scales", "portable-scales"),
      node("Platform Scales", "platform-scales"),
      node("Hanging Scales", "hanging-scales"),
      node("Jewellery Scale", "jewellary-scale", "jewellery-scale", "jewellery-scales"),
      node("Personal Weighing", "personal-weighing", "personnel-kitchen", "personal-kitchen"),
      node("Lab & Analytical Scales", "lab-amalytical-scales", "lab-analytical-scales"),
      node("Industrial Scales", "industrial-scales"),
    ],
  },
  {
    title: "Billing Solutions",
    slugs: ["billing-solutions"],
    children: [
      node("Keypad Billing", "keypad-billing-machines", "keypad-billing"),
      node("Android Touch Billing", "android-touch-billing"),
      node("Windows Touch Billing", "windows-touch-billing"),
      node("POS Printers", "pos-printers"),
      node("Label Printers", "label-printers"),
      node("Barcode Scanners", "barcode-scanners"),
      node("Cash Drawers", "cash-drawers", "cash-drawer"),
    ],
  },
  {
    title: "Printing Scales",
    slugs: ["printing-scales"],
    children: [
      node("Receipt Printing-Keypad", "receipt-printing-keypad"),
      node("Receipt Printing-Touch", "receipt-printing-touch"),
      node("Label Printing-Keypad", "label-printing-keypad"),
      node("Receipt/Label Printing-Touch", "label-printing-touch", "receipt-label-printing-touch"),
    ],
  },
  {
    title: "Counting",
    slugs: ["counting"],
    children: [
      node("Currency Counting", "currency-counting"),
      node("Value Counting", "value-counting"),
      node("Coin Counting", "coin-counting"),
      node("Accessories", "accessories-counting"),
    ],
  },
  {
    title: "Sealing",
    slugs: ["sealing"],
    children: [
      node("Hand Sealing", "hand-sealing"),
      node("Band Sealing", "band-sealing"),
      node("Foil Sealing", "foil-sealing"),
      node("Induction Sealing", "induction-sealing"),
      node("Vacuum Sealing", "vacuum-sealing"),
      node("Cup Sealing", "cup-sealing"),
      node("Tin Sealing", "tin-sealing"),
      node("Heat Shrinking", "heat-shrinking"),
      node("Bag Closer", "bag-closer"),
      node("Accessories", "accessories-sealing"),
    ],
  },
  {
    title: "Labelling",
    slugs: ["labelling"],
    children: [
      node("Batch Coder", "batch-coder"),
      node("Inkjet Printers", "inkjet-printers"),
      node("Bottle Labelling", "bottle-labelling"),
      node("Label Printers", "label-printers-labelling"),
    ],
  },
  {
    title: "Filling",
    slugs: ["filling"],
    children: [
      node("Weigh Filler", "weigh-filler"),
      node("Liquid Filler", "liquid-filler"),
      node("Paste Filler", "paste-filler"),
      node("Milk Filler", "milk-filler"),
      node("Pneumatic Filler", "pneumatic-filler"),
      node("Automatic Packing", "automatic-packing"),
    ],
  },
  {
    title: "Other",
    slugs: ["other"],
    children: [
      node("Token Dispenser", "token-dispenser", "token-dispensor"),
      node("Gold Purity Analyser", "gold-purity-analyser"),
      node("Locker", "locker"),
    ],
  },
];

function mergeLevel(fallback: FallbackNode[], live: CategoryNode[]): CategoryNode[] {
  const used = new Set<CategoryNode>();
  const merged = fallback.map((f) => {
    const match = live.find((n) => !used.has(n) && f.slugs.includes(n.slug));
    if (match) used.add(match);
    const children = mergeLevel(f.children ?? [], match?.children ?? []);
    return {
      title: match?.title ?? f.title,
      slug: match?.slug ?? f.slugs[0],
      ...(children.length ? { children } : {}),
    };
  });
  // Live categories that aren't in the fixed catalogue keep their place after it.
  return [...merged, ...live.filter((n) => !used.has(n))];
}

/** The fixed catalogue with any live WordPress categories merged in. Never empty. */
export function withCatalogueCategories(live: CategoryNode[] = []): CategoryNode[] {
  return mergeLevel(CATALOGUE, live);
}

/**
 * The fixed catalogue key (first listed slug) for a slug, whichever spelling it uses:
 * "weighing" and "weighing-scale" both give "weighing-scale". Unknown slugs come back unchanged.
 */
export function catalogueKey(slug: string): string {
  const find = (nodes: FallbackNode[]): string | null => {
    for (const n of nodes) {
      if (n.slugs.includes(slug)) return n.slugs[0];
      const inChild = n.children ? find(n.children) : null;
      if (inChild) return inChild;
    }
    return null;
  };
  return find(CATALOGUE) ?? slug;
}

/**
 * The slug a category actually has in a merged tree (from `withCatalogueCategories`), given any
 * known spelling of it. Lets old links like ?cat=weighing-scale keep working after WordPress
 * names the category "weighing". Unknown slugs come back unchanged.
 */
export function liveSlug(tree: CategoryNode[], slug: string): string {
  // Merged trees list the catalogue nodes first, in catalogue order, at every level.
  const find = (fallback: FallbackNode[], merged: CategoryNode[]): string | null => {
    for (let i = 0; i < fallback.length; i++) {
      const f = fallback[i];
      const m = merged[i];
      if (!m) return null;
      if (f.slugs.includes(slug)) return m.slug;
      const inChild = f.children && m.children ? find(f.children, m.children) : null;
      if (inChild) return inChild;
    }
    return null;
  };
  return find(CATALOGUE, tree) ?? slug;
}

/** Finds a category's display name anywhere in a tree. */
export function findCategoryTitle(tree: CategoryNode[], slug: string): string | null {
  for (const n of tree) {
    if (n.slug === slug) return n.title;
    const inChild = n.children ? findCategoryTitle(n.children, slug) : null;
    if (inChild) return inChild;
  }
  return null;
}
