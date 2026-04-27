import { Reveal } from "@/components/Reveal";

const services = [
  { title: "Company Profile", desc: "Polished introductions that build instant credibility with new clients and investors.", tag: "12–24 pages" },
  { title: "Product Catalogue", desc: "Structured layouts that make browsing effortless and shopping easy.", tag: "Custom length" },
  { title: "Corporate Brochure", desc: "Premium positioning pieces for enterprises, B2B and professional services.", tag: "8–32 pages" },
  { title: "Annual Reports", desc: "Data-driven storytelling with infographics, financial tables and brand polish.", tag: "Long-form" },
  { title: "Real Estate Brochures", desc: "High-end property presentations for developers, agents and architects.", tag: "Visual-led" },
  { title: "Event & Pitch Decks", desc: "Investor decks, event programs and conference brochures with impact.", tag: "On-demand" },
];

export const Services = () => (
  <section id="services" className="py-24 md:py-32">
    <div className="container">
      <Reveal>
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Services</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance">
            Every kind of brochure your business needs.
          </h2>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <article className="h-full bg-background p-8 hover:bg-secondary/50 transition-colors group">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-xs text-muted-foreground tabular-nums">0{i + 1}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {s.tag}
                </span>
              </div>
              <h3 className="font-display text-2xl font-medium mb-3 group-hover:text-accent transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
