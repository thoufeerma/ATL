import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero, { HeroActions } from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Services | Accurate Trade Links",
  description:
    "Installation, calibration, annual maintenance contracts, repairs, onsite support and training for weighing, billing and packaging equipment across Kerala.",
};

const services = [
  {
    title: "Installation",
    cta: "Book an installation",
    desc: "Professional on-site installation by certified engineers ensuring your equipment is set up correctly and calibrated from day one.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=900",
    features: ["Same-day installation available", "Certified engineers", "Post-installation testing", "User orientation"],
  },
  {
    title: "Calibration",
    cta: "Book a calibration",
    desc: "NABL-traceable calibration services for all weighing instruments to ensure legal compliance and measurement accuracy.",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=900",
    features: ["Government certified", "Calibration certificates", "Legal-for-trade compliance", "On-site and lab calibration"],
  },
  {
    title: "Annual maintenance (AMC)",
    cta: "Ask about an AMC",
    desc: "Comprehensive Annual Maintenance Contracts with scheduled preventive maintenance, priority support, and cost-effective repairs.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=900",
    features: ["Scheduled PM visits", "Priority response time", "Spare parts coverage", "24/7 helpline"],
  },
  {
    title: "Repairs",
    cta: "Book a repair",
    desc: "Fast and reliable repair services for all brands and models. Most repairs completed within 24-48 hours.",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=900",
    features: ["All brands serviced", "Genuine spare parts", "48-hr turnaround", "90-day repair warranty"],
  },
  {
    title: "Onsite support",
    cta: "Request onsite support",
    desc: "Rapid onsite technical support dispatched to your location. Our Kerala-wide engineer network ensures fast response times.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900",
    features: ["4-hour response SLA", "Field engineers across Kerala", "Emergency breakdown support", "Weekend availability"],
  },
  {
    title: "Training & consultation",
    cta: "Arrange training",
    desc: "Product training sessions and technical consultations to help your team get maximum value from your equipment investment.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900",
    features: ["Operator training", "Admin system training", "Group sessions", "Video training library"],
  },
];

const promises = [
  { value: "4 hr", label: "Onsite response" },
  { value: "48 hr", label: "Typical repair turnaround" },
  { value: "90 days", label: "Warranty on repairs" },
  { value: "5,000+", label: "Active AMC contracts" },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Services" }]}
        title="Installed, calibrated and"
        accent="kept running."
        intro="End-to-end service from installation and calibration to annual maintenance and emergency repairs, by our own engineers across Kerala."
        image="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1800"
      >
        <HeroActions
          whatsapp={whatsappLink("Hello ATL, I would like to book a service visit for:")}
          phoneHref={`tel:${PHONE_NUMBER}`}
          phoneLabel={PHONE_DISPLAY}
        />
      </PageHero>

      {/* Service list */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto">
          <ol className="border-b border-secondary/15">
            {services.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 border-t border-secondary/15 py-10 lg:py-14"
              >
                <div className="lg:col-span-5">
                  <span className="text-sm font-semibold tabular-nums text-primary">0{i + 1}</span>
                  <h2 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.05] text-secondary">{s.title}</h2>
                  <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">{s.desc}</p>
                  <a
                    href={whatsappLink(`Hello ATL, I would like to enquire about ${s.title.toLowerCase()}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link mt-6 inline-flex items-center gap-1.5 font-semibold text-secondary transition-colors hover:text-primary"
                  >
                    {s.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
                <ul className="lg:col-span-3 self-center space-y-3 text-[15px] text-secondary">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span aria-hidden className="mt-[0.6em] h-px w-4 flex-shrink-0 bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="lg:col-span-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                    <img
                      src={s.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Service promises */}
      <section className="bg-muted py-16 lg:py-20">
        <div className="container mx-auto">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-10">
            {promises.map((p, i) => (
              <Reveal key={p.label} delay={i * 0.06} className={`${i % 2 ? "pl-4 sm:pl-6 border-l border-secondary/15" : "pr-4"} ${i === 2 ? "lg:pl-6 lg:border-l lg:border-secondary/15" : ""}`}>
                <dd className="font-display text-[2rem] sm:text-4xl lg:text-5xl text-secondary">{p.value}</dd>
                <dt className="mt-2 text-sm text-muted-foreground">{p.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <Footer />
    </main>
  );
}
