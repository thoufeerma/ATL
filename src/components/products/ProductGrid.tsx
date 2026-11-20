import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCardActions } from "./ProductCardActions";
import { formatINR } from "@/lib/product-utils";

export interface MappedProduct {
  id: number;
  name: string;
  category: string;
  sub: string;
  brand: string;
  price: number;
  mrp?: number | null; // regular price, shown struck through when above the selling price
  image: string;
  capacity: string;
  accuracy: string;
}

export function ProductGrid({ products }: { products: MappedProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground bg-white border border-border rounded-2xl">
        <p className="text-lg font-medium">No products found matching your filters.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/products">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {products.map(product => (
        <div key={product.id} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative h-52 bg-muted overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <ProductCardActions productId={product.id} />
            {product.brand !== "Generic" && (
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-full">{product.brand}</span>
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{product.sub}</p>
            <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
            {product.capacity !== "-" && (
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <span>Capacity: <strong className="text-foreground">{product.capacity}</strong></span>
                <span>Accuracy: <strong className="text-foreground">{product.accuracy}</strong></span>
              </div>
            )}
            <div className="mb-4">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xl font-extrabold text-primary tabular-nums">
                  {product.price > 0 ? formatINR(product.price) : "Price on request"}
                </span>
                {product.mrp && (
                  <span className="text-sm text-muted-foreground tabular-nums">
                    MRP <s>{formatINR(product.mrp)}</s>
                  </span>
                )}
              </div>
              {product.price > 0 && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Incl. GST
                  {product.mrp && (
                    <span className="font-semibold text-emerald-700"> · Save {formatINR(product.mrp - product.price)}</span>
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button asChild size="sm" variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm py-2">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
