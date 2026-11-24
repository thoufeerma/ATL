import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero, { HeroActions } from "@/components/layout/PageHero";
import Reveal from "@/components/motion/Reveal";
import PostCard from "@/components/blog/PostCard";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsappLink } from "@/lib/contact";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => String(p.id) === id);
  return post ? { title: `${post.title} | ATL Blog`, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => String(p.id) === id);
  if (!post) notFound();

  const more = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.category }]}
        title={post.title}
        intro={
          <>
            {post.date} <span className="mx-1.5 text-white/25">·</span> {post.readTime}
          </>
        }
      />

      <article className="py-16 lg:py-24">
        <div className="container mx-auto">
          <Reveal>
            <div className="aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-secondary">
              <img src={post.image} alt="" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <div className="mx-auto mt-12 max-w-2xl">
            <p className="text-xl sm:text-2xl leading-relaxed tracking-[-0.01em] text-secondary">{post.excerpt}</p>
            {/* No article body has been written yet; offer a direct answer instead. */}
            <div className="mt-10 rounded-2xl bg-muted p-6 sm:p-8">
              <p className="font-semibold text-secondary">The full article is on its way.</p>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Want an answer now? Tell us about your business and we will recommend a model and send the price.
              </p>
              <div className="mt-6">
                <HeroActions
                  whatsapp={whatsappLink(`Hello ATL, I read "${post.title}" and have a question:`)}
                  phoneHref={`tel:${PHONE_NUMBER}`}
                  phoneLabel={PHONE_DISPLAY}
                  tone="light"
                />
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto">
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] text-secondary">More to read</h2>
          <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {more.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.08}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
