import { cache } from 'react';
import { fetchWooCommerce } from './woocommerce';

export interface WooAttributeTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WooAttribute {
  id: number;
  name: string;
  slug: string;
  terms: WooAttributeTerm[];
}

export const getWooCommerceAttributes = cache(async (): Promise<WooAttribute[]> => {
  try {
    // 1. Fetch global attributes
    const attributesRaw = await fetchWooCommerce('products/attributes?per_page=100');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attributes: WooAttribute[] = await Promise.all(attributesRaw.map(async (attr: any) => {
      // 2. Fetch terms for each attribute
      // WooCommerce attribute slug usually starts with 'pa_' internally for querying
      // We will ensure the slug has 'pa_' prefix if it's meant to be queried.
      // Wait, WooCommerce API returns the slug WITHOUT 'pa_' prefix in the `products/attributes` response usually,
      // but expects `attribute=pa_size` in the products query.
      const rawSlug = attr.slug;
      const querySlug = rawSlug.startsWith('pa_') ? rawSlug : `pa_${rawSlug}`;
      
      let terms = [];
      try {
        terms = await fetchWooCommerce(`products/attributes/${attr.id}/terms?per_page=100&hide_empty=true`);
      } catch (err) {
        console.error(`Failed to fetch terms for attribute ${attr.id}`, err);
      }
      
      return {
        id: attr.id,
        name: attr.name,
        slug: querySlug, // We use the query slug (with pa_ prefix) for URL param handling
        terms: terms.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          count: t.count
        }))
      };
    }));

    return attributes;
  } catch (error) {
    console.error("Failed to fetch WooCommerce attributes:", error);
    return [];
  }
});
