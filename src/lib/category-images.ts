import { catalogueKey } from "./category-fallback";

// Photo for each main product range, keyed by catalogue slug.
const IMAGES: Record<string, string> = {
  "weighing-scale": "/images/categories/Weighing Systems.png",
  "billing-solutions": "/images/categories/Billing Solutions.png",
  "printing-scales": "/images/categories/Printing Scales.png",
  counting: "/images/categories/Counting Machines.png",
  sealing: "/images/categories/Sealing Machines.png",
  labelling: "/images/categories/Labelling Systems.png",
  filling: "/images/categories/Filling Machines.png",
  other: "/images/categories/other products.png",
};

/** The range photo for a category, whatever spelling of its slug WordPress uses. */
export function categoryImage(slug: string): string | undefined {
  return IMAGES[catalogueKey(slug)];
}
