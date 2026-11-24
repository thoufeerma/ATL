import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import BlurText from "@/components/motion/BlurText";
import TextLoop from "@/components/motion/TextLoop";
import CountUp from "@/components/motion/CountUp";
import Magnetic from "@/components/motion/Magnetic";
import DotField from "@/components/motion/DotField";
import { withCatalogueCategories } from "@/lib/category-fallback";
import { categoryImage } from "@/lib/category-images";

const customers = ["supermarket.", "bakery.", "jeweller.", "pharmacy.", "factory.", "warehouse."];

const stats: { value: React.ReactNode; label: string }[] = [
  { value: "2003", label: "Serving Kerala since" },
  { value: <CountUp to={100000} suffix="+" />, label: "Customers" },
  { value: <CountUp to={50} suffix="+" />, label: "Brands supplied" },
  { value: <CountUp to={5000} suffix="+" />, label: "Active AMC contracts" },
];

// The eight product ranges, riding the conveyor under the search.
const ranges = withCatalogueCategories()
  .map((c) => ({ title: c.title, slug: c.slug, count: c.children?.length ?? 0, image: categoryImage(c.slug) }))
  .filter((r): r is typeof r & { image: string } => !!r.image);

// Centred hero over a pointer-reactive dot field, with the product ranges gliding past on a
// tilted conveyor belt below the search, and the stats underneath.
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#080c15] text-white">
      <DotField className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_40%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[12%] h-[420px] w-[min(880px,100vw)] -translate-x-1/2 rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080c15] to-transparent" />
      </div>

      <div className="container mx-auto pt-[136px] lg:pt-[176px] text-center">
        <div className="mx-auto max-w-[62rem]">
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.4rem)] leading-[1.02]">
            <BlurText text="Scales, billing & packing machines for every" delay={0.1} />{" "}
            {/* Words are centred inside the reserved width so the line stays balanced. */}
            <TextLoop words={customers} className="justify-items-center text-primary" />
          </h1>

          <div className="animate-blur-in" style={{ animationDelay: "0.55s" }}>
            <p className="mx-auto mt-7 max-w-2xl text-lg sm:text-xl leading-relaxed text-white/65">
              50+ brands, sold, installed and serviced by our own engineers, from a bakery&apos;s first billing
              machine to a factory&apos;s platform scales.
            </p>
          </div>

          <div className="animate-blur-in" style={{ animationDelay: "0.7s" }}>
            <form
              action="/products"
              role="search"
              className="mx-auto mt-10 flex max-w-2xl items-center rounded-2xl border border-white/15 bg-white/[0.07] p-1.5 text-left backdrop-blur-md transition-colors focus-within:border-white/40"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <Search aria-hidden className="ml-3 h-5 w-5 flex-shrink-0 text-white/50" />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Search scales, billing machines, sealers…"
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-base text-white outline-none placeholder:text-white/45"
              />
              <Magnetic strength={0.25}>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-[0_8px_30px_-6px_rgba(227,6,19,0.7)] transition-colors hover:bg-[#ff1a27]"
                >
                  Search
                </button>
              </Magnetic>
            </form>
          </div>
        </div>
      </div>

      {/* Conveyor: the ranges glide past on a belt tilted away from the viewer. Pauses on hover. */}
      <div className="animate-blur-in relative mt-14 lg:mt-20" style={{ animationDelay: "0.85s" }}>
        <div className="mask-fade-x [perspective:1400px]">
          <div className="group/belt [transform:rotateX(14deg)] [transform-origin:50%_100%]">
            <ul className="flex w-max animate-marquee pb-6 group-hover/belt:[animation-play-state:paused] [--marquee-duration:60s]">
              {[...ranges, ...ranges].map((r, i) => (
                <li key={`${r.slug}-${i}`} aria-hidden={i >= ranges.length || undefined} className="pr-4">
                  <Link
                    href={`/products?cat=${r.slug}`}
                    tabIndex={i >= ranges.length ? -1 : undefined}
                    className="group relative block h-[200px] w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:h-[230px] sm:w-[300px]"
                  >
                    <Image
                      src={r.image}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover opacity-80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#080c15] via-[#080c15]/45 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left">
                      <span>
                        <span className="block text-lg font-semibold tracking-[-0.02em]">{r.title}</span>
                        {r.count > 0 && <span className="block text-sm text-white/55">{r.count} ranges</span>}
                      </span>
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* The belt: a rail with dashes running in the same direction as the cards */}
            <div aria-hidden className="relative h-3 border-y border-white/10 bg-white/[0.03]">
              <div className="absolute inset-0 animate-belt bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_14px,transparent_14px_44px)] [background-size:44px_100%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pb-14 lg:pb-16">
        <dl className="mt-12 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-y-8 border-t border-white/10 pt-8 lg:pt-10 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-2 ${i % 2 ? "border-l border-white/10" : ""} ${i === 2 ? "lg:border-l lg:border-white/10" : ""}`}>
              <dd className="font-display text-[2rem] sm:text-4xl lg:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-sm text-white/55">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
