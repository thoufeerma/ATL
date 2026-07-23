import { cache } from 'react';
import { fetchWooCommerce } from './woocommerce';

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

// React cache ensures this is only called once per request on the server
export const getWooCommerceCategories = cache(async (): Promise<WooCategory[]> => {
  try {
    // Fetching up to 100 categories. If more are needed, pagination would be required.
    const categories: WooCategory[] = await fetchWooCommerce('products/categories?per_page=100');
    return categories;
  } catch (error) {
    console.error("Failed to fetch WooCommerce categories:", error);
    return [];
  }
});

export const getCategorySlugToIdMap = cache(async (): Promise<Record<string, number>> => {
  const categories = await getWooCommerceCategories();
  const map: Record<string, number> = {};
  
  categories.forEach(cat => {
    map[cat.slug] = cat.id;
  });
  
  return map;
});

// Helper to resolve an array of slugs into their WooCommerce category IDs
export const resolveSlugsToIds = async (slugs: string[]): Promise<number[]> => {
  const map = await getCategorySlugToIdMap();
  
  const ids: number[] = [];
  slugs.forEach(slug => {
    if (map[slug]) {
      ids.push(map[slug]);
    }
  });
  
  return ids;
};
