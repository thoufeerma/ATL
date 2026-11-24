import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { whatsappLink } from "@/lib/contact";

// Branded "not found" page, shared by the site-wide 404 and missing products.
export default function NotFoundView({
  title,
  text,
  primary,
}: {
  title: string;
  text: string;
  primary: { href: string; label: string };
}) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative isolate overflow-hidden bg-muted text-secondary">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [background-image:radial-gradient(rgb(31_41_55/0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,#000,transparent)]"
        />
        <div className="container mx-auto flex min-h-[75vh] flex-col items-center justify-center pb-20 pt-[150px] text-center">
          <p className="font-display text-[clamp(5rem,16vw,11rem)] leading-none text-primary/15">404</p>
          <h1 className="-mt-4 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">{title}</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">{text}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href={primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#ff1a27]"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={whatsappLink("Hello ATL, I couldn't find what I was looking for on your website:")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-white px-6 py-3.5 font-semibold transition-colors hover:bg-secondary hover:text-white"
            >
              <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer cta={false} />
    </main>
  );
}
