import { cache } from 'react';
import { fetchWooCommerce, fetchAllWooCommerce } from './woocommerce';
import { decodeEntities } from './html';
import { compareMeasure } from './product-utils';

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
        terms = await fetchAllWooCommerce(`products/attributes/${attr.id}/terms?hide_empty=true`);
      } catch (err) {
        console.error(`Failed to fetch terms for attribute ${attr.id}`, err);
      }
      
      return {
        id: attr.id,
        name: decodeEntities(attr.name),
        slug: querySlug, // We use the query slug (with pa_ prefix) for URL param handling
        terms: terms.map((t: any) => ({
          id: t.id,
          name: decodeEntities(t.name),
          slug: t.slug,
          count: t.count
        })).sort((a: WooAttributeTerm, b: WooAttributeTerm) => compareMeasure(a.name, b.name))
      };
    }));

    return attributes;
  } catch (error) {
    console.error("Failed to fetch WooCommerce attributes:", error);
    return [];
  }
});

// attribute slug -> term slug -> number of products in the current results
export type FacetCounts = Record<string, Record<string, number>>;
