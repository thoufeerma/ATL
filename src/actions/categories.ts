"use server";

import { getWooCommerceCategories } from "@/lib/woocommerce-categories";
import { buildCategoryTree, CategoryNode } from "@/lib/category-data";

export async function getNavbarCategoryTree(): Promise<CategoryNode[]> {
  const wooCategories = await getWooCommerceCategories();
  return buildCategoryTree(wooCategories);
}
