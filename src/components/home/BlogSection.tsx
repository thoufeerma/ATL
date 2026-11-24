import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import Reveal from "@/components/motion/Reveal";

const latestPosts = [
  {
    title: "How to Choose the Right Weighing Scale for Your Supermarket",
    category: "Buying guide",
    date: "May 20, 2026",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000",
    link: "/blog/1",
  },
  {
    title: "Top 5 Barcode Scanner Brands for Retail Businesses in 2026",
    category: "Industry news",
    date: "May 5, 2026",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000",
    link: "/blog/3",
  },
  {
    title: "AI-Powered Scales: The Future of Retail Automation",
    category: "Technology",
    date: "April 5, 2026",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000",
    link: "/blog/6",
  },
];

export default function BlogSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto">
        <SectionHeader
          title={<>Read before you buy.</>}
          link={{ href: "/blog", text: "All articles" }}
        />

        <ul className="grid md:grid-cols-3 gap-5">
          {latestPosts.map((post, i) => (
            <Reveal as="li" key={post.link} delay={i * 0.08}>
              <Link
                href={post.link}
                className="group flex h-full flex-col rounded-2xl bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(18,26,43,0.25)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-secondary backdrop-blur">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-secondary">{post.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-5 text-sm text-muted-foreground">
                    {post.date}
                    <ArrowUpRight className="h-5 w-5 text-secondary transition-all group-hover:rotate-45 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
