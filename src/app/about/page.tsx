import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { ChevronRight, Award, Users, Clock, Globe, Target, Heart } from "lucide-react";


const team = [
  { name: "Managing Director", role: "Leadership", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
  { name: "Head of Sales", role: "Sales and Business Development", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400" },
  { name: "Chief Technical Officer", role: "Engineering and Service", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" },
  { name: "Head of Support", role: "Customer Care", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" }
];

const milestones = [
  { year: "2003", text: "ATL founded in Thiruvananthapuram with a vision to provide precision weighing solutions." },
  { year: "2008", text: "Expanded to 5 districts, became authorized CAS and Citizen distributor for Kerala." },
  { year: "2012", text: "Launched AMC division, now serving over 5,000 active contracts across the state." },
  { year: "2016", text: "Added billing, barcode, and POS solutions. Became Epson and Honeywell partner." },
  { year: "2020", text: "Expanded to packaging, filling, and labelling machinery, now a full industrial solutions provider." },
  { year: "2024", text: "Reached 1,00,000 customers milestone. Launched digital-first service and support platform." }
];

const stats = [
  { icon: <Clock className="w-5 h-5" />, label: "25+ Years", desc: "Industry Experience" },
  { icon: <Users className="w-5 h-5" />, label: "100K+", desc: "Customers Served" },
  { icon: <Globe className="w-5 h-5" />, label: "14 Districts", desc: "Kerala Coverage" },
  { icon: <Award className="w-5 h-5" />, label: "50+ Brands", desc: "Authorized Partner" }
];

const mvv = [
  { icon: <Target className="w-8 h-8" />, title: "Our Mission", text: "To empower businesses with accurate measurement and intelligent automation tools that drive efficiency, compliance, and profitability." },
  { icon: <Globe className="w-8 h-8" />, title: "Our Vision", text: "To be the most trusted industrial technology solutions provider in South India, known for reliability, innovation, and exceptional after-sales support." },
  { icon: <Heart className="w-8 h-8" />, title: "Our Values", text: "Precision. Integrity. Innovation. Customer First. We stand behind every product and service we deliver." }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-secondary text-white pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">About Us</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">About Accurate Trade Links</h1>
          <p className="text-zinc-300 text-lg font-light max-w-3xl">
            Over 25 years of delivering precision weighing, billing, and industrial automation solutions to businesses, institutions, and government organisations across Kerala.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Our Story</h2>
            <h3 className="text-4xl font-extrabold text-foreground mb-6">Built on Precision, Driven by Trust</h3>
            <p className="text-muted-foreground text-lg font-light mb-5 leading-relaxed">
              Accurate Trade Links (ATL) was founded in 2003 with a simple mission: to provide Kerala&apos;s businesses and institutions with reliable, accurate, and affordable weighing and measurement solutions.
            </p>
            <p className="text-muted-foreground font-light mb-8 leading-relaxed">
              Today, ATL serves over 1,00,000 customers across retail, healthcare, manufacturing, logistics, government, and education sectors, providing everything from a simple retail scale to complete factory automation systems.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">{s.icon}</div>
                  <div><div className="font-extrabold text-foreground text-lg">{s.label}</div><div className="text-xs text-muted-foreground font-medium">{s.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-96">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" alt="ATL Showroom" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-white rounded-2xl p-6 shadow-xl">
              <div className="text-4xl font-extrabold">2003</div>
              <div className="text-white/80 text-sm font-medium">Year Founded</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-24">
          {mvv.map((item, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">{item.icon}</div>
              <h3 className="text-xl font-extrabold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-extrabold text-foreground text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-px" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="bg-white border border-border rounded-2xl p-5 inline-block shadow-sm">
                      <p className="text-muted-foreground text-sm font-light">{m.text}</p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-primary/20 z-10 relative">
                      {m.year}
                    </div>
                  </div>
                  <div className="md:hidden flex-1">
                    <div className="bg-white border border-border rounded-2xl p-4">
                      <p className="text-muted-foreground text-sm font-light">{m.text}</p>
                    </div>
                  </div>
                  <div className={`hidden md:block md:w-1/2 ${i % 2 === 1 ? "text-right" : "text-left"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-foreground text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {team.map((member, i) => (
              <div key={i} className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                <div className="relative h-56 overflow-hidden bg-muted">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-foreground text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
