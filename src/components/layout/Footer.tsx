import Link from "next/link";
import { Phone, MessageSquare, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="container mx-auto px-4 md:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-5">
              <img
                src="/images/logo.png"
                alt="Accurate Trade Links Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm font-light leading-relaxed mb-6 max-w-xs">
              Kerala&apos;s most trusted provider of precision weighing, billing, packaging, and industrial automation solutions since 2003.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <span className="leading-relaxed">
                  ACCURATE TRADE LINKS<br/>
                  TC 26/640(3), Future Centre<br/>
                  Oottukuzhy Road, Trivandrum-1
                </span>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><Phone className="w-4 h-4 text-primary flex-shrink-0" /> +91 9747541006, 0471 2334553</div>
              <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><Mail className="w-4 h-4 text-primary flex-shrink-0" /> accuratetradelinks@gmail.com</div>
              <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs mt-2">GST: 32AHJPK1741Q1Z4</div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-5">Products</h4>
            <ul className="space-y-3 text-sm">
              {["Weighing Systems", "Billing Solutions", "Printing Scales", "Counting Machines", "Sealing Machines", "Labelling Systems", "Filling Machines"].map(p => (
                <li key={p}><Link href="/products" className="hover:text-white transition-colors hover:text-primary">{p}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Installation", "Calibration", "Annual Maintenance", "Repair Services", "Onsite Support", "Training", "Consultation"].map(s => (
                <li key={s}><Link href="/services" className="hover:text-primary transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              {[["About Us", "/about"], ["Industries", "/industries"], ["Brands", "/brands"], ["Blog", "/blog"], ["Support", "/support"], ["Contact Us", "/contact"]].map(([label, href]) => (
                <li key={label as string}><Link href={href as string} className="hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 mt-8">Follow Us</h4>
            <div className="flex flex-wrap gap-2">
              {["Facebook", "Instagram", "YouTube", "LinkedIn"].map((name) => (
                <a key={name} href="#" className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary text-zinc-400 hover:text-white text-xs font-semibold transition-colors">
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Accurate Trade Links (ATL). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
