import Navbar from "@/components/layout/Navbar";
import ProductDetailClient from "./ProductDetailClient";
import { fetchWooCommerce } from "@/lib/woocommerce";

function extractSpecs(metaData: any[] = []) {
  const specMeta = metaData.find((m: any) => m.key === "technical_specifications");
  return specMeta ? specMeta.value : null;
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

  let variations: any[] = [];
  if (product.type === "variable" || (product.variations && product.variations.length > 0)) {
    const wcVariations = await fetchWooCommerce(`products/${id}/variations?per_page=100`);
    variations = wcVariations.map((v: any) => ({
      ...v,
      technical_specifications: extractSpecs(v.meta_data),
    }));
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <ProductDetailClient product={product} variations={variations} />
    </main>
  );
}
