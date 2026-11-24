import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Phone, Wrench, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero, { HeroActions } from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Support | Accurate Trade Links",
  description:
    "Customer care, service requests, warranty registration, AMC enrolment and manuals for ATL weighing, billing and packaging equipment.",
};

const channels = [
  {
    icon: Phone,
    title: "Customer care",
    text: "Product queries, complaints or general help. Mon–Sat, 9 AM to 6 PM.",
    action: "Call 0471 2334553",
    href: "tel:04712334553",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp a photo",
    text: "Send a photo of the machine or the error on screen. It is often the fastest way to a fix.",
    action: "Open WhatsApp",
    href: whatsappLink("Hello ATL, I need help with my machine. Model / problem:"),
    external: true,
  },
  {
    icon: Wrench,
    title: "Service request",
    text: "Repair, calibration or an onsite visit. Tell us the model and your location.",
    action: "Request a visit",
    href: "/contact",
  },
];

const more = [
  {
    title: "Warranty registration",
    text: "Register your ATL product to activate warranty and priority support. Send the invoice and serial number.",
    href: whatsappLink("Hello ATL, I would like to register my product warranty. Invoice no. / serial no.:"),
    external: true,
  },
  {
    title: "AMC enrolment",
    text: "Put your equipment on an Annual Maintenance Contract for scheduled visits and priority cover.",
    href: whatsappLink("Hello ATL, I would like to enrol my equipment in an AMC:"),
    external: true,
  },
  {
    title: "Manuals & certificates",
    text: "Product manuals, calibration certificates and compliance documents for your model.",
    href: whatsappLink("Hello ATL, please send me the manual / certificate for model:"),
    external: true,
  },
  {
    title: "Video tutorials",
    text: "Step-by-step guides for installation, operation and maintenance.",
    href: whatsappLink("Hello ATL, do you have a video guide for model:"),
    external: true,
  },
  {
    title: "Engineer portal",
    text: "Sales and service training portal for ATL engineers.",
    href: "/engineer/login",
  },
];

const faqs = [
  { q: "How do I register my product warranty?", a: "WhatsApp us the invoice and serial number of your product, and we will register it for you." },
  { q: "What is your service coverage area?", a: "ATL provides service coverage across all districts of Kerala, with engineers based in Thiruvananthapuram, Kochi, Kozhikode, and Thrissur." },
  { q: "How long does a repair take?", a: "Standard repairs are completed within 24-48 hours. Complex repairs may take up to 5 working days with prior communication." },
  { q: "What is included in the AMC?", a: "Our AMC includes scheduled preventive maintenance visits, priority response, telephone support, and discounted spare parts." },
  { q: "Can I get same-day installation?", a: "Yes, same-day installation is available for products purchased before 2 PM on working days, subject to engineer availability in your area." },
];

function Action({ href, external, className, children }: { href: string; external?: boolean; className: string; children: React.ReactNode }) {
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  if (href.startsWith("tel:")) return <a href={href} className={className}>{children}</a>;
  return <Link href={href} className={className}>{children}</Link>;
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Support" }]}
        title="Something not working?"
        accent="We'll sort it out."
        intro="Engineers across Kerala, Monday to Saturday, 9 AM to 6 PM. Emergency breakdown support is available 24/7."
      >
        <HeroActions
          whatsapp={whatsappLink("Hello ATL, I need support with:")}
          phoneHref={`tel:${PHONE_NUMBER}`}
          phoneLabel={PHONE_DISPLAY}
        />
      </PageHero>

      {/* Main ways to get help */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto">
          <ul className="grid md:grid-cols-3 gap-5">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.08}>
                <Action
                  href={c.href}
                  external={c.external}
                  className="group flex h-full flex-col rounded-3xl border border-secondary/10 bg-white p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/25 hover:shadow-[0_20px_40px_-20px_rgba(18,26,43,0.25)]"
                >
                  <c.icon className="h-6 w-6 text-primary" />
                  <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-secondary">{c.title}</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{c.text}</p>
                  <span className="mt-auto pt-8 inline-flex items-center gap-1.5 font-semibold text-secondary transition-colors group-hover:text-primary">
                    {c.action}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Action>
              </Reveal>
            ))}
          </ul>

          {/* Everything else */}
          <ul className="mt-16 lg:mt-20 border-b border-secondary/15">
            {more.map((m) => (
              <li key={m.title} className="border-t border-secondary/15">
                <Action
                  href={m.href}
                  external={m.external}
                  className="group grid grid-cols-[1fr_auto] lg:grid-cols-[18rem_1fr_auto] items-center gap-x-8 gap-y-1 py-6"
                >
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-secondary transition-colors group-hover:text-primary">
                    {m.title}
                  </span>
                  <span className="col-start-1 row-start-2 lg:col-start-2 lg:row-start-1 text-[15px] text-muted-foreground">{m.text}</span>
                  <ArrowUpRight className="row-span-2 lg:row-span-1 h-5 w-5 text-secondary transition-all group-hover:rotate-45 group-hover:text-primary" />
                </Action>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="container mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-36">
              <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.04] text-secondary">Questions we get every week.</h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Not here?{" "}
                <a href={whatsappLink("Hello ATL, I have a question:")} target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary underline decoration-primary underline-offset-4 hover:text-primary">
                  Ask us on WhatsApp
                </a>
                .
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 border-b border-secondary/15">
            {faqs.map((f) => (
              <details key={f.q} className="group border-t border-secondary/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold tracking-[-0.02em] text-secondary transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-secondary/15 transition-transform duration-300 group-open:rotate-45 group-open:border-primary group-open:text-primary">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="-mt-1 pb-6 pr-14 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
