"use client";

import Link from "next/link";
import { ChevronRight, Download, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function parseSpecs(specString: string | null | undefined) {
  if (!specString) return [];
  return specString.split("|").map(s => {
    const [label, ...valueParts] = s.split(":");
    return { label: label?.trim() || "", value: valueParts.join(":").trim() || "" };
  }).filter(s => s.label && s.value);
}

export default function ProductDetailClient({ product, variations }: { product: any, variations: any[] }) {
  const [mainImg, setMainImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Variation state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Find variation matching selected attributes
  const selectedVariation = variations.find(v => {
    return v.attributes.every((attr: any) => selectedAttributes[attr.name] === attr.option);
  });

  // Fallback logic for specs
  const specString = selectedVariation?.technical_specifications ?? product.technical_specifications;
  const parsedSpecs = parseSpecs(specString);

  // Extract images
  const productImages = product.images?.length > 0 
    ? product.images.map((img: any) => img.src)
    : ["https://images.unsplash.com/photo-1594897030264-ab7d87efc473?q=80&w=800"]; // placeholder fallback
  
  // Extract price
  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const displayName = selectedVariation && Object.keys(selectedAttributes).length > 0
    ? `${product.name} - ${Object.values(selectedAttributes).join(", ")}` 
    : product.name;

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary">Products</Link><ChevronRight className="w-3 h-3" />
          {product.categories?.[0] && (
            <>
               <span className="text-muted-foreground">{product.categories[0].name}</span>
               <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-foreground font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border shadow-sm mb-4">
              <img src={productImages[mainImg]} alt={product.name} className="w-full h-full object-cover" />
              {product.categories?.[0] && (
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.categories[0].name}
                </div>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${mainImg === i ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-extrabold text-foreground mb-3">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 mt-4">
              <span className="text-3xl font-extrabold text-primary">
                {displayPrice ? `₹${displayPrice}` : "Price on request"}
              </span>
            </div>
            
            {/* Short Description */}
            {product.short_description && (
              <div 
                className="text-muted-foreground mb-8 leading-relaxed text-lg font-light" 
                dangerouslySetInnerHTML={{ __html: product.short_description }} 
              />
            )}

            {/* Variations Selector */}
            {product.attributes && product.attributes.filter((attr: any) => attr.variation).map((attr: any) => (
              <div key={attr.id || attr.name} className="mb-6">
                <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-muted-foreground">{attr.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((opt: string) => {
                    const isSelected = selectedAttributes[attr.name] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: opt }))}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-colors ${
                          isSelected 
                            ? "border-primary bg-primary text-white" 
                            : "border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3 mb-8">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-14 rounded-full bg-[#25D366] text-white text-lg font-bold hover:bg-[#20bd5a] gap-3 shadow-lg shadow-[#25D366]/20 flex items-center justify-center"
                >
                  <a href={`https://wa.me/919000000000?text=${encodeURIComponent(`Hi, I would like to enquire about ${displayName}.`)}`} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-6 h-6" /> Enquire now
                  </a>
                </Button>
              </div>

              <Button size="lg" variant="outline" className="h-12 w-full rounded-full border-border gap-2 font-semibold flex items-center justify-center bg-transparent">
                <Download className="w-4 h-4" /> Download Brochure
              </Button>
            </div>

            <div className="p-4 bg-muted/60 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">✅ Free Installation &nbsp;|&nbsp; ✅ 1-Year Warranty &nbsp;|&nbsp; ✅ Kerala-wide Service</p>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-foreground mb-6">Technical Specifications</h2>
            {parsedSpecs.length > 0 ? (
              <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                {parsedSpecs.map((spec, i) => (
                  <div key={i} className={`flex items-center px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-muted/40"}`}>
                    <span className="w-48 text-sm font-bold text-muted-foreground">{spec.label}</span>
                    <span className="text-foreground font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No technical specifications available.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-secondary text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">Need Expert Advice?</h3>
              <p className="text-zinc-300 text-sm mb-4 font-light">Our engineers help you choose the right solution for your business.</p>
              <Button className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold">Get Free Consultation</Button>
            </div>
          </div>
        </div>
        
        {/* Full Description */}
        {product.description && (
          <div className="mb-20 max-w-4xl">
             <h2 className="text-2xl font-extrabold text-foreground mb-6">Product Information</h2>
             <div 
                className="text-muted-foreground space-y-4"
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
          </div>
        )}
      </div>
    </div>
  );
}
