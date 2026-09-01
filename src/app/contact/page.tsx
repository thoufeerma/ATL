"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const departments = [
  { id: "sales", label: "Sales Enquiry" },
  { id: "support", label: "Customer Support" },
  { id: "technical", label: "Technical Support" },
  { id: "service", label: "Service Request" },
  { id: "accounts", label: "Accounts / Billing" }
];

export default function ContactPage() {
  const [dept, setDept] = useState("sales");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-secondary text-white pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">Contact</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Get In Touch</h1>
          <p className="text-zinc-300 text-lg font-light max-w-3xl">Our team of experts is ready to help you find the perfect solution for your business.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-foreground mb-2">Send Us a Message</h2>
            <p className="text-muted-foreground mb-6 font-light">We will respond within one business day.</p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground mb-2">Select Department</label>
              <div className="flex flex-wrap gap-2">
                {departments.map(d => (
                  <button key={d.id} onClick={() => setDept(d.id)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${dept === d.id ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Phone Number *</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 00000 00000" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Describe your requirement..." className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium resize-none" />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold text-lg h-14 gap-3">
                  <Send className="w-5 h-5" /> Send Message
                </Button>
              </form>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground mb-3">Message Received!</h3>
                <p className="text-muted-foreground font-light">Thank you, {form.name}. Our team will respond within one business day.</p>
                <Button className="mt-8 rounded-full bg-primary text-white font-bold" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}>Send Another Message</Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-secondary text-white rounded-2xl p-6">
              <h3 className="font-extrabold text-lg mb-4">Contact Information</h3>
              <div className="space-y-4 text-sm font-light">
                <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><div className="font-semibold text-white">Phone</div><div className="text-zinc-300">+91 9747541006, 0471 2334553</div></div></div>
                <div className="flex items-start gap-3"><MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><div className="font-semibold text-white">WhatsApp</div><div className="text-zinc-300">+91 9747541006</div></div></div>
                <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><div className="font-semibold text-white">Email</div><div className="text-zinc-300">accuratetradelinks@gmail.com</div></div></div>
                <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><div className="font-semibold text-white">Address</div><div className="text-zinc-300">ACCURATE TRADE LINKS<br/>TC 26/640(3), Future Centre<br/>Oottukuzhy Road, Trivandrum-1</div></div></div>
                <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><div className="font-semibold text-white">Working Hours</div><div className="text-zinc-300">Monday to Saturday: 9AM to 6PM</div></div></div>
                <div className="flex items-start gap-3 pt-2 text-zinc-500 font-mono text-xs">GST: 32AHJPK1741Q1Z4</div>
              </div>
            </div>
            <div className="bg-green-500 rounded-2xl p-6 text-white text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-extrabold text-lg mb-2">WhatsApp Us Now</h3>
              <p className="text-white/80 text-sm mb-4 font-light">Get instant response on WhatsApp during business hours.</p>
              <a href="https://wa.me/919747541006" target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 rounded-full bg-white text-green-600 font-bold text-sm hover:bg-green-50 text-center">
                Open WhatsApp
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border h-56 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Map - Thiruvananthapuram</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
