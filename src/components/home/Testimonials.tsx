import SectionHeader from "./SectionHeader";
import Marquee from "@/components/motion/Marquee";

const testimonials = [
  {
    name: "Rajesh Menon",
    company: "FreshMart Supermarket, Kochi",
    text: "ATL installed our complete billing and weighing setup across 12 counters. The team was professional, fast, and the after-sales support is exceptional. Highly recommended.",
  },
  {
    name: "Dr. Priya Nair",
    company: "Kerala Institute of Medical Sciences",
    text: "We procured 20 hospital scales and 5 laboratory analytical balances from ATL. The calibration certificates and NABL traceability provided were exactly what we needed for compliance.",
  },
  {
    name: "Sunil Thomas",
    company: "Thomas Gold & Jewellery, Thrissur",
    text: "The jewellery scales from ATL are precise to 0.001g. The gold purity analyzer has also been invaluable. Excellent products backed by prompt technical support.",
  },
  {
    name: "Abdul Hameed",
    company: "Hameed Distributors, Kozhikode",
    text: "ATL has been our service partner for 8 years. Their AMC team is always on time and their technicians know every product inside out. Best in Kerala.",
  },
];

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container mx-auto">
        <SectionHeader title={<>Trusted from Kochi to Kozhikode.</>} />
      </div>

      <Marquee duration={55}>
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="mr-5 flex w-[320px] sm:w-[420px] shrink-0 flex-col rounded-2xl border border-border bg-muted/60 p-7 sm:p-8"
          >
            <span aria-hidden className="font-display text-6xl leading-[0.5] text-primary">&ldquo;</span>
            <blockquote className="mt-4 text-[15px] sm:text-base leading-relaxed text-foreground">{t.text}</blockquote>
            <figcaption className="mt-auto pt-7 flex items-center gap-3">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
                {initials(t.name)}
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-secondary">{t.name}</span>
                <span className="block text-muted-foreground">{t.company}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
