"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsappLink } from "@/lib/contact";

const departments = ["Sales enquiry", "Customer support", "Technical support", "Service request", "Accounts / billing"];

const EMAIL = "accuratetradelinks@gmail.com";
const ADDRESS = "TC 26/640(3), Future Centre, Oottukuzhy Road, Thiruvananthapuram 695001";
const MAP_EMBED = "https://www.google.com/maps?q=Accurate+Trade+Links+Oottukuzhy+Thiruvananthapuram&output=embed";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Accurate+Trade+Links+Oottukuzhy+Trivandrum";

const field =
  "w-full rounded-xl border border-secondary/15 bg-white px-4 py-3.5 text-[15px] text-secondary outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-4 focus:ring-secondary/5";

export default function ContactPage() {
  const [dept, setDept] = useState(departments[0]);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  // The site has no mail backend, so the message is handed to WhatsApp, already written out.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [`Hello ATL, ${dept.toLowerCase()} from ${form.name}.`, `Phone: ${form.phone}`];
    if (form.email) lines.push(`Email: ${form.email}`);
    const text = [...lines, "", form.message].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Contact" }]}
        title="Tell us what you"
        accent="weigh, bill or pack."
        intro="Send a message, call, or walk in to our showroom at Oottukuzhy. We reply within one business day."
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-secondary/10 bg-muted p-6 sm:p-10">
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset>
                    <legend className="text-sm text-muted-foreground">What is it about?</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {departments.map((d) => (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={dept === d}
                          onClick={() => setDept(d)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            dept === d
                              ? "border-secondary bg-secondary text-white"
                              : "border-secondary/15 bg-white text-secondary hover:border-secondary/40"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-sm font-medium text-secondary">Your name</span>
                      <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-2 ${field}`} />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-secondary">Phone</span>
                      <input required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" className={`mt-2 ${field}`} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-secondary">
                      Email <span className="font-normal text-muted-foreground">(optional)</span>
                    </span>
                    <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-2 ${field}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-secondary">Message</span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="What do you need? A model number or the kind of business helps."
                      className={`mt-2 resize-none ${field}`}
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(227,6,19,0.7)] transition-colors hover:bg-[#ff1a27]"
                    >
                      <Send className="h-4 w-4" /> Send on WhatsApp
                    </button>
                    <p className="text-sm text-muted-foreground">Opens WhatsApp with your message filled in.</p>
                  </div>
                </form>
              ) : (
                <div className="py-10 sm:py-16">
                  <CheckCircle2 className="h-10 w-10 text-[#1faa53]" />
                  <h2 className="mt-6 font-display text-4xl text-secondary">Almost there, {form.name.split(" ")[0]}.</h2>
                  <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
                    WhatsApp opened with your message. Press send there and we will reply within one business day. If it
                    didn&apos;t open, call us on{" "}
                    <a href={`tel:${PHONE_NUMBER}`} className="font-semibold text-secondary">{PHONE_DISPLAY}</a>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", phone: "", email: "", message: "" });
                    }}
                    className="mt-8 rounded-full border border-secondary/15 bg-white px-5 py-3 text-sm font-semibold text-secondary transition-colors hover:border-secondary/40"
                  >
                    Write another message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details and map */}
          <div className="lg:col-span-5">
            <dl className="divide-y divide-secondary/15 border-y border-secondary/15">
              <div className="py-5">
                <dt className="text-sm text-muted-foreground">Call</dt>
                <dd className="mt-1.5 space-y-0.5 text-lg">
                  <a href={`tel:${PHONE_NUMBER}`} className="block font-semibold text-secondary hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
                  <a href="tel:04712334553" className="block text-secondary/70 hover:text-primary transition-colors">0471 2334553</a>
                </dd>
              </div>
              <div className="py-5">
                <dt className="text-sm text-muted-foreground">WhatsApp</dt>
                <dd className="mt-1.5 text-lg">
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary hover:text-primary transition-colors">
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div className="py-5">
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="mt-1.5 text-lg">
                  <a href={`mailto:${EMAIL}`} className="font-semibold text-secondary break-all hover:text-primary transition-colors">{EMAIL}</a>
                </dd>
              </div>
              <div className="py-5">
                <dt className="text-sm text-muted-foreground">Showroom</dt>
                <dd className="mt-1.5">
                  <address className="not-italic text-secondary leading-relaxed">{ADDRESS}</address>
                  <p className="mt-1 text-sm text-muted-foreground">Monday to Saturday, 9 AM to 6 PM</p>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="group mt-3 inline-flex items-center gap-1 font-semibold text-secondary hover:text-primary transition-colors">
                    Get directions
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-secondary/10 bg-muted">
              <iframe
                title="Map to the ATL showroom"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 grayscale-[0.4]"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground tabular-nums">GSTIN 32AHJPK1741Q1Z4</p>
          </div>
        </div>
      </section>

      <Footer cta={false} />
    </main>
  );
}
