import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import BlurText from "@/components/motion/BlurText";

type Crumb = { label: string; href?: string };

// Dark page header shared by the inner pages: breadcrumb, a blur-in headline with an
// optional red ending, a short intro and an optional row of actions or stats.
export default function PageHero({
  crumbs,
  title,
  accent,
  intro,
  image,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  /** Last words of the headline, shown in red. */
  accent?: string;
  intro?: React.ReactNode;
  /** Optional photo, faded in on the right. */
  image?: string;
  children?: React.ReactNode;
}) {
  const titleWords = title.split(" ").length;

  return (
    <section className="relative isolate overflow-hidden bg-[#080c15] text-white">
      <div aria-hidden className="absolute inset-0 -z-10">
        {image && (
          <div className="absolute inset-y-0 right-0 w-full lg:w-[56%]">
            <img src={image} alt="" className="h-full w-full object-cover opacity-30 lg:opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080c15] via-[#080c15]/75 to-[#080c15]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c15] via-transparent to-[#080c15]/70" />
          </div>
        )}
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_70%_at_15%_30%,#000,transparent)]" />
        <div className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[140px]" />
      </div>

      <div className="container mx-auto pt-[124px] lg:pt-[164px] pb-14 lg:pb-20">
        <nav aria-label="Breadcrumb" className="animate-blur-in mb-7">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/45">
            <li>
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden className="text-white/25">/</span>
                {c.href && i < crumbs.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-white">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-white/80">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="max-w-[52rem] font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.03]">
          <BlurText text={title} delay={0.05} />
          {accent && (
            <>
              {" "}
              <BlurText text={accent} delay={0.05 + titleWords * 0.06} className="text-primary" />
            </>
          )}
        </h1>

        {intro && (
          <div className="animate-blur-in" style={{ animationDelay: "0.45s" }}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">{intro}</p>
          </div>
        )}

        {children && (
          <div className="animate-blur-in mt-9" style={{ animationDelay: "0.6s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

// The two actions most pages offer: WhatsApp and a phone call.
export function HeroActions({
  whatsapp,
  phoneHref,
  phoneLabel,
  tone = "dark",
}: {
  whatsapp: string;
  phoneHref: string;
  phoneLabel: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#1faa53] px-6 py-3.5 font-semibold text-white shadow-[0_10px_40px_-12px_rgba(31,170,83,0.9)] transition-colors hover:bg-[#22bd5c]"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp us
      </a>
      <a
        href={phoneHref}
        className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-semibold transition-colors ${
          tone === "dark"
            ? "border-white/20 text-white hover:bg-white hover:text-secondary"
            : "border-secondary/15 text-secondary hover:bg-secondary hover:text-white"
        }`}
      >
        <Phone className="h-4 w-4" /> {phoneLabel}
      </a>
    </div>
  );
}
