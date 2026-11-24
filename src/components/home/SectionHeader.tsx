import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

// Shared section heading: large tight title, optional intro and link.
export default function SectionHeader({
  title,
  intro,
  link,
  tone = "light",
}: {
  title: React.ReactNode;
  intro?: string;
  link?: { href: string; text: string };
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Reveal className="mb-12 lg:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-2xl">
        <h2 className={`font-display text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.04] ${dark ? "text-white" : "text-secondary"}`}>
          {title}
        </h2>
        {intro && <p className={`mt-4 text-lg ${dark ? "text-white/60" : "text-muted-foreground"}`}>{intro}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`group inline-flex items-center gap-2 self-start md:self-auto rounded-full border px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
            dark
              ? "border-white/20 text-white hover:bg-white hover:text-secondary"
              : "border-secondary/15 text-secondary hover:bg-secondary hover:text-white"
          }`}
        >
          {link.text}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </Reveal>
  );
}
