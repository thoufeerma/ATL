import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Brands from "@/components/home/Brands";
import Categories from "@/components/home/Categories";
import IndustriesServed from "@/components/home/IndustriesServed";
import HowWeWork from "@/components/home/HowWeWork";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accurate Trade Links (ATL) | Precision Weighing, Billing & Industrial Automation Solutions",
  description: "ATL is Kerala's leading provider of weighing systems, billing solutions, packaging machinery, labelling, filling machines and after-sales service. Trusted by 1,00,000+ customers.",
  keywords: "weighing scales Kerala, billing systems, POS systems, barcode scanners, packaging machinery, industrial automation, ATL",
  openGraph: {
    title: "Accurate Trade Links (ATL)",
    description: "Precision Weighing, Billing & Industrial Automation Solutions",
    type: "website",
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <Brands />
      <Categories />
      <HowWeWork />
      <IndustriesServed />
      <Testimonials />
      <BlogSection />
      <Footer />
    </main>
  );
}


