import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";
import PostCard from "@/components/blog/PostCard";
import { BLOG_CATEGORIES, BLOG_POSTS, categorySlug } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog | Accurate Trade Links",
  description: "Buying guides, maintenance tips, case studies and industry news on weighing, billing and packaging equipment.",
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const activeCategory = BLOG_CATEGORIES.find((c) => categorySlug(c) === cat) ?? null;
  const posts = activeCategory ? BLOG_POSTS.filter((p) => p.category === activeCategory) : BLOG_POSTS;
  const [featured, ...rest] = activeCategory ? [null, ...posts] : posts;

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      on ? "border-secondary bg-secondary text-white" : "border-secondary/15 bg-white text-secondary hover:border-secondary/40"
    }`;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Blog" }]}
        title="Guides, tips and"
        accent="notes from the field."
        intro="Buying guides, maintenance tips and case studies from the people who install and repair these machines every day."
      />

      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto">
          <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
            <Link href="/blog" scroll={false} aria-current={!activeCategory ? "page" : undefined} className={chip(!activeCategory)}>
              All
            </Link>
            {BLOG_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/blog?cat=${categorySlug(c)}`}
                scroll={false}
                aria-current={activeCategory === c ? "page" : undefined}
                className={chip(activeCategory === c)}
              >
                {c}
              </Link>
            ))}
          </nav>

          {featured && (
            <Reveal className="mt-10">
              <Link
                href={`/blog/${featured.id}`}
                className="group grid lg:grid-cols-12 gap-2.5 rounded-3xl bg-white p-2.5 transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(18,26,43,0.3)]"
              >
                <div className="relative lg:col-span-7 aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src={featured.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col p-5 sm:p-8">
                  <span className="text-sm text-muted-foreground">
                    {featured.category} <span className="mx-1.5 text-secondary/20">·</span> {featured.readTime}
                  </span>
                  <h2 className="mt-4 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.08] text-secondary">{featured.title}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-8 lg:mt-auto flex items-center justify-between pt-4 text-sm text-muted-foreground">
                    {featured.date}
                    <span className="inline-flex items-center gap-1.5 font-semibold text-secondary transition-colors group-hover:text-primary">
                      Read article
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => post && (
              <Reveal as="li" key={post.id} delay={(i % 3) * 0.08}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
