import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Weighing Systems",
    description: "Retail, industrial, lab, crane & jewellery scales.",
    image: "/images/categories/Weighing Systems.png",
    fallback: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?q=80&w=800",
    link: "/products/weighing",
    count: "13 subcategories"
  },
  {
    title: "Billing Solutions",
    description: "POS terminals, barcode scanners, receipt printers.",
    image: "/images/categories/Billing Solutions.png",
    fallback: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800",
    link: "/products/billing",
    count: "7 subcategories"
  },
  {
    title: "Printing Scales",
    description: "Receipt printing, label printing & AI scale solutions.",
    image: "/images/categories/Printing Scales.png",
    fallback: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800",
    link: "/products/printing-scales",
    count: "5 subcategories"
  },
  {
    title: "Counting Machines",
    description: "Currency, coin & value counting solutions.",
    image: "/images/categories/Counting Machines.png",
    fallback: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800",
    link: "/products/counting",
    count: "4 subcategories"
  },
  {
    title: "Sealing Machines",
    description: "Hand, vacuum, band, heat shrink & foil sealers.",
    image: "/images/categories/Sealing Machines.png",
    fallback: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
    link: "/products/sealing",
    count: "10 subcategories"
  },
  {
    title: "Labelling Systems",
    description: "Batch coders, inkjet printers, bottle labellers.",
    image: "/images/categories/Labelling Systems.png",
    fallback: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800",
    link: "/products/labelling",
    count: "4 subcategories"
  },
  {
    title: "Filling Machines",
    description: "Liquid, paste, milk & pneumatic filling systems.",
    image: "/images/categories/Filling Machines.png",
    fallback: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    link: "/products/filling",
    count: "6 subcategories"
  },
  {
    title: "Other Products",
    description: "Token dispensers, gold analyzers, locker systems.",
    image: "/images/categories/other products.png",
    fallback: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800",
    link: "/products/other",
    count: "3 subcategories"
  }
];

function CategoryCard({ cat }: { cat: typeof categories[0] }) {
  return (
    <Link href={cat.link} className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        <img
          src={cat.image}
          alt={cat.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{cat.count}</span>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{cat.description}</p>
        <div className="flex items-center text-primary font-bold text-sm">
          Browse Products <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function Categories() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Our Solutions</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              Complete Product Ecosystem
            </h3>
          </div>
          <Link href="/products" className="mt-6 md:mt-0 text-primary font-bold flex items-center gap-2 hover:underline underline-offset-4 decoration-2">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
