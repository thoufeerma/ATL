// Display order for product categories (navbar, filter sidebar, mobile filters).
//
// Keys are the parent category slug ("root" = top level); values list child
// slugs in the order they should appear. Each entry may be a single slug or an
// array of alternative slugs (useful if a category is renamed/recreated in
// WooCommerce, e.g. fixing "jewellary" -> "jewellery").
//
// Categories not listed here appear after the listed ones, alphabetically.
// Entries listed here that don't exist in WooCommerce are simply ignored.

type SlugEntry = string | string[];

export const CATEGORY_ORDER: Record<string, SlugEntry[]> = {
  root: [
    "weighing-scale",
    "billing-solutions",
    "printing-scales",
    "counting",
    "sealing",
    "labelling",
    "filling",
    "other",
  ],

  "weighing-scale": [
    "retail-scales",
    "platform-scales",
    "portable-scales",
    "price-computing-scales",
    ["personal-weighing", "personnel-kitchen", "personal-kitchen"],
    "hanging-scales",
    ["jewellary-scale", "jewellery-scale", "jewellery-scales"],
    ["lab-amalytical-scales", "lab-analytical-scales"],
    "hospital-scales",
    "industrial-scales",
    ["crane-scale", "crane-scales"],
  ],

  "billing-solutions": [
    ["keypad-billing-machines", "keypad-billing"],
    "android-touch-billing",
    "windows-touch-billing",
    "pos-printers",
    "label-printers",
    "barcode-scanners",
    ["cash-drawers", "cash-drawer"],
    "accessories",
  ],

  "printing-scales": [
    "receipt-printing-keypad",
    "receipt-printing-touch",
    "label-printing-keypad",
    "label-printing-touch",
    "ai-scale",
  ],

  counting: [
    "currency-counting",
    "value-counting",
    "coin-counting",
    "accessories-counting",
  ],

  sealing: [
    "hand-sealing",
    "pedal-sealing",
    "band-sealing",
    "foil-sealing",
    "induction-sealing",
    "vacuum-sealing",
    "cup-sealing",
    "tin-sealing",
    "heat-shrinking",
    "bag-closer",
    "accessories-sealing",
  ],

  labelling: [
    "batch-coder",
    "inkjet-printers",
    "bottle-labelling",
    "label-printers-labelling",
  ],

  filling: [
    "weigh-filler",
    "liquid-filler",
    "paste-filler",
    "milk-filler",
    "pneumatic-filler",
    "automatic-packing",
  ],

  other: [
    ["token-dispenser", "token-dispensor"],
    "gold-purity-analyser",
    "locker",
  ],
};

// Returns the sort rank of `slug` among the children of `parentSlug`,
// or Infinity if it has no configured position.
export function getCategoryRank(parentSlug: string, slug: string): number {
  const order = CATEGORY_ORDER[parentSlug];
  if (!order) return Infinity;
  const idx = order.findIndex((entry) =>
    Array.isArray(entry) ? entry.includes(slug) : entry === slug
  );
  return idx === -1 ? Infinity : idx;
}
