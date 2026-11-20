import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { fetchAllWooCommerce } from "@/lib/woocommerce";
import { getWooCommerceCategories, resolveSlugsToIds } from "@/lib/woocommerce-categories";
import { getWooCommerceAttributes, WooAttribute, type FacetCounts } from "@/lib/woocommerce-attributes";
import { buildCategoryTree, getDescendantSlugs } from "@/lib/category-data";
import { decodeEntities } from "@/lib/html";
import { getPricing, normalizeTerm } from "@/lib/product-utils";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid, MappedProduct } from "@/components/products/ProductGrid";
import { FilterProvider } from "@/components/products/FilterProvider";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { ActiveFiltersGrouped } from "@/components/products/ActiveFiltersGrouped";

type ListedProduct = MappedProduct & { termNames: Record<number, Set<string>> };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const str = (k: string) => (typeof resolvedParams[k] === "string" ? (resolvedParams[k] as string) : undefined);

  const catParam = str("cat");
  const subParam = str("sub");
  const childParam = str("child");
  const searchParam = str("q");
  const minPriceParam = Number(str("min_price")) || null;
  const maxPriceParam = Number(str("max_price")) || null;
  const sortParam = str("sort");

  // 1. Attributes & categories
  const [attributes, wooCategories] = await Promise.all([getWooCommerceAttributes(), getWooCommerceCategories()]);
  const dynamicCategoryTree = buildCategoryTree(wooCategories);

  // 2. Category filter (selected category + all of its descendants)
  const activeSlug = childParam ?? subParam ?? catParam;
  const activeCategoryName = activeSlug
    ? decodeEntities(wooCategories.find((c) => c.slug === activeSlug)?.name) || activeSlug
    : null;

  let wcQuery = "status=publish";
  if (activeSlug) {
    const slugsToLookup = Array.from(new Set([activeSlug, ...getDescendantSlugs(wooCategories, activeSlug)]));
    const categoryIds = await resolveSlugsToIds(slugsToLookup);
    if (categoryIds.length > 0) wcQuery += `&category=${categoryIds.join(",")}`;
  }
  if (searchParam) wcQuery += `&search=${encodeURIComponent(searchParam)}`;
  if (sortParam === "price-asc") wcQuery += `&orderby=price&order=asc`;
  else if (sortParam === "price-desc") wcQuery += `&orderby=price&order=desc`;
  else if (sortParam === "date-desc") wcQuery += `&orderby=date&order=desc`;
  else if (sortParam === "title-asc") wcQuery += `&orderby=title&order=asc`;

  // 3. Fetch every matching product (not just the first 100)
  let products: any[] = [];
  try {
    products = await fetchAllWooCommerce(`products?${wcQuery}`);
  } catch (err) {
    console.error("Failed fetching products:", err);
  }

  // 4. Map products, indexing their global-attribute term names for filtering
  const listed: ListedProduct[] = products.map((p: any) => {
    const { price, mrp } = getPricing(p);
    const brandAttr = p.attributes?.find((a: any) => a.name?.toLowerCase() === "brand");
    const termNames: Record<number, Set<string>> = {};
    (p.attributes ?? []).forEach((a: any) => {
      const attr = attributes.find((g) => g.id === a.id || (a.id === 0 && normalizeTerm(g.name) === normalizeTerm(a.name)));
      if (attr) termNames[attr.id] = new Set((a.options ?? []).map(normalizeTerm));
    });
    return {
      id: p.id,
      name: decodeEntities(p.name),
      category: decodeEntities(p.categories?.[0]?.name) || "Uncategorized",
      sub: "Store Item",
      brand: decodeEntities(brandAttr?.options?.[0]) || decodeEntities(p.brands?.[0]?.name) || "Generic",
      price: price ?? 0,
      mrp,
      image: p.images?.[0]?.src || "https://placehold.co/600x600/18181b/52525b?text=No+Image",
      capacity: "-",
      accuracy: "-",
      termNames,
    };
  });

  // 5. Local filtering: price + attributes (AND across attributes, OR within one)
  const activeTerms = new Map<WooAttribute, Set<string>>();
  attributes.forEach((attr) => {
    const slugs = str(attr.slug)?.split(",").filter(Boolean) ?? [];
    const names = slugs
      .map((slug) => attr.terms.find((t) => t.slug === slug)?.name)
      .filter((n): n is string => !!n)
      .map(normalizeTerm);
    if (names.length) activeTerms.set(attr, new Set(names));
  });

  const matchesPrice = (p: ListedProduct) =>
    (minPriceParam === null || p.price >= minPriceParam) && (maxPriceParam === null || p.price <= maxPriceParam);

  const matchesAttr = (p: ListedProduct, attr: WooAttribute, wanted: Set<string>) => {
    const has = p.termNames[attr.id];
    return !!has && [...wanted].some((n) => has.has(n));
  };

  const matchesAll = (p: ListedProduct, skip?: WooAttribute) =>
    matchesPrice(p) && [...activeTerms].every(([attr, wanted]) => attr === skip || matchesAttr(p, attr, wanted));

  const filtered = listed.filter((p) => matchesAll(p));

  // 6. Facet counts: for each attribute, count products matching every *other* active filter,
  //    so options show how many results selecting them would give.
  const facets: FacetCounts = {};
  attributes.forEach((attr) => {
    const pool = listed.filter((p) => matchesAll(p, attr));
    const counts: Record<string, number> = {};
    attr.terms.forEach((t) => {
      const n = normalizeTerm(t.name);
      counts[t.slug] = pool.filter((p) => p.termNames[attr.id]?.has(n)).length;
    });
    facets[attr.slug] = counts;
  });

  // 7. Price bounds from the category/search result set (before price filtering)
  const prices = listed.map((p) => p.price).filter((n) => n > 0);
  const priceBounds = {
    min: 0,
    max: prices.length ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mappedProducts: MappedProduct[] = filtered.map(({ termNames, ...rest }) => rest);

  return (
    <FilterProvider>
      <main className="min-h-screen bg-muted/30">
        <Navbar />

        {/* Page Header */}
        <div className="bg-secondary text-white pt-32 pb-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Products</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">All Products</h1>
                <p className="text-zinc-300 text-lg font-light max-w-2xl">
                  Browse our complete range of precision weighing, billing, packaging & automation solutions from your WooCommerce store.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  categoryTree={dynamicCategoryTree}
                  attributes={attributes}
                  facets={facets}
                  priceBounds={priceBounds}
                />
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">

                {/* Mobile Filter Trigger */}
                <MobileFilterDrawer>
                  <FilterSidebar
                    categoryTree={dynamicCategoryTree}
                    attributes={attributes}
                    facets={facets}
                    priceBounds={priceBounds}
                  />
                </MobileFilterDrawer>

                <div className="text-sm text-muted-foreground font-semibold lg:ml-auto">
                  {mappedProducts.length} {mappedProducts.length === 1 ? "product" : "products"} found
                </div>
              </div>

              {/* Active Filters */}
              <ActiveFiltersGrouped attributes={attributes} categoryLabel={activeCategoryName} />

              <ProductGrid products={mappedProducts} />
            </div>
          </div>
        </div>
      </main>
    </FilterProvider>
  );
}
