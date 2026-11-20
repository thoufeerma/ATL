"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  ChevronRight,
  Download,
  Droplets,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Printer,
  Receipt,
  Scale,
  ScanBarcode,
  ShieldCheck,
  Tag,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { decodeEntities } from "@/lib/html";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsappLink } from "@/lib/contact";

export interface RelatedProduct {
  id: number;
  name: string;
  price: number | null;
  image: string | null;
  spec: string | null;
}

type Attr = { id?: number; name: string; variation: boolean; options: string[] };

/* ----------------------------- helpers ----------------------------- */

const UNIT_FACTOR: Record<string, number> = { mg: 1e-6, g: 1e-3, gm: 1e-3, kg: 1, t: 1e3, ton: 1e3, tons: 1e3 };

function magnitude(value: string) {
  const m = value.trim().match(/^([\d.]+)\s*([a-zA-Z]+)?/);
  if (!m) return NaN;
  return parseFloat(m[1]) * (UNIT_FACTOR[m[2]?.toLowerCase() ?? ""] ?? 1);
}

// "15 kg, 20 kg, 3 kg" -> "3 kg, 15 kg, 20 kg" (unit-aware, falls back to natural sort)
function sortOptions(options: string[]) {
  return [...options].sort((a, b) => {
    const x = magnitude(a);
    const y = magnitude(b);
    if (!Number.isNaN(x) && !Number.isNaN(y) && x !== y) return x - y;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

// Resolves an attribute to display text. Options written as "3 kg: 0.1 g" are
// treated as a lookup keyed by another selected attribute (e.g. accuracy per capacity).
function resolveAttribute(attr: Attr, selected: Record<string, string>, unresolvedLabel?: string) {
  const options = attr.options.map(decodeEntities);
  if (attr.variation) {
    return selected[attr.name] ?? sortOptions(options).join(" / ");
  }
  const keyed = options.map((o) => o.match(/^(.+?):\s+(.+)$/));
  if (keyed.length > 1 && keyed.every(Boolean)) {
    for (const value of Object.values(selected)) {
      const hit = keyed.find((k) => k![1].trim().toLowerCase() === value.toLowerCase());
      if (hit) return hit[2];
    }
    return unresolvedLabel ?? options.join(" · ");
  }
  return options.join(", ");
}

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function iconFor(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (/barcode|scanner/.test(t)) return ScanBarcode;
  if (/print|label/.test(t)) return Printer;
  if (/scale|weigh|balance|platform|crane/.test(t)) return Scale;
  if (/bill|pos|touch|keypad|android|windows|cash|drawer/.test(t)) return Receipt;
  if (/count|currency|coin|note/.test(t)) return Banknote;
  if (/fill|liquid|milk|paste/.test(t)) return Droplets;
  if (/coder|inkjet|tag/.test(t)) return Tag;
  return Package;
}

const isNoValue = (v?: string) => !v || /^(no brand|generic|n\/a|none|-)$/i.test(v.trim());

/* ----------------------------- pieces ----------------------------- */

// Shown when WooCommerce has no photo: a calm measuring-grid surface rather than a stock image.
function NoPhoto({ icon: Icon, sku, compact = false }: { icon: LucideIcon; sku?: string; compact?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: compact ? "18px 18px" : "28px 28px",
        }}
      />
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-white border border-border shadow-[0_10px_30px_-12px_rgba(31,41,55,0.25)] ${
          compact ? "w-14 h-14" : "w-24 h-24"
        }`}
      >
        <Icon className={compact ? "w-7 h-7 text-secondary/70" : "w-11 h-11 text-secondary/70"} strokeWidth={1.4} />
      </div>
      {!compact && (
        <p className="relative mt-5 text-sm font-medium text-muted-foreground">Product photo coming soon</p>
      )}
      {!compact && sku && (
        <span className="absolute bottom-4 left-5 font-mono text-[11px] tracking-wide text-muted-foreground/80">
          {sku}
        </span>
      )}
    </div>
  );
}

/* ----------------------------- page ----------------------------- */

export default function ProductDetailClient({
  product,
  variations,
  related = [],
}: {
  product: any;
  variations: any[];
  related?: RelatedProduct[];
}) {
  const [mainImg, setMainImg] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const name = decodeEntities(product.name);
  const sku: string | undefined = product.sku || undefined;
  const category = product.categories?.[0]
    ? { name: decodeEntities(product.categories[0].name), slug: product.categories[0].slug as string }
    : null;
  const CategoryIcon = iconFor(`${category?.name ?? ""} ${category?.slug ?? ""} ${name}`);

  const attributes: Attr[] = product.attributes ?? [];
  const variationAttrs = attributes.filter((a) => a.variation);
  const brandAttr = attributes.find((a) => /^brand$/i.test(a.name));
  const warrantyAttr = attributes.find((a) => /warranty/i.test(a.name));
  const brand =
    decodeEntities(product.brands?.[0]?.name) ||
    (brandAttr && !isNoValue(brandAttr.options[0]) ? decodeEntities(brandAttr.options[0]) : "");

  const selectedVariation = useMemo(
    () =>
      variationAttrs.length > 0
        ? variations.find((v) =>
            v.attributes.every((a: any) => selected[a.name] === decodeEntities(a.option))
          )
        : undefined,
    [variations, selected, variationAttrs.length]
  );

  /* price */
  const variationPrices = variations.map((v) => Number(v.price)).filter((p) => p > 0);
  const minPrice = variationPrices.length ? Math.min(...variationPrices) : null;
  const maxPrice = variationPrices.length ? Math.max(...variationPrices) : null;
  const basePrice = Number(selectedVariation?.price ?? product.price) || null;
  const showFrom = !selectedVariation && minPrice !== null && maxPrice !== null && minPrice !== maxPrice;
  const displayPrice = showFrom ? minPrice : basePrice;

  /* images */
  const images: string[] = (product.images ?? []).map((img: any) => img.src);
  const variationImage: string | undefined = selectedVariation?.image?.src;
  const activeImage = variationImage && !images.includes(variationImage) ? variationImage : images[mainImg];

  /* specs */
  const keySpecs = attributes
    .filter((a) => !a.variation && a !== brandAttr && a !== warrantyAttr)
    .slice(0, 4)
    .map((a) => ({
      label: decodeEntities(a.name),
      value: resolveAttribute(
        a,
        selected,
        variationAttrs[0] ? `Varies by ${decodeEntities(variationAttrs[0].name)}` : undefined
      ),
    }));

  const specRows = [
    ...attributes
      .filter((a) => a !== brandAttr)
      .map((a) => ({ label: decodeEntities(a.name), value: resolveAttribute(a, selected) })),
    ...(brand ? [{ label: "Brand", value: brand }] : []),
    ...(category ? [{ label: "Category", value: category.name }] : []),
    ...(sku ? [{ label: "Model / SKU", value: sku, mono: true }] : []),
  ];

  // Legacy "Label: value | Label: value" spec meta, if a product still has it.
  const legacySpecs: string | null = selectedVariation?.technical_specifications ?? product.technical_specifications;
  if (legacySpecs) {
    legacySpecs.split("|").forEach((s) => {
      const [label, ...rest] = s.split(":");
      const value = rest.join(":").trim();
      if (label?.trim() && value && !specRows.some((r) => r.label.toLowerCase() === label.trim().toLowerCase())) {
        specRows.push({ label: label.trim(), value });
      }
    });
  }

  /* enquiry */
  const chosen = Object.values(selected);
  const enquiryName = chosen.length ? `${name} (${chosen.join(", ")})` : name;
  const enquiryMessage = `Hi, I would like to enquire about ${enquiryName}${sku ? ` – ${sku}` : ""}.`;

  const brochure: string | undefined =
    product.meta_data?.find((m: any) => /brochure/i.test(m.key) && typeof m.value === "string" && m.value.startsWith("http"))?.value ??
    product.downloads?.[0]?.file;

  /* assurances: keep site-wide promises, but never contradict the product's own warranty */
  const warrantyValue = warrantyAttr ? decodeEntities(warrantyAttr.options[0]) : "";
  const warrantyLabel = !warrantyAttr ? "1-Year Warranty" : /^no\b/i.test(warrantyValue) ? null : `${warrantyValue} warranty`;
  const assurances = [
    { icon: Wrench, label: "Free Installation" },
    ...(warrantyLabel ? [{ icon: ShieldCheck, label: warrantyLabel }] : []),
    { icon: MapPin, label: "Kerala-wide Service" },
  ];

  const hasAttrs = attributes.length > 0;
  const description: string = product.description?.trim() ?? "";
  const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

  return (
    <div className="pt-28 pb-24 selection:bg-primary/15">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li aria-hidden><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
            {category && (
              <>
                <li aria-hidden><ChevronRight className="w-3.5 h-3.5" /></li>
                <li>
                  <Link href={`/products?cat=${category.slug}`} className="hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden><ChevronRight className="w-3.5 h-3.5" /></li>
            <li aria-current="page" className="text-foreground font-medium truncate max-w-[16rem]">{name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-8 lg:gap-12 xl:gap-16">
          {/* ---------- Media ---------- */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="relative aspect-[5/4] rounded-3xl overflow-hidden bg-white border border-border">
              {activeImage ? (
                <img src={activeImage} alt={name} className="absolute inset-0 w-full h-full object-contain p-8 md:p-12" />
              ) : (
                <NoPhoto icon={CategoryIcon} sku={sku} />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setMainImg(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={activeImage === img}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border transition-colors ${focusRing} ${
                      activeImage === img ? "border-primary ring-1 ring-primary" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Buy box ---------- */}
          <div className="min-w-0">
            <h1 className="font-heading text-3xl md:text-4xl xl:text-[2.75rem] xl:leading-[1.1] font-extrabold tracking-tight text-foreground text-balance">
              {name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
              {brand && (
                <span>
                  by <span className="font-semibold text-foreground">{brand}</span>
                </span>
              )}
              {brand && category && <span aria-hidden className="w-1 h-1 rounded-full bg-border" />}
              {category && (
                <Link href={`/products?cat=${category.slug}`} className="hover:text-primary transition-colors">
                  {category.name}
                </Link>
              )}
              {sku && (
                <>
                  <span aria-hidden className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-mono text-xs tracking-wide">{sku}</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {displayPrice ? (
                <>
                  {showFrom && <span className="text-sm font-semibold text-muted-foreground">From</span>}
                  <span className="font-heading text-4xl font-extrabold text-primary tabular-nums tracking-tight">
                    {formatINR(displayPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground">Excl. GST</span>
                </>
              ) : (
                <span className="font-heading text-2xl font-bold text-foreground">Price on request</span>
              )}
            </div>

            {/* Variation selector */}
            {variationAttrs.map((attr) => {
              const current = selected[attr.name];
              return (
                <fieldset key={attr.id ?? attr.name} className="mt-8">
                  <legend className="flex w-full items-baseline justify-between text-sm">
                    <span className="font-semibold text-foreground">{decodeEntities(attr.name)}</span>
                    <span className="text-muted-foreground">{current ?? "Select an option"}</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sortOptions(attr.options.map(decodeEntities)).map((opt) => {
                      const isSelected = current === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            setSelected((prev) => {
                              const next = { ...prev };
                              if (isSelected) delete next[attr.name];
                              else next[attr.name] = opt;
                              return next;
                            })
                          }
                          className={`h-11 min-w-[4.5rem] px-4 rounded-xl border text-sm font-semibold tabular-nums transition-colors ${focusRing} ${
                            isSelected
                              ? "border-primary bg-primary/[0.06] text-primary ring-1 ring-primary"
                              : "border-border bg-white text-foreground hover:border-foreground/40"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

            {/* Key specs */}
            {keySpecs.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {keySpecs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`bg-white px-4 py-3.5 ${keySpecs.length % 2 === 1 && i === keySpecs.length - 1 ? "col-span-2" : ""}`}
                  >
                    <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                    <dd className="mt-1 text-[15px] font-semibold text-foreground tabular-nums leading-snug">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Short description only when there are no structured attributes (it duplicates them otherwise) */}
            {!hasAttrs && product.short_description && (
              <div
                className="mt-6 text-muted-foreground leading-relaxed [&_li]:mt-1 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* CTAs */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto] gap-3 whitespace-nowrap">
              <a
                href={whatsappLink(enquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-base font-bold text-white shadow-[0_10px_24px_-10px_rgba(37,211,102,0.7)] transition-colors hover:bg-[#1fb857] ${focusRing}`}
              >
                <MessageCircle className="w-5 h-5" /> Enquire on WhatsApp
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className={`inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 text-base font-semibold text-foreground transition-colors hover:border-foreground/40 ${focusRing}`}
              >
                <Phone className="w-4 h-4" /> Call us
              </a>
            </div>

            {brochure && (
              <a
                href={brochure}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-primary hover:text-primary transition-colors ${focusRing}`}
              >
                <Download className="w-4 h-4" /> Download brochure
              </a>
            )}

            {/* Assurances */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
              {assurances.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-foreground">
                  <Icon className="w-4 h-4 flex-shrink-0 text-primary" strokeWidth={2.25} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Details ---------- */}
        <div className="mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-10 xl:gap-16">
          <div className="min-w-0 space-y-14">
            {description && (
              <section>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Overview</h2>
                <div
                  className="mt-5 max-w-[68ch] text-muted-foreground leading-relaxed space-y-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-foreground [&_h2]:font-bold [&_h3]:text-foreground [&_h3]:font-bold [&_img]:rounded-2xl [&_img]:border [&_img]:border-border [&_img]:bg-white [&_img]:mx-auto [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </section>
            )}

            <section>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Specifications</h2>
                {variationAttrs.length > 0 && !selectedVariation && (
                  <p className="text-sm text-muted-foreground hidden sm:block">Select an option above for exact values</p>
                )}
              </div>
              {specRows.length > 0 ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
                  <table className="w-full text-[15px]">
                    <tbody>
                      {specRows.map((row, i) => (
                        <tr key={`${row.label}-${i}`} className="border-b border-border last:border-0">
                          <th scope="row" className="w-2/5 sm:w-1/3 px-5 md:px-6 py-4 text-left align-top font-medium text-muted-foreground">
                            {row.label}
                          </th>
                          <td
                            className={`px-5 md:px-6 py-4 align-top font-semibold text-foreground tabular-nums ${
                              "mono" in row && row.mono ? "font-mono text-sm tracking-wide" : ""
                            }`}
                          >
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-5 text-muted-foreground">
                  Detailed specifications for this model are available on request.
                </p>
              )}
            </section>
          </div>

          {/* Advice */}
          <aside className="lg:sticky lg:top-28 self-start rounded-3xl bg-secondary p-7 text-white">
            <h3 className="font-heading text-xl font-bold">Need Expert Advice?</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
              Our engineers help you choose the right solution for your business.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/90 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              Get Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> {PHONE_DISPLAY}
            </a>
          </aside>
        </div>

        {/* ---------- Related ---------- */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-24">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Similar products</h2>
              {category && (
                <Link
                  href={`/products?cat=${category.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/products/${item.id}`}
                    className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-[0_16px_32px_-16px_rgba(31,41,55,0.25)] ${focusRing}`}
                  >
                    <div className="relative aspect-[4/3] border-b border-border">
                      {item.image ? (
                        <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-contain p-4" />
                      ) : (
                        <NoPhoto icon={CategoryIcon} compact />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      {item.spec && <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{item.spec}</p>}
                      <p className="mt-auto pt-3 font-heading text-lg font-extrabold text-primary tabular-nums">
                        {item.price ? formatINR(item.price) : "Price on request"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
