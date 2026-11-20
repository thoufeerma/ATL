import { NextResponse } from "next/server";
import { getWooCommerceCategories } from "@/lib/woocommerce-categories";
import { buildCategoryTree } from "@/lib/category-data";

// Category tree for the navbar mega menu.
// A GET route (instead of a Server Action) so the WooCommerce fetch is served from
// Next's data cache and the response can be cached by the browser and Vercel's CDN.
export const dynamic = "force-dynamic";

export async function GET() {
  const tree = buildCategoryTree(await getWooCommerceCategories());

  // WordPress unreachable: don't let an empty menu get cached.
  if (tree.length === 0) {
    return NextResponse.json([], { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(tree, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400" },
  });
}
