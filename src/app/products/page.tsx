import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { resolveSlugsToIds } from "@/lib/woocommerce-categories";
import { getWooCommerceAttributes } from "@/lib/woocommerce-attributes";
import { categoryTree, getDescendantSlugs } from "@/lib/category-data";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid, MappedProduct } from "@/components/products/ProductGrid";
import { FilterProvider } from "@/components/products/FilterProvider";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { ActiveFiltersGrouped } from "@/components/products/ActiveFiltersGrouped";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const catParam = typeof resolvedParams.cat === 'string' ? resolvedParams.cat : undefined;
  const subParam = typeof resolvedParams.sub === 'string' ? resolvedParams.sub : undefined;
  const childParam = typeof resolvedParams.child === 'string' ? resolvedParams.child : undefined;
  const searchParam = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  const minPriceParam = typeof resolvedParams.min_price === 'string' ? resolvedParams.min_price : undefined;
  const maxPriceParam = typeof resolvedParams.max_price === 'string' ? resolvedParams.max_price : undefined;
  const sortParam = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  // 1. Fetch Dynamic Attributes
  const attributes = await getWooCommerceAttributes();

  // 2. Resolve Category Filters
  let activeSlug = undefined;
  if (childParam) activeSlug = childParam;
  else if (subParam) activeSlug = subParam;
  else if (catParam) activeSlug = catParam;

  let wcQuery = "";
  if (activeSlug) {
    const descendantSlugs = getDescendantSlugs(activeSlug);
    const slugsToLookup = Array.from(new Set([activeSlug, ...descendantSlugs]));
    const categoryIds = await resolveSlugsToIds(slugsToLookup);
    if (categoryIds.length > 0) {
      wcQuery += `&category=${categoryIds.join(",")}`;
    }
  }

  // 3. Construct WC Query (Search, Price, Sort)
  if (searchParam) wcQuery += `&search=${encodeURIComponent(searchParam)}`;
  if (minPriceParam) wcQuery += `&min_price=${minPriceParam}`;
  if (maxPriceParam) wcQuery += `&max_price=${maxPriceParam}`;

  if (sortParam) {
    if (sortParam === "price-asc") wcQuery += `&orderby=price&order=asc`;
    else if (sortParam === "price-desc") wcQuery += `&orderby=price&order=desc`;
    else if (sortParam === "date-desc") wcQuery += `&orderby=date&order=desc`;
    else if (sortParam === "title-asc") wcQuery += `&orderby=title&order=asc`;
  }

  // 4. Fetch Products
  let endpoint = `products?per_page=100${wcQuery}`;
  let products = [];
  try {
    products = await fetchWooCommerce(endpoint);
  } catch (err) {
    console.error("Failed fetching products:", err);
  }

  // 5. Map Products
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mappedProducts: MappedProduct[] = products.map((p: any) => {
    // Extract capacity specifically if needed for UI mapping, else keep generic
    return {
      id: p.id,
      name: p.name,
      category: p.categories?.[0]?.name || "Uncategorized",
      sub: "Store Item",
      // Optional: you can extract a specific attribute if you still want to display it on the card
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      brand: p.attributes?.find((a: any) => a.name.toLowerCase() === "brand")?.options?.[0] || "Generic",
      price: parseFloat(p.price || "0"),
      image: p.images?.[0]?.src || "https://placehold.co/600x600/18181b/52525b?text=No+Image",
      capacity: "-",
      accuracy: "-",
      rawAttributes: p.attributes || [] // keep this for local filtering
    };
  });

  // 6. Local Attribute Filtering
  // WC REST API v3 doesn't support multiple different attributes in one query easily (only one `attribute` param is reliably supported).
  // So we filter dynamic attributes locally.
  attributes.forEach(attr => {
    const paramValue = resolvedParams[attr.slug];
    const activeTermsStr = typeof paramValue === 'string' ? paramValue : undefined;
    if (activeTermsStr) {
      const activeTerms = activeTermsStr.split(",");
      mappedProducts = mappedProducts.filter(p => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productAttr = (p as any).rawAttributes?.find((pa: any) => pa.id === attr.id || pa.name === attr.name);
        if (!productAttr) return false;
        // Check if product has at least one of the selected terms
        // options is an array of term names
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return productAttr.options.some((opt: string) => 
          activeTerms.some((slug: string) => {
            const termObj = attr.terms.find(t => t.slug === slug);
            return termObj && termObj.name === opt;
          })
        );
      });
    }
  });

  // Calculate dynamic price bounds from catalog (ideally from DB, but derived from fetched here)
  const maxPrice = mappedProducts.reduce((max, p) => p.price > max ? p.price : max, 50000);
  const minPrice = 0; // Usually 0

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
                  categoryTree={categoryTree} 
                  attributes={attributes} 
                  priceBounds={{ min: minPrice, max: maxPrice }} 
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
                    categoryTree={categoryTree} 
                    attributes={attributes} 
                    priceBounds={{ min: minPrice, max: maxPrice }} 
                  />
                </MobileFilterDrawer>

                <div className="text-sm text-muted-foreground font-semibold lg:ml-auto">
                  {mappedProducts.length} products found
                </div>
              </div>

              {/* Active Filters */}
              <ActiveFiltersGrouped attributes={attributes} />

              <ProductGrid products={mappedProducts} />
            </div>
          </div>
        </div>
      </main>
    </FilterProvider>
  );
}
