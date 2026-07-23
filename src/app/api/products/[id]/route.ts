import { NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";

function extractSpecs(metaData: any[] = []) {
  const specMeta = metaData.find((m: any) => m.key === "technical_specifications");
  return specMeta ? specMeta.value : null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wcProduct = await fetchWooCommerce(`products/${id}`);
    
    const product = {
      ...wcProduct,
      technical_specifications: extractSpecs(wcProduct.meta_data),
    };

    let variations = [];
    if (product.type === "variable" || product.variations?.length > 0) {
      const wcVariations = await fetchWooCommerce(`products/${id}/variations?per_page=100`);
      variations = wcVariations.map((v: any) => ({
        ...v,
        technical_specifications: extractSpecs(v.meta_data),
      }));
    }

    return NextResponse.json({ product, variations });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("WooCommerce API Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
