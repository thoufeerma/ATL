import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Page numbers to show: always first, last, and the current page's neighbours.
function pageList(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(p - sorted[i - 1] === 2 ? p - 1 : "gap");
    out.push(p);
  });
  return out;
}

export function ProductPagination({
  currentPage,
  totalPages,
  query,
}: {
  currentPage: number;
  totalPages: number;
  query: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const href = (page: number) => {
    const params = new URLSearchParams(query);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const base = "inline-flex items-center justify-center h-10 min-w-10 rounded-lg text-sm font-semibold transition-colors";
  const idle = "border border-border bg-white text-foreground hover:border-primary/40 hover:text-primary";
  const disabled = "border border-border bg-white text-muted-foreground/40 pointer-events-none";

  return (
    <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className={`${base} ${idle} px-3 gap-1`} rel="prev">
          <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span aria-hidden className={`${base} ${disabled} px-3 gap-1`}>
          <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {pageList(currentPage, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">…</span>
        ) : p === currentPage ? (
          <span key={p} aria-current="page" className={`${base} bg-primary text-primary-foreground px-3`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={href(p)} className={`${base} ${idle} px-3`} aria-label={`Page ${p}`}>
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className={`${base} ${idle} px-3 gap-1`} rel="next">
          <span className="hidden sm:inline">Next</span> <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span aria-hidden className={`${base} ${disabled} px-3 gap-1`}>
          <span className="hidden sm:inline">Next</span> <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
