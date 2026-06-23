import { NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";

export async function GET() {
  try {
    const products = await fetchWooCommerce("products?per_page=20");
    return NextResponse.json(products);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("WooCommerce API Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
