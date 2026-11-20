import { cache } from 'react';
import { fetchAllWooCommerce } from './woocommerce';

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

// React cache ensures this is only called once per request on the server
export const getWooCommerceCategories = cache(async (): Promise<WooCategory[]> => {
  try {
    // Every page: with more than 100 categories, a single page silently drops some
    // (and their children then show up as top-level categories).
    const categories: WooCategory[] = await fetchAllWooCommerce('products/categories?_fields=id,name,slug,parent,count');
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
