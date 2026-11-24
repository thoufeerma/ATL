import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";

export const metadata: Metadata = {
  title: "About us | Accurate Trade Links",
  description:
    "Since 2003, Accurate Trade Links has sold, installed and serviced weighing, billing and packaging equipment for businesses and institutions across Kerala.",
};

const milestones = [
  { year: "2003", text: "ATL founded in Thiruvananthapuram with a vision to provide precision weighing solutions." },
  { year: "2008", text: "Expanded to 5 districts, became authorized CAS and Citizen distributor for Kerala." },
  { year: "2012", text: "Launched AMC division, now serving over 5,000 active contracts across the state." },
  { year: "2016", text: "Added billing, barcode, and POS solutions. Became Epson and Honeywell partner." },
  { year: "2020", text: "Expanded to packaging, filling, and labelling machinery, now a full industrial solutions provider." },
  { year: "2024", text: "Reached 1,00,000 customers milestone. Launched digital-first service and support platform." },
];

const principles = [
  {
    title: "Our mission",
    text: "To empower businesses with accurate measurement and intelligent automation tools that drive efficiency, compliance, and profitability.",
  },
  {
    title: "Our vision",
    text: "To be the most trusted industrial technology solutions provider in South India, known for reliability, innovation, and exceptional after-sales support.",
  },
  {
    title: "Our values",
    text: "Precision. Integrity. Innovation. Customer first. We stand behind every product and service we deliver.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "About us" }]}
        title="Weighing Kerala's trade"
        accent="since 2003."
        intro="We sell, install and service weighing, billing and packaging equipment for shops, hospitals, factories and government offices across Kerala."
      >
        <dl className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-y-8 border-t border-white/10 pt-8">
          <div className="pr-4">
            <dd className="font-display text-[2rem] sm:text-4xl lg:text-5xl">2003</dd>
            <dt className="mt-2 text-sm text-white/55">Founded in Thiruvananthapuram</dt>
          </div>
          <div className="pl-4 sm:pl-6 border-l border-white/10">
            <dd className="font-display text-[2rem] sm:text-4xl lg:text-5xl"><CountUp to={100000} suffix="+" /></dd>
            <dt className="mt-2 text-sm text-white/55">Customers served</dt>
          </div>
          <div className="lg:pl-6 lg:border-l lg:border-white/10">
            <dd className="font-display text-[2rem] sm:text-4xl lg:text-5xl"><CountUp to={14} /></dd>
            <dt className="mt-2 text-sm text-white/55">Districts covered</dt>
          </div>
          <div className="pl-4 sm:pl-6 border-l border-white/10">
            <dd className="font-display text-[2rem] sm:text-4xl lg:text-5xl"><CountUp to={50} suffix="+" /></dd>
            <dt className="mt-2 text-sm text-white/55">Brands supplied</dt>
          </div>
        </dl>
      </PageHero>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.04] text-secondary">
                Built on precision, kept by trust.
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-7 space-y-6 text-lg sm:text-xl leading-relaxed text-muted-foreground" delay={0.08}>
              <p>
                <span className="font-semibold text-secondary">Accurate Trade Links was founded in 2003</span> with a simple
                mission: to give Kerala&apos;s businesses and institutions reliable, accurate and affordable weighing and
                measurement equipment.
              </p>
              <p>
                Today we serve over 1,00,000 customers across retail, healthcare, manufacturing, logistics, government and
                education, supplying everything from a single retail scale to a complete packing line.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-14 lg:mt-20">
            <div className="relative aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000"
                alt="The ATL showroom"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission, vision, values */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="container mx-auto">
          <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="border-t border-secondary/15 pt-6">
                <span className="text-sm font-semibold tabular-nums text-primary">0{i + 1}</span>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-secondary">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Journey */}
      <section className="relative isolate overflow-hidden bg-[#080c15] py-20 lg:py-32 text-white">
        <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(ellipse_50%_70%_at_85%_40%,#000,transparent)]" />
        <div aria-hidden className="absolute -right-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="container mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-36">
              <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.04]">Twenty-odd years, one counter at a time.</h2>
            </Reveal>
          </div>
          <ol className="lg:col-span-8 border-b border-white/10">
            {milestones.map((m, i) => (
              <Reveal
                as="li"
                key={m.year}
                delay={i * 0.04}
                className="group grid grid-cols-[5.5rem_1fr] sm:grid-cols-[10rem_1fr] items-baseline gap-4 border-t border-white/10 py-7 sm:py-9"
              >
                <span className="font-display text-4xl sm:text-6xl tabular-nums text-white/25 transition-colors duration-300 group-hover:text-primary">
                  {m.year}
                </span>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </main>
  );
}
