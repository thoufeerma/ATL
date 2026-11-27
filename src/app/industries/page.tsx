import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Industries | Accurate Trade Links",
  description:
    "Weighing, billing, labelling and packaging equipment for retail, healthcare, manufacturing, logistics, food processing and jewellery businesses in Kerala.",
};

const industries = [
  {
    name: "Retail stores",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400",
    desc: "Complete solutions for modern retail: from weighing and billing to labelling and packaging.",
    challenges: ["Manual billing errors", "Inventory inaccuracies", "Slow checkout processes"],
    solutions: ["Android POS billing terminals", "Barcode scanners & printers", "Retail scales with price display"],
    href: "/products?cat=billing-solutions",
  },
  {
    name: "Healthcare & labs",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1400",
    desc: "Precision instruments for hospitals, clinics, and diagnostic laboratories.",
    challenges: ["Dosage accuracy", "Equipment compliance", "Regulatory requirements"],
    solutions: ["Personal weighing scales", "Analytical laboratory balances", "OIML-certified instruments"],
    href: "/products?cat=weighing&sub=lab-analytical-scales",
  },
  {
    name: "Manufacturing",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1400",
    desc: "Industrial automation, packaging, and quality control solutions for manufacturing plants.",
    challenges: ["Production accuracy", "Packaging efficiency", "Quality audits"],
    solutions: ["Industrial platform scales", "Automatic packing machines", "Inkjet batch coders"],
    href: "/products?cat=weighing-scale&sub=industrial-scales",
  },
  {
    name: "Logistics & warehousing",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400",
    desc: "Speed up operations with integrated weighing, barcode, and label printing systems.",
    challenges: ["Shipping weight accuracy", "Inventory management", "Label compliance"],
    solutions: ["Platform & hanging scales", "Zebra label printers", "Honeywell barcode scanners"],
    href: "/products?cat=weighing-scale&sub=platform-scales",
  },
  {
    name: "Food processing",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=1400",
    desc: "Hygienic, stainless-steel weighing and packaging machinery for food-grade environments.",
    challenges: ["Contamination risks", "Portion accuracy", "Regulatory compliance"],
    solutions: ["Stainless steel platform scales", "Vacuum & band sealers", "Automatic filling machines"],
    href: "/products?cat=sealing",
  },
  {
    name: "Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400",
    desc: "Precision micro-weighing, gold purity analysis, and secure locker solutions.",
    challenges: ["Carat accuracy", "Metal purity verification", "Asset security"],
    solutions: ["Jewellery & carat scales", "Gold purity analyser", "Security locker systems"],
    href: "/products?cat=weighing-scale&sub=jewellary-scale",
  },
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Industries" }]}
        title="Equipment chosen for"
        accent="how your trade works."
        intro="Weighing, billing and packing needs look very different in a pharmacy and a warehouse. Here is what we usually supply to each."
        image="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1800"
      />

      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto">
          <ul className="grid md:grid-cols-2 gap-5">
            {industries.map((ind, i) => (
              <Reveal as="li" key={ind.name} delay={(i % 2) * 0.08}>
                <Link
                  href={ind.href}
                  className="group flex h-full flex-col rounded-3xl bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(18,26,43,0.3)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-secondary">
                    <img
                      src={ind.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-7">
                    <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.05] text-secondary">{ind.name}</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{ind.desc}</p>

                    <div className="mt-6 grid sm:grid-cols-2 gap-6 border-t border-secondary/10 pt-6 text-[15px]">
                      <div>
                        <h3 className="text-sm text-muted-foreground">What goes wrong</h3>
                        <ul className="mt-3 space-y-2 text-secondary">
                          {ind.challenges.map((c) => (
                            <li key={c} className="flex items-start gap-3">
                              <span aria-hidden className="mt-[0.6em] h-px w-3 flex-shrink-0 bg-secondary/40" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground">What we supply</h3>
                        <ul className="mt-3 space-y-2 font-medium text-secondary">
                          {ind.solutions.map((s) => (
                            <li key={s} className="flex items-start gap-3">
                              <span aria-hidden className="mt-[0.6em] h-px w-3 flex-shrink-0 bg-primary" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <span className="mt-auto pt-8 inline-flex items-center gap-2 font-semibold text-secondary transition-colors group-hover:text-primary">
                      See products
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
