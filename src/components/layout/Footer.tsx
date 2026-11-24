import Link from "next/link";
import { ArrowUpRight, ArrowUp, MessageCircle, Phone } from "lucide-react";
import { PHONE_NUMBER, PHONE_DISPLAY, whatsappLink } from "@/lib/contact";
import Magnetic from "@/components/motion/Magnetic";
import RollLink from "@/components/motion/RollLink";
import WordmarkHover from "@/components/motion/WordmarkHover";

const EMAIL = "accuratetradelinks@gmail.com";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Accurate+Trade+Links+Oottukuzhy+Trivandrum";

const columns: { title: string; span: string; links: [string, string][] }[] = [
  {
    title: "Products",
    span: "lg:col-span-3",
    links: [
      ["Weighing scales", "/products?cat=weighing-scale"],
      ["Billing solutions", "/products?cat=billing-solutions"],
      ["Printing scales", "/products?cat=printing-scales"],
      ["Counting machines", "/products?cat=counting"],
      ["Sealing machines", "/products?cat=sealing"],
      ["Labelling systems", "/products?cat=labelling"],
      ["Filling machines", "/products?cat=filling"],
    ],
  },
  {
    title: "Services",
    span: "lg:col-span-2",
    links: [
      ["Installation", "/services"],
      ["Calibration", "/services"],
      ["Annual maintenance", "/services"],
      ["Repairs", "/services"],
      ["Onsite support", "/support"],
      ["Training", "/services"],
    ],
  },
  {
    title: "Company",
    span: "lg:col-span-2",
    links: [
      ["About us", "/about"],
      ["Industries", "/industries"],
      ["Brands", "/brands"],
      ["Blog", "/blog"],
      ["Support", "/support"],
      ["Contact", "/contact"],
    ],
  },
];

// `cta={false}` hides the "Need a price" block, e.g. on the contact page, which already is one.
export default function Footer({ cta = true }: { cta?: boolean }) {
  return (
    <footer className="relative isolate overflow-hidden bg-[#080c15] text-white/55">
      {/* Backdrop: dot grid and a red glow behind the headline */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(ellipse_55%_45%_at_80%_10%,#000,transparent)]" />
      <div aria-hidden className="absolute -top-48 right-[-10%] -z-10 h-[520px] w-[720px] rounded-full bg-primary/20 blur-[160px]" />

      <div className="container mx-auto">
        {/* Call to action */}
        {cta && (
        <div className="grid lg:grid-cols-12 items-end gap-10 pt-20 lg:pt-28 pb-16 lg:pb-20 border-b border-white/10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-white text-[clamp(2.6rem,6.4vw,5.75rem)] leading-[0.98]">
              Need a price or a <span className="text-primary">service visit?</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg">
              Send a WhatsApp with what you need, a photo of the machine or the model number. We reply within one
              business day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Hello ATL, I would like a price / service visit for:")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#1faa53] py-2 pl-2 pr-6 font-semibold text-white shadow-[0_10px_40px_-12px_rgba(31,170,83,0.9)] transition-colors hover:bg-[#22bd5c]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </span>
                WhatsApp us
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-secondary"
              >
                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="hidden lg:col-span-4 lg:flex lg:justify-end">
            <Magnetic strength={0.35}>
              <Link
                href="/contact"
                className="group relative flex h-44 w-44 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-white font-semibold"
              >
                {/* White fill rises from the bottom on hover */}
                <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <ArrowUpRight className="relative h-7 w-7 transition-all duration-500 group-hover:rotate-45 group-hover:text-primary" />
                <span className="relative transition-colors duration-500 group-hover:text-secondary">Get a quote</span>
              </Link>
            </Magnetic>
          </div>
        </div>
        )}

        {/* Contact details and links */}
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-6 gap-y-12 py-16 ${cta ? "" : "lg:pt-24"}`}>
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            <Link href="/" aria-label="Accurate Trade Links home" className="inline-block">
              <img src="/images/logo.png" alt="Accurate Trade Links" className="h-10 w-auto" />
            </Link>
            <dl className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-6 text-[15px]">
              <div>
                <dt className="text-sm text-white/40">Call</dt>
                <dd className="mt-1.5 space-y-1">
                  <a href={`tel:${PHONE_NUMBER}`} className="block font-semibold text-white hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
                  <a href="tel:04712334553" className="block hover:text-white transition-colors">0471 2334553</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/40">Email</dt>
                <dd className="mt-1.5">
                  <a href={`mailto:${EMAIL}`} className="font-semibold text-white break-all hover:text-primary transition-colors">{EMAIL}</a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-white/40">Visit</dt>
                <dd className="mt-1.5">
                  <address className="not-italic leading-relaxed">
                    TC 26/640(3), Future Centre, Oottukuzhy Road, Thiruvananthapuram 695001
                  </address>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-2 inline-flex items-center gap-1 font-semibold text-white hover:text-primary transition-colors"
                  >
                    Get directions
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className={col.span}>
              <h3 className="text-sm text-white/40">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] text-white/75">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <RollLink href={href}>{label}</RollLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Giant wordmark */}
        <WordmarkHover text="Accurate Trade Links" className="-mb-1" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 py-7 text-sm text-white/40">
          <p>
            © {new Date().getFullYear()} Accurate Trade Links <span className="mx-2 text-white/20">·</span>
            <span className="tabular-nums">GSTIN 32AHJPK1741Q1Z4</span>
          </p>
          <a href="#" className="group inline-flex items-center gap-2 hover:text-white transition-colors">
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/40">
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
