import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { ChevronRight, LifeBuoy, Phone, MessageSquare, FileText, Video, BookOpen, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportCards = [
  { icon: <Phone className="w-7 h-7" />, title: "Customer Care", desc: "Reach our support team for any product queries, complaints, or general assistance.", action: "Call: +91 9000 000 000", color: "bg-blue-50 text-blue-600 border-blue-100", href: undefined },
  { icon: <Settings className="w-7 h-7" />, title: "Technical Support", desc: "Expert technical engineers available for troubleshooting and diagnostics.", action: "Email: tech@atl.in", color: "bg-primary/10 text-primary border-primary/20", href: undefined },
  { icon: <FileText className="w-7 h-7" />, title: "Service Request", desc: "Submit a service request for repair, calibration, or on-site support visit.", action: "Submit Request", color: "bg-amber-50 text-amber-600 border-amber-100", href: undefined },
  { icon: <LifeBuoy className="w-7 h-7" />, title: "Warranty Registration", desc: "Register your ATL product to activate warranty and receive priority support.", action: "Register Product", color: "bg-green-50 text-green-600 border-green-100", href: undefined },
  { icon: <BookOpen className="w-7 h-7" />, title: "Documentation Center", desc: "Download product manuals, calibration certificates, and compliance documents.", action: "Browse Docs", color: "bg-purple-50 text-purple-600 border-purple-100", href: undefined },
  { icon: <Video className="w-7 h-7" />, title: "Video Tutorials", desc: "Step-by-step video guides for installation, operation, and maintenance.", action: "Watch Videos", color: "bg-rose-50 text-rose-600 border-rose-100", href: undefined },
  { icon: <MessageSquare className="w-7 h-7" />, title: "AMC Registration", desc: "Enroll your equipment in our Annual Maintenance Contract for priority coverage.", action: "Enroll in AMC", color: "bg-indigo-50 text-indigo-600 border-indigo-100", href: undefined },
  { icon: <HelpCircle className="w-7 h-7" />, title: "FAQ", desc: "Find instant answers to common questions about our products and services.", action: "View FAQs", color: "bg-teal-50 text-teal-600 border-teal-100", href: undefined },
  { icon: <Settings className="w-7 h-7" />, title: "Engineer Portal", desc: "Access the internal sales and service training portal for engineers.", action: "Engineer Login", color: "bg-zinc-800 text-white border-zinc-700", href: "/engineer/login" }
];

const faqs = [
  { q: "How do I register my product warranty?", a: "Fill in the Warranty Registration form above or WhatsApp us the invoice and serial number of your product." },
  { q: "What is your service coverage area?", a: "ATL provides service coverage across all districts of Kerala, with engineers based in Thiruvananthapuram, Kochi, Kozhikode, and Thrissur." },
  { q: "How long does a repair take?", a: "Standard repairs are completed within 24-48 hours. Complex repairs may take up to 5 working days with prior communication." },
  { q: "What is included in the AMC?", a: "Our AMC includes scheduled preventive maintenance visits, priority response, telephone support, and discounted spare parts." },
  { q: "Can I get same-day installation?", a: "Yes, same-day installation is available for products purchased before 2 PM on working days, subject to engineer availability in your area." },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-secondary text-white pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">Support</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Customer Support</h1>
          <p className="text-zinc-300 text-lg font-light max-w-3xl">
            ATL&apos;s dedicated support team is here to help you at every stage – from product registration to after-sales service.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="bg-primary text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-16">
          <div>
            <div className="font-extrabold text-xl mb-1">Need Immediate Help?</div>
            <p className="text-white/80 text-sm">Our support engineers are available Mon-Sat 9AM-6PM, Emergency support 24/7</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button className="rounded-full bg-white text-primary font-bold hover:bg-zinc-100 gap-2">
              <Phone className="w-4 h-4" /> Call Support
            </Button>
            <Button variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-primary font-bold gap-2 bg-transparent">
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {supportCards.map((card, i) => {
            const CardContent = (
              <div className={`h-full rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${card.color}`}>
                <div className="mb-4">{card.icon}</div>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-sm opacity-80 mb-5 font-light">{card.desc}</p>
                <Button size="sm" variant="outline" className="rounded-full font-bold border-current opacity-80 hover:opacity-100 text-current bg-transparent">
                  {card.action}
                </Button>
              </div>
            );

            return card.href ? (
              <Link href={card.href} key={i} className="block h-full">
                {CardContent}
              </Link>
            ) : (
              <div key={i} className="block h-full">
                {CardContent}
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-border rounded-2xl overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer font-bold text-foreground flex items-center justify-between list-none hover:text-primary">
                  {faq.q}
                  <span className="text-primary ml-4 flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-5 text-muted-foreground font-light">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
