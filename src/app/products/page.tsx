import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import { fetchAllWooCommerce } from "@/lib/woocommerce";
import { getWooCommerceCategories, resolveSlugsToIds } from "@/lib/woocommerce-categories";
import { getWooCommerceAttributes, WooAttribute, type FacetCounts } from "@/lib/woocommerce-attributes";
import { buildCategoryTree, getDescendantSlugs } from "@/lib/category-data";
import { withCatalogueCategories, findCategoryTitle, liveSlug } from "@/lib/category-fallback";
import { decodeEntities } from "@/lib/html";
import { getPricing, normalizeTerm } from "@/lib/product-utils";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid, MappedProduct } from "@/components/products/ProductGrid";
import { FilterProvider } from "@/components/products/FilterProvider";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { ActiveFiltersGrouped } from "@/components/products/ActiveFiltersGrouped";
import { ProductPagination } from "@/components/products/ProductPagination";

// Products per page. Rendering the whole catalogue at once made the page over 1 MB.
const PAGE_SIZE = 24;

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
  const dynamicCategoryTree = withCatalogueCategories(buildCategoryTree(wooCategories));

  // Old or alternative category slugs (e.g. ?cat=weighing-scale once WordPress calls it "weighing")
  // go to the URL with the slugs WordPress uses now, so filters and highlighting match.
  const renamed = (["cat", "sub", "child"] as const).filter((k) => {
    const v = str(k);
    return v && liveSlug(dynamicCategoryTree, v) !== v;
  });
  if (renamed.length) {
    const qs = new URLSearchParams();
    Object.entries(resolvedParams).forEach(([k, v]) => {
      if (typeof v === "string") qs.set(k, renamed.includes(k as never) ? liveSlug(dynamicCategoryTree, v) : v);
    });
    redirect(`/products?${qs.toString()}`);
  }

  // 2. Category filter (selected category + all of its descendants)
  const activeSlug = childParam ?? subParam ?? catParam;
  const activeCategoryName = activeSlug
    ? decodeEntities(wooCategories.find((c) => c.slug === activeSlug)?.name) ||
      findCategoryTitle(dynamicCategoryTree, activeSlug) ||
      activeSlug
    : null;

  // Only the fields the listing uses: full product objects (descriptions etc.) are ~10x larger.
  let categoryMissing = false;
  let wcQuery = "status=publish&_fields=id,name,type,price,regular_price,sale_price,price_html,images,categories,attributes";
  if (activeSlug) {
    const slugsToLookup = Array.from(new Set([activeSlug, ...getDescendantSlugs(wooCategories, activeSlug)]));
    const categoryIds = await resolveSlugsToIds(slugsToLookup);
    // A catalogue category that doesn't exist in WordPress yet has no products (rather than all of them).
    if (categoryIds.length > 0) wcQuery += `&category=${categoryIds.join(",")}`;
    else categoryMissing = true;
  }
  if (searchParam) wcQuery += `&search=${encodeURIComponent(searchParam)}`;
  if (sortParam === "price-asc") wcQuery += `&orderby=price&order=asc`;
  else if (sortParam === "price-desc") wcQuery += `&orderby=price&order=desc`;
  else if (sortParam === "date-desc") wcQuery += `&orderby=date&order=desc`;
  else if (sortParam === "title-asc") wcQuery += `&orderby=title&order=asc`;
  // Default: the order saved in WooCommerce (each product's menu order, set from the catalogue sheet).
  else wcQuery += `&orderby=menu_order&order=asc`;

  // 3. Fetch every matching product (not just the first 100)
  let products: any[] = [];
  try {
    if (!categoryMissing) products = await fetchAllWooCommerce(`products?${wcQuery}`);
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
      image: p.images?.[0]?.src || "",
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

  // 8. Pagination
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Math.floor(Number(str("page")) || 1)), totalPages);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const mappedProducts: MappedProduct[] = filtered
    .slice(firstIndex, firstIndex + PAGE_SIZE)
    .map(({ termNames, ...rest }) => rest);

  const pageQuery: Record<string, string> = {};
  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (typeof v === "string" && k !== "page") pageQuery[k] = v;
  });

  return (
    <FilterProvider>
      <main className="min-h-screen bg-muted">
        <Navbar />

        <PageHero
          crumbs={
            activeCategoryName
              ? [{ label: "Products", href: "/products" }, { label: activeCategoryName }]
              : [{ label: "Products" }]
          }
          title={searchParam ? `Results for “${searchParam}”` : activeCategoryName ?? "Every machine we sell,"}
          accent={searchParam || activeCategoryName ? undefined : "in one place."}
          intro="Weighing, billing, printing, counting, sealing, labelling and filling equipment from 50+ brands. Prices include GST."
        />

        <div className="container mx-auto py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28">
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
                  {totalPages > 1
                    ? `Showing ${firstIndex + 1}–${firstIndex + mappedProducts.length} of ${totalCount} products`
                    : `${totalCount} ${totalCount === 1 ? "product" : "products"} found`}
                </div>
              </div>

              {/* Active Filters */}
              <ActiveFiltersGrouped attributes={attributes} categoryLabel={activeCategoryName} />

              <ProductGrid products={mappedProducts} />

              <ProductPagination currentPage={currentPage} totalPages={totalPages} query={pageQuery} />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </FilterProvider>
  );
}
