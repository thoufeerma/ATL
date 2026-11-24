// Blog posts shown on /blog and /blog/[id]. Full article text isn't written yet.
export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How to Choose the Right Weighing Scale for Your Supermarket",
    excerpt: "From trade certification to capacity and accuracy – a complete buyer's guide to retail weighing scales.",
    category: "Buying guides",
    date: "May 20, 2026",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Understanding OIML and NABL Certification for Industrial Scales",
    excerpt: "What legal-for-trade certification means and why it matters for businesses in India.",
    category: "Product guides",
    date: "May 12, 2026",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1600",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Top 5 Barcode Scanner Brands for Retail Businesses in 2026",
    excerpt: "Zebra, Honeywell, and more – comparing the best enterprise barcode scanners for modern retail.",
    category: "Industry news",
    date: "May 5, 2026",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Preventive Maintenance Tips for Your Billing and POS System",
    excerpt: "Simple maintenance steps to extend the life of your POS system and avoid costly repairs.",
    category: "Maintenance tips",
    date: "April 28, 2026",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "ATL Completes 50-Point Supermarket Installation in Kochi",
    excerpt: "A behind-the-scenes look at our largest supermarket outfitting project – 50 billing counters in 72 hours.",
    category: "Case studies",
    date: "April 15, 2026",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1600",
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "AI-Powered Scales: The Future of Retail Automation",
    excerpt: "Exploring how AI-powered pricing and recognition scales are revolutionizing modern grocery retail.",
    category: "Technology",
    date: "April 5, 2026",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600",
    readTime: "6 min read",
  },
];

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export const categorySlug = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-");
