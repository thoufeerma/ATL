"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ClipboardCheck, Wrench, ShieldCheck } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Choose the right machine",
    text: "Tell us what you weigh, bill or pack. We recommend the right model from 50+ brands and quote the price incl. GST.",
  },
  {
    icon: Wrench,
    title: "Free installation & training",
    text: "Our engineers set it up at your counter or on your factory floor and show your staff how to use it.",
  },
  {
    icon: ShieldCheck,
    title: "Service, AMC & calibration",
    text: "1-year warranty, annual maintenance contracts (5,000+ active) and calibration support anywhere in Kerala.",
  },
];

export default function HowWeWork() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="relative isolate overflow-hidden bg-[#080c15] text-white py-20 lg:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(ellipse_50%_70%_at_85%_50%,#000,transparent)]" />
      <div aria-hidden className="absolute -right-32 top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]" />

      <div className="container mx-auto grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Reveal>
              <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.04]">
                We don&apos;t disappear after the sale.
              </h2>
              <p className="mt-6 text-white/60 text-lg max-w-md">
                The same team that sells the machine also installs, calibrates and repairs it, which is why most of our
                customers stay with us for years.
              </p>
              <Link
                href="/services"
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-primary hover:text-white"
              >
                See our services
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7 lg:col-start-6 flex flex-col gap-5 pl-10 sm:pl-14">
          {/* Track and the red line that fills as you scroll through the steps */}
          <span aria-hidden className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px bg-white/10" />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-primary to-primary/40"
          />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="relative">
              <span
                aria-hidden
                className="absolute -left-10 sm:-left-14 top-7 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 bg-[#080c15] text-[11px] sm:text-xs font-semibold tabular-nums"
              >
                {i + 1}
              </span>
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-5 text-xl sm:text-2xl font-semibold tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-2 text-white/60 max-w-lg">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
