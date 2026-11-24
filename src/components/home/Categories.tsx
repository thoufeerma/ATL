import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getWooCommerceCategories } from "@/lib/woocommerce-categories";
import { buildCategoryTree, type CategoryNode } from "@/lib/category-data";
import { withCatalogueCategories } from "@/lib/category-fallback";
import { categoryImage } from "@/lib/category-images";
import SectionHeader from "./SectionHeader";
import Reveal from "@/components/motion/Reveal";
import SpotlightCard from "@/components/motion/SpotlightCard";




// Bento layout: the first range is the big tile, the last one spans two columns.
function tileClass(i: number, total: number) {
  if (i === 0) return "col-span-2 lg:row-span-2";
  if (i === total - 1) return "col-span-2";
  return "";
}

export default async function Categories() {
  const tree = withCatalogueCategories(buildCategoryTree(await getWooCommerceCategories()));
  // Photos are keyed by catalogue slug, so a range keeps its photo whatever WordPress calls it.
  const ranges = tree
    .map((c) => ({ ...c, image: categoryImage(c.slug) }))
    .filter((c): c is CategoryNode & { image: string } => !!c.image);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto">
        <SectionHeader
          title={<>Everything you weigh, bill, pack and label.</>}
          intro="Eight product ranges from one supplier, with installation and service included."
          link={{ href: "/products", text: "Browse all products" }}
        />

        <ul className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-3 sm:gap-4">
          {ranges.map((cat, i) => {
            const children = cat.children ?? [];
            const big = i === 0;
            const shown = children.slice(0, big ? 5 : 3).map((c) => c.title);
            const more = children.length - shown.length;
            return (
              <Reveal as="li" key={cat.slug} delay={(i % 4) * 0.06} className={tileClass(i, ranges.length)}>
                <SpotlightCard className="h-full rounded-2xl bg-secondary" color="rgba(255,255,255,0.14)">
                  <Link href={`/products?cat=${cat.slug}`} className="group relative block h-full">
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                    {/* Dark scrim under the text so names stay readable over busy photos */}
                    <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-[#080c15] via-[#080c15]/75 to-transparent" />
                    <span className="absolute top-4 left-4 label-caps text-white/70 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
                      <h3 className={`font-semibold tracking-[-0.03em] text-white ${big ? "text-2xl sm:text-4xl" : "text-lg sm:text-xl"}`}>
                        {cat.title}
                      </h3>
                      {shown.length > 0 && (
                        <p className={`mt-1.5 text-white/85 leading-snug ${big ? "text-sm sm:text-base max-w-md" : "max-sm:hidden text-sm line-clamp-2"}`}>
                          {shown.join(" · ")}
                          {more > 0 && ` · +${more} more`}
                        </p>
                      )}
                    </div>
                  </Link>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
