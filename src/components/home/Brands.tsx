export default function Brands() {
  const brands = [
    "ATL CASIO", "Scangle", "Yes Weigh", "Essae", "Phoenix", 
    "Wepsol", "CONTECH", "Maxsell", "Adler", "Mettler Toledo", "CAS", "TSC"
  ];

  return (
    <section className="py-20 bg-white border-y border-border">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">
          Trusted Global Partners & Brands
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-70">
          {brands.map((brand, i) => (
            <div key={i} className="text-2xl md:text-3xl font-extrabold text-slate-400 hover:text-primary transition-colors duration-300 cursor-pointer">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
