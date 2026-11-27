"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";

const industries = [
  { name: "Supermarkets & retail", text: "Price-computing scales, billing counters, barcode and label printers", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200" },
  { name: "Healthcare & labs", text: "Personal scales and analytical balances with calibration certificates", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200" },
  { name: "Manufacturing", text: "Platform and counting scales, sealing and filling machines", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200" },
  { name: "Logistics & warehousing", text: "Floor and pallet scales, label printers and scanners for dispatch", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200" },
  { name: "Food processing", text: "Band sealers, filling machines and printing scales for packed food", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=1200" },
  { name: "Jewellery", text: "Jewellery scales accurate to 0.001 g, and gold purity analysers", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200" },
];

// A plain list of industries; on desktop the photo beside it follows the row you point at.
export default function IndustriesServed() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto">
        <SectionHeader
          title={<>From the shop counter to the factory floor.</>}
          link={{ href: "/industries", text: "All industries" }}
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <ul className="lg:col-span-7 border-b border-secondary/15">
            {industries.map((ind, i) => {
              const on = active === i;
              return (
                <li key={ind.name} className="border-t border-secondary/15">
                  <Link
                    href="/industries"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[4rem_1fr_auto] sm:grid-cols-[5rem_1fr_auto] lg:grid-cols-[1fr_auto] items-center gap-4 py-5 lg:py-6"
                  >
                    {/* Thumbnail on phones and tablets, where there is no side photo */}
                    <span className="relative aspect-square overflow-hidden rounded-lg bg-secondary lg:hidden">
                      <img src={ind.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </span>
                    <span>
                      <span
                        className={`block text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.03em] transition-colors ${
                          on ? "lg:text-primary" : ""
                        } text-secondary group-hover:text-primary`}
                      >
                        {ind.name}
                      </span>
                      <span className="mt-1 block text-sm sm:text-[15px] text-muted-foreground">{ind.text}</span>
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 transition-all duration-300 ${
                        on ? "lg:translate-x-0 lg:opacity-100 lg:text-primary" : "lg:-translate-x-2 lg:opacity-0"
                      } text-secondary group-hover:text-primary`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
              {industries.map((ind, i) => (
                <img
                  key={ind.name}
                  src={ind.image}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active === i ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
