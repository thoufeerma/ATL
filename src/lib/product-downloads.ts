import { decodeEntities } from "./html";
import { LOCAL_BROCHURES } from "./brochures";

export type ProductDownload = {
  name: string;
  url: string;
  /** Short file type label, e.g. "PDF". */
  type: string;
};

// Custom fields that hold brochure-like files (keys starting with "_" are WordPress internals).
const FILE_KEY = /brochure|catalog|datasheet|data[-_ ]?sheet|spec[-_ ]?sheet|manual|leaflet|download/i;

const TYPES: Record<string, string> = {
  pdf: "PDF",
  doc: "Word",
  docx: "Word",
  xls: "Excel",
  xlsx: "Excel",
  csv: "CSV",
  ppt: "PowerPoint",
  pptx: "PowerPoint",
  zip: "ZIP",
  jpg: "Image",
  jpeg: "Image",
  png: "Image",
  webp: "Image",
};

function fileType(url: string) {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return TYPES[ext] ?? (ext ? ext.toUpperCase() : "File");
}

// "ATL_CA-4V-brochure.pdf" → "ATL CA 4V brochure"
function nameFromUrl(url: string) {
  const file = decodeURIComponent(url.split("?")[0].split("/").pop() ?? "");
  const base = file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
  return base || "Download";
}

// Document links in product descriptions (brochures, manuals, spec sheets).
const DOC_EXT = "pdf|docx?|xlsx?|pptx?|csv|zip";
const docUrlPattern = () => new RegExp(String.raw`https?:\/\/[^\s"'<>]+?\.(?:${DOC_EXT})(?:\?[^\s"'<>]*)?`, "gi");
const isDocUrl = (url: string) => new RegExp(String.raw`\.(?:${DOC_EXT})(?:$|[?#])`, "i").test(url.trim());
const hasDocUrl = (html: string) => docUrlPattern().test(html);
const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
// Link text that is just an instruction, not a name.
const GENERIC_TEXT = /^(download|click here|here|view|open|pdf|link)$/i;

/** File links written into a product description: links, WordPress File blocks, embeds and bare URLs. */
export function descriptionFiles(html: string | undefined): { name?: string; url: string }[] {
  if (!html) return [];
  const out: { name?: string; url: string }[] = [];
  // <a href="…pdf">Name</a>
  for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = decodeEntities(m[1]);
    if (!isDocUrl(url)) continue;
    const text = stripTags(m[2]);
    out.push({ url, name: text && !GENERIC_TEXT.test(text) && !/^https?:/i.test(text) ? text : undefined });
  }
  // <object data="…pdf">, <embed src="…pdf">, <iframe src="…pdf">
  for (const m of html.matchAll(/<(?:object|embed|iframe)\b[^>]*\b(?:data|src)=["']([^"']+)["']/gi)) {
    const url = decodeEntities(m[1]);
    if (isDocUrl(url)) out.push({ url });
  }
  // Bare URLs in the text
  for (const m of stripTags(html.replace(/<a\b[\s\S]*?<\/a>/gi, " ")).matchAll(docUrlPattern())) {
    out.push({ url: m[0] });
  }
  return out;
}

/** The description without its file links, so they show only in the downloads list. */
export function stripDescriptionFiles(html: string | undefined): string {
  if (!html) return "";
  return (
    html
      // WordPress File blocks (link, download button and any embedded preview)
      .replace(/<div\b[^>]*class=["'][^"']*wp-block-file[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<(object|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, (tag) => (hasDocUrl(tag) ? "" : tag))
      .replace(/<embed\b[^>]*>/gi, (tag) => (hasDocUrl(tag) ? "" : tag))
      .replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi, (tag, href: string) =>
        isDocUrl(decodeEntities(href)) ? "" : tag,
      )
      .replace(docUrlPattern(), "")
      // Paragraphs and list items left empty, or holding only a label like "Brochure:"
      .replace(/<(p|li)\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*(?:[^<>]{0,30}:)?(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "")
      .trim()
  );
}

const isUrl = (v: unknown): v is string => typeof v === "string" && /^(https?:\/\/|\/)/.test(v.trim());

// A Media Library file (custom fields often store its ID) → its public URL and title.
async function mediaFile(id: number): Promise<{ url: string; title?: string } | null> {
  const base = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, "");
  if (!base) return null;
  try {
    const res = await fetch(`${base}/wp-json/wp/v2/media/${id}?_fields=source_url,title`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const m = await res.json();
    return m?.source_url ? { url: m.source_url, title: decodeEntities(m.title?.rendered) || undefined } : null;
  } catch {
    return null;
  }
}

/**
 * Every brochure / manual / spec sheet for a product, from (in order): links in the product
 * description, WooCommerce downloadable files, brochure-like custom fields, and LOCAL_BROCHURES.
 */
export async function getProductDownloads(product: any): Promise<ProductDownload[]> {
  const found: { name?: string; url: string }[] = [
    ...descriptionFiles(product.description),
    ...descriptionFiles(product.short_description),
  ];

  for (const d of product.downloads ?? []) {
    if (isUrl(d?.file)) found.push({ name: decodeEntities(d.name) || undefined, url: d.file });
  }

  for (const m of product.meta_data ?? []) {
    if (typeof m?.key !== "string" || m.key.startsWith("_") || !FILE_KEY.test(m.key)) continue;
    const values: unknown[] = Array.isArray(m.value) ? m.value : [m.value];
    for (const v of values) {
      if (typeof v === "string") {
        // One link, or several separated by commas / new lines.
        v.split(/[\n,]+/).map((s) => s.trim()).filter(isUrl).forEach((url) => found.push({ url }));
        if (/^\d+$/.test(v.trim())) {
          const media = await mediaFile(Number(v));
          if (media) found.push({ name: media.title, url: media.url });
        }
      } else if (typeof v === "number") {
        const media = await mediaFile(v);
        if (media) found.push({ name: media.title, url: media.url });
      } else if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        const url = [o.url, o.file, o.source_url].find(isUrl);
        if (url) found.push({ name: typeof o.title === "string" ? o.title : typeof o.name === "string" ? o.name : undefined, url });
      }
    }
  }

  const local = LOCAL_BROCHURES[product.sku] ?? LOCAL_BROCHURES[product.slug] ?? [];
  local.forEach((f) => found.push({ name: f.name, url: f.file }));

  // One entry per file, keeping the first name given for it.
  const byUrl = new Map<string, { name?: string; url: string }>();
  for (const f of found) {
    const prev = byUrl.get(f.url);
    if (!prev) byUrl.set(f.url, { ...f });
    else if (!prev.name && f.name) prev.name = f.name;
  }
  return [...byUrl.values()].map((f) => ({ name: f.name?.trim() || nameFromUrl(f.url), url: f.url, type: fileType(f.url) }));
}
