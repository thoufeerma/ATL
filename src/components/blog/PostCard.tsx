import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog-posts";

// Article card, same look as the home page "Read before you buy" cards.
export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.id}`}
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
          <span>
            {post.date} <span className="mx-1.5 text-secondary/20">·</span> {post.readTime}
          </span>
          <ArrowUpRight className="h-5 w-5 text-secondary transition-all group-hover:rotate-45 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
