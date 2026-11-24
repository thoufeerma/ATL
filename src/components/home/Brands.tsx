import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Marquee from "@/components/motion/Marquee";

const brands = [
  "ATL Casio", "Essae", "Phoenix", "CAS", "Mettler Toledo", "TSC",
  "Scangle", "Yes Weigh", "Wepsol", "Contech", "Maxsell", "Adler",
];

export default function Brands() {
  return (
    <section className="bg-white border-b border-border">
      <div className="container mx-auto flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 py-10">
        <Link
          href="/brands"
          className="group flex-shrink-0 lg:w-56 text-sm leading-snug text-muted-foreground hover:text-secondary transition-colors"
        >
          Authorised dealer for{" "}
          <span className="whitespace-nowrap font-semibold text-secondary">
            50+ brands
            <ArrowUpRight className="inline w-4 h-4 ml-0.5 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
        <Marquee duration={45} className="flex-1 min-w-0">
          {brands.map((b) => (
            <span
              key={b}
              className="flex items-center gap-10 pr-10 text-2xl font-semibold tracking-[-0.03em] text-secondary/35 whitespace-nowrap"
            >
              {b}
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-primary/60" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
