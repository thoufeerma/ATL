"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Filter, ChevronRight, Heart, BarChart2, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { useCartStore } from "@/lib/cartStore";

interface Product {
  id: number;
  name: string;
  category: string;
  sub: string;
  brand: string;
  price: number;
  image: string;
  capacity: string;
  accuracy: string;
}

export default function ProductsPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        
        // Map WooCommerce products to our UI format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.categories?.[0]?.name || "Uncategorized",
          sub: "Store Item",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          brand: p.attributes?.find((a: any) => a.name === "Brand")?.options?.[0] || "Generic",
          price: parseFloat(p.price || "0"),
          image: p.images?.[0]?.src || "https://placehold.co/600x600/18181b/52525b?text=No+Image",
          capacity: "-",
          accuracy: "-"
        }));
        setProducts(mapped);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addItem = useCartStore(state => state.addItem);

  const filtered = products.filter(p => {
    const catMatch = selectedCat === "All" || p.category === selectedCat;
    const brandMatch = selectedBrand === "All" || p.brand === selectedBrand;
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && brandMatch && searchMatch;
  });

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ["All", ...Array.from(new Set(products.map(p => p.brand)))];

  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleCompare = (id: number) => setCompare(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);

  return (
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">All Products</h1>
          <p className="text-zinc-300 text-lg font-light max-w-2xl">
            Browse our complete range of precision weighing, billing, packaging & automation solutions from your WooCommerce store.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-lg mx-auto text-center mt-10">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Connection Error</h2>
            <p className="text-foreground">{error}</p>
            <p className="mt-4 text-sm text-muted-foreground">Make sure your `.env.local` keys are correct and you&apos;ve restarted your dev server.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="text-lg font-medium">Loading products from WooCommerce...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" /> Filters
                  </h3>

                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((c: string) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCat(c)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCat === c ? "bg-primary text-white" : "text-foreground hover:bg-muted"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Brand</h4>
                    <div className="space-y-2">
                      {brands.map((b: string) => (
                        <button
                          key={b}
                          onClick={() => setSelectedBrand(b)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedBrand === b ? "bg-primary text-white" : "text-foreground hover:bg-muted"}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium"
                  />
                </div>
                <div className="text-sm text-muted-foreground font-semibold">
                  {filtered.length} products found
                </div>
              </div>

              {/* Compare Bar */}
              {compare.length > 0 && (
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between">
                  <span className="font-semibold text-primary">{compare.length} products selected for comparison</span>
                  <Button size="sm" className="bg-primary text-white rounded-full hover:bg-primary/90">
                    Compare Now <BarChart2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-white border border-border rounded-2xl">
                  <p className="text-lg font-medium">No products found matching your filters.</p>
                  <Button variant="link" onClick={() => { setSelectedCat("All"); setSelectedBrand("All"); setSearch(""); }} className="mt-2">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.map(product => (
                    <div key={product.id} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="relative h-52 bg-muted overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${wishlist.includes(product.id) ? "bg-primary border-primary text-white" : "bg-white/80 border-white/50 text-foreground hover:bg-primary hover:text-white"}`}
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCompare(product.id)}
                            className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${compare.includes(product.id) ? "bg-primary border-primary text-white" : "bg-white/80 border-white/50 text-foreground hover:bg-primary hover:text-white"}`}
                          >
                            <BarChart2 className="w-4 h-4" />
                          </button>
                        </div>
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
                        <div className="flex items-baseline justify-between mb-4">
                          <span className="text-xl font-extrabold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                          <span className="text-xs text-muted-foreground font-semibold">Excl. GST</span>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline" className="flex-1 rounded-full border-border hover:bg-muted text-foreground font-semibold text-xs py-2">
                              <Link href={`/products/${product.id}`}>Details</Link>
                            </Button>
                            <Button
                              onClick={() => addItem(product)}
                              size="sm"
                              variant="outline"
                              className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-white font-semibold text-xs py-2 gap-1 cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Cart
                            </Button>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold text-xs py-2"
                          >
                            <Link href={`/checkout?buyNow=${product.id}`}>Buy Now</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
