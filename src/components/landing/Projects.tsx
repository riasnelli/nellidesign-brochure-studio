import { Reveal } from "@/components/Reveal";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

type Brochure = {
  title: string;
  slug: string;
  category: string;
  thumbnail?: string;
  pdf?: string;
};

export const Projects = () => {
  const [brochures, setBrochures] = useState<Brochure[]>([]);

  useEffect(() => {
    // Reuse the warm fetch promise kicked off from index.html when available.
    const pre = (typeof window !== "undefined" && (window as any).__preFetch?.["/api/brochures.php"]) as Promise<unknown> | undefined;
    const p = pre ?? fetch("/api/brochures.php", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    p.then((data) => {
      if (Array.isArray(data)) setBrochures(data.filter((b: Brochure) => b.thumbnail && b.pdf));
    });
  }, []);

  return (
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
        {brochures.map((b, i) => (
          <Reveal key={b.slug} delay={i * 80}>
            <article>
              <a
                href={b.pdf}
                target="_blank"
                rel="noopener noreferrer"
                title={`View ${b.title} brochure PDF`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] shadow-soft">
                  <img
                    src={`${b.thumbnail}${b.thumbnail!.includes("?") ? "&" : "?"}w=400`}
                    srcSet={`${b.thumbnail}${b.thumbnail!.includes("?") ? "&" : "?"}w=400 400w, ${b.thumbnail}${b.thumbnail!.includes("?") ? "&" : "?"}w=600 600w, ${b.thumbnail}${b.thumbnail!.includes("?") ? "&" : "?"}w=900 900w`}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    alt={`${b.title} brochure design - ${b.category}`}
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={1100}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                    <span className="text-background font-display text-lg font-medium tracking-wide">
                      View Brochure
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-medium">{b.title}</h3>
                  <span className="text-xs text-muted-foreground">{b.category}</span>
                </div>
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
  );
};
