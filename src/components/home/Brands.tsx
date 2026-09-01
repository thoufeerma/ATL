export default function Brands() {
  const brands = [
    "ATL CASIO", "Scangle", "Yes Weigh", "Essae", "Phoenix", 
    "Wepsol", "CONTECH", "Maxsell", "Adler", "Mettler Toledo", "CAS", "TSC"
  ];

  return (
    <section className="py-20 bg-white border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 text-center mb-12">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Trusted Global Partners & Brands
        </h2>
      </div>
      
      <div className="relative w-full overflow-hidden opacity-70 flex group">
        <div className="flex animate-marquee whitespace-nowrap w-max group-hover:pause">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="inline-block px-8 md:px-12 text-2xl md:text-3xl font-extrabold text-slate-400 hover:text-primary transition-colors duration-300 cursor-pointer">
              {brand}
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .pause {
          animation-play-state: paused !important;
        }
      `}} />
    </section>
  );
}
