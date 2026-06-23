import { NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";

export async function GET() {
  try {
    const products = await fetchWooCommerce("products?per_page=20");
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("WooCommerce API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
