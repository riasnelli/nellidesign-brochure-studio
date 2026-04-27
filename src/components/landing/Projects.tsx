import { Reveal } from "@/components/Reveal";
import { ArrowUpRight } from "lucide-react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

const projects = [
  { title: "Meridian Capital", category: "Company Profile", img: p1, pdf: "#" },
  { title: "Atelier Goods Co.", category: "Product Catalogue", img: p2, pdf: "#" },
  { title: "Verde Holdings", category: "Corporate Brochure", img: p3, pdf: "#" },
  { title: "Northline Estates", category: "Real Estate", img: p4, pdf: "#" },
  { title: "Bistro 32", category: "Hospitality Menu", img: p5, pdf: "#" },
  { title: "UbnMe Healthcare", category: "Annual Report", img: p6, pdf: "#" },
];

export const Projects = () => (
  <section id="work" className="py-24 md:py-32">
    <div className="container">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Selected Work</p>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-balance">
              Brochures crafted for <em className="not-italic text-accent">real</em> business outcomes.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            A glimpse of recent client projects across finance, real estate, hospitality and healthcare.
          </p>
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <a
              href={p.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] shadow-soft">
                <img
                  src={p.img}
                  alt={`${p.title} brochure design`}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-medium">{p.title}</h3>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
