import { NextResponse } from "next/server";
import { getWooCommerceCategories } from "@/lib/woocommerce-categories";
import { buildCategoryTree } from "@/lib/category-data";
import { withCatalogueCategories } from "@/lib/category-fallback";

// Category tree for the navbar mega menu.
// A GET route (instead of a Server Action) so the WooCommerce fetch is served from
// Next's data cache and the response can be cached by the browser and Vercel's CDN.
export const dynamic = "force-dynamic";

export async function GET() {
  const live = buildCategoryTree(await getWooCommerceCategories());
  const tree = withCatalogueCategories(live);

  // WordPress unreachable or empty: serve the fixed catalogue, but only cache it briefly
  // so live categories show up soon after WordPress is back.
  const cacheControl = live.length
    ? "public, max-age=300, s-maxage=300, stale-while-revalidate=86400"
    : "public, max-age=60, s-maxage=60";

  return NextResponse.json(tree, { headers: { "Cache-Control": cacheControl } });
}
