import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailClient, { type RelatedProduct } from "./ProductDetailClient";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { decodeEntities } from "@/lib/html";
import { getPricing } from "@/lib/product-utils";
import { getProductDownloads, stripDescriptionFiles } from "@/lib/product-downloads";

function extractSpecs(metaData: any[] = []) {
  const specMeta = metaData.find((m: any) => m.key === "technical_specifications");
  return specMeta ? specMeta.value : null;
}

async function getRelatedProducts(product: any): Promise<RelatedProduct[]> {
  const category = product.categories?.[0];
  if (!category?.id) return [];
  try {
    const fetchFor = (catId: number): Promise<any[]> =>
      fetchWooCommerce(`products?category=${catId}&exclude=${product.id}&per_page=4&status=publish&orderby=menu_order&order=asc`);

    let items = await fetchFor(category.id);
    // Too few siblings in a narrow sub-category: widen to its parent category.
    if (items.length < 2) {
      const cat = await fetchWooCommerce(`products/categories/${category.id}`).catch(() => null);
      if (cat?.parent) {
        const wider = await fetchFor(cat.parent);
        const seen = new Set(items.map((p) => p.id));
        items = [...items, ...wider.filter((p) => !seen.has(p.id))].slice(0, 4);
      }
    }
    return items.map((p) => {
      const capacity = p.attributes?.find((a: any) => /capacity/i.test(a.name));
      return {
        id: p.id,
        name: decodeEntities(p.name),
        ...getPricing(p),
        image: p.images?.[0]?.src ?? null,
        spec: capacity ? capacity.options.map(decodeEntities).join(" / ") : null,
      };
    });
  } catch (err) {
    console.error("Error fetching related products:", err);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let wcProduct = null;
  try {
    wcProduct = await fetchWooCommerce(`products/${id}`);
  } catch (err) {
    // A missing product is expected (old links); only log real failures.
    if (!String(err).includes("(404)")) console.error("Error fetching product:", err);
  }

  // A missing product answers with a real 404 (see not-found.tsx beside this file).
  if (!wcProduct || wcProduct.code === "woocommerce_rest_product_invalid_id" || wcProduct.data?.status === 404) {
    notFound();
  }

  const product = {
    ...wcProduct,
    technical_specifications: extractSpecs(wcProduct.meta_data),
  };

  const variationsPromise =
    product.type === "variable" || (product.variations && product.variations.length > 0)
      ? fetchWooCommerce(`products/${id}/variations?per_page=100`).catch((err: unknown) => {
          console.error("Error fetching variations:", err);
          return [];
        })
      : Promise.resolve([]);

  const [wcVariations, related, downloads] = await Promise.all([
    variationsPromise,
    getRelatedProducts(product),
    getProductDownloads(product),
  ]);

  const variations = (wcVariations as any[]).map((v: any) => ({
    ...v,
    technical_specifications: extractSpecs(v.meta_data),
  }));

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      {/* File links in the description are listed under "Brochures & downloads" instead. */}
      <ProductDetailClient
        product={{
          ...product,
          description: stripDescriptionFiles(product.description),
          short_description: stripDescriptionFiles(product.short_description),
        }}
        variations={variations}
        related={related}
        downloads={downloads}
      />
      <Footer />
    </main>
  );
}
