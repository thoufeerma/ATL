import Navbar from "@/components/layout/Navbar";
import ProductDetailClient, { type RelatedProduct } from "./ProductDetailClient";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { decodeEntities } from "@/lib/html";
import { getPricing } from "@/lib/product-utils";

function extractSpecs(metaData: any[] = []) {
  const specMeta = metaData.find((m: any) => m.key === "technical_specifications");
  return specMeta ? specMeta.value : null;
}

async function getRelatedProducts(product: any): Promise<RelatedProduct[]> {
  const category = product.categories?.[0];
  if (!category?.id) return [];
  try {
    const fetchFor = (catId: number): Promise<any[]> =>
      fetchWooCommerce(`products?category=${catId}&exclude=${product.id}&per_page=4&status=publish`);

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
    console.error("Error fetching product:", err);
  }

  if (!wcProduct || wcProduct.code === "woocommerce_rest_product_invalid_id" || wcProduct.data?.status === 404) {
    return (
      <main className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-32 pb-20 text-center flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
          <a href="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Browse All Products
          </a>
        </div>
      </main>
    );
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

  const [wcVariations, related] = await Promise.all([variationsPromise, getRelatedProducts(product)]);

  const variations = (wcVariations as any[]).map((v: any) => ({
    ...v,
    technical_specifications: extractSpecs(v.meta_data),
  }));

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <ProductDetailClient product={product} variations={variations} related={related} />
    </main>
  );
}
