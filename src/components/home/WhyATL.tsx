import { ShieldCheck, Zap, Wrench, ThumbsUp, Users, Award } from "lucide-react";

export default function WhyATL() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Quality Assured",
      desc: "Every product is rigorously tested to meet industrial standards."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Implementation",
      desc: "Rapid deployment and installation to minimize downtime."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Expert Maintenance",
      desc: "Certified technicians available for repairs and AMC."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Brands",
      desc: "Authorized partners for world-leading technology brands."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Dedicated Training",
      desc: "Comprehensive staff training on all automated systems."
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: "Industry Expertise",
      desc: "Over 25 years of delivering customized B2B solutions."
    }
  ];

  return (
    <section className="py-24 bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">The ATL Advantage</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white">Why Choose ATL?</h3>
          <p className="text-zinc-400 mt-6 text-lg font-light">
            We don&apos;t just sell products; we engineer complete solutions. Our end-to-end service ensures your operations run smoothly and accurately.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
          {features.map((feat, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:-translate-y-2 shadow-xl">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-3">{feat.title}</h4>
                <p className="text-zinc-400 leading-relaxed font-light text-sm sm:text-base">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
