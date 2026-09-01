"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, FileText, ChevronLeft, ChevronRight
} from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/hero/hero-weighing.png",
    headline: "Precision Weighing Solutions",
    headline2: "Built for Industry",
    sub: "From retail counters to industrial floors – certified weighing systems you can trust.",
    cta: "Explore Weighing",
    link: "/products/weighing"
  },
  {
    id: 2,
    image: "/images/hero/hero-billing.png",
    headline: "Smart Billing &",
    headline2: "POS Systems",
    sub: "Enterprise-grade billing terminals, barcode scanners, and receipt printers for modern retail.",
    cta: "Explore Billing",
    link: "/products/billing"
  },
  {
    id: 3,
    image: "/images/hero/hero-packaging.png",
    headline: "Packaging &",
    headline2: "Automation Machinery",
    sub: "High-speed sealing, filling, and labelling machines for food, pharma, and manufacturing.",
    cta: "Explore Packaging",
    link: "/products/packaging"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative min-h-screen flex items-center bg-[#0a0f1a] overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <Image
          src={slide.image}
          alt={slide.headline}
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/60 via-transparent to-transparent z-10" />

      {/* Slide Arrows */}
      <button
        onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-primary transition-colors items-center justify-center text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrent(p => (p + 1) % slides.length)}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-primary transition-colors items-center justify-center text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-10 bg-primary" : "w-4 bg-white/40"}`}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32 relative z-20">
        <div className="max-w-4xl">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight">
            {slide.headline} <br />
            <span className="text-primary">{slide.headline2}</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl font-light leading-relaxed">
            {slide.sub}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 text-white gap-2 shadow-xl shadow-primary/30 transition-transform hover:scale-105">
              <Link href={slide.link}>{slide.cta} <ArrowRight className="w-5 h-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-2 border-white/80 text-white hover:bg-white hover:text-zinc-900 gap-2 bg-transparent backdrop-blur-sm transition-transform hover:scale-105">
              <Link href="/contact"><FileText className="w-5 h-5" /> Request Quote</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 lg:mt-16 pt-8 border-t border-white/10">
            {[
              { value: "25+", label: "Years Experience" },
              { value: "1,00,000+", label: "Happy Customers" },
              { value: "50+", label: "Global Brands" },
              { value: "Expert", label: "Maintenance" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1.5">{stat.value}</div>
                <div className="text-xs lg:text-sm text-zinc-400 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
