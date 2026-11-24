import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";
import SpotlightCard from "@/components/motion/SpotlightCard";

export const metadata: Metadata = {
  title: "Brands | Accurate Trade Links",
  description: "Accurate Trade Links is an authorised distributor and service partner for leading weighing, printing and barcode brands.",
};

const brands = [
  {
    name: "CAS",
    category: "Weighing systems",
    origin: "South Korea",
    desc: "CAS Corporation is a global leader in weighing technology, manufacturing precision retail, industrial, and laboratory scales used in over 100 countries.",
    products: ["Retail scales", "Platform scales", "Jewellery scales", "Lab scales"],
  },
  {
    name: "Citizen",
    category: "Precision instruments",
    origin: "Japan",
    desc: "Citizen Systems produces enterprise-grade precision measuring instruments trusted by laboratories and industries worldwide since 1918.",
    products: ["Precision scales", "Balances", "Analytical instruments"],
  },
  {
    name: "Epson",
    category: "Printing solutions",
    origin: "Japan",
    desc: "Epson is the world's #1 POS printer brand, delivering high-speed, reliable thermal printing solutions for retail, hospitality, and banking sectors.",
    products: ["POS printers", "Label printers", "Barcode printers"],
  },
  {
    name: "Zebra",
    category: "Enterprise mobility",
    origin: "USA",
    desc: "Zebra Technologies is the world leader in barcode printing and enterprise mobility solutions, powering logistics, retail, and healthcare operations globally.",
    products: ["Label printers", "Barcode scanners", "Mobile computers"],
  },
  {
    name: "Honeywell",
    category: "Industrial automation",
    origin: "USA",
    desc: "Honeywell is a Fortune 100 technology and manufacturing company offering state-of-the-art barcode scanning and industrial automation solutions.",
    products: ["Barcode scanners", "Mobile computers", "Industrial sensors"],
  },
  {
    name: "TSC",
    category: "Label printing",
    origin: "Taiwan",
    desc: "TSC Auto ID Technology produces durable, high-performance thermal label printers for industrial and commercial labelling applications.",
    products: ["Industrial label printers", "Desktop printers", "Mobile printers"],
  },
];

// The other brands on the home page strip.
const moreBrands = ["ATL Casio", "Essae", "Phoenix", "Mettler Toledo", "Scangle", "Yes Weigh", "Wepsol", "Contech", "Maxsell", "Adler"];

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Brands" }]}
        title="Authorised for the brands"
        accent="your trade trusts."
        intro="We are an authorised distributor and service partner for 50+ weighing, printing and barcode brands, so spares and warranty claims go through us."
      />

      <section className="py-20 lg:py-28">
        <div className="container mx-auto">
          <ul className="grid md:grid-cols-2 gap-5">
            {brands.map((b, i) => (
              <Reveal as="li" key={b.name} delay={(i % 2) * 0.08}>
                <SpotlightCard className="h-full rounded-3xl border border-secondary/10 bg-white transition-colors hover:border-secondary/25">
                  <div className="relative z-20 flex h-full flex-col p-7 sm:p-10">
                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                      <span>{b.category}</span>
                      <span>{b.origin}</span>
                    </div>
                    <h2 className="mt-8 font-display text-[clamp(3rem,6vw,5rem)] text-secondary">{b.name}</h2>
                    <p className="mt-5 max-w-lg text-muted-foreground leading-relaxed">{b.desc}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {b.products.map((p) => (
                        <li key={p} className="rounded-full border border-secondary/15 px-3 py-1 text-sm text-secondary">{p}</li>
                      ))}
                    </ul>
                    <Link
                      href={`/products?q=${encodeURIComponent(b.name)}`}
                      className="group mt-8 inline-flex items-center gap-1.5 self-start pt-2 font-semibold text-secondary transition-colors hover:text-primary"
                    >
                      See {b.name} products
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-20 lg:mt-28 border-t border-secondary/15 pt-10">
            <h2 className="text-sm text-muted-foreground">Also supplied and serviced</h2>
            <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-secondary/40">
              {moreBrands.map((name, i) => (
                <li key={name} className="flex items-center gap-6">
                  <Link href={`/products?q=${encodeURIComponent(name)}`} className="transition-colors hover:text-secondary">
                    {name}
                  </Link>
                  {i < moreBrands.length - 1 && <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-primary/60" />}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
