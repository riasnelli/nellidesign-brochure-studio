import { Reveal } from "@/components/Reveal";
import { Star } from "lucide-react";

const items = [
  {
    quote: "Our investor brochure finally matched the quality of our product. We closed two deals in the month it launched.",
    name: "Priya Sharma",
    role: "Co-founder, Meridian Capital",
  },
  {
    quote: "Calm, professional and unbelievably fast. The catalogue increased catalog requests by 40% in the first quarter.",
    name: "Marcus Lin",
    role: "Marketing Lead, Atelier Goods",
  },
  {
    quote: "Best brochure designer I've worked with in 20 years. Strategic, detail-obsessed, and a joy to collaborate with.",
    name: "Helena Voss",
    role: "Director, Verde Holdings",
  },
];

export const Testimonials = () => (
  <section className="py-24 md:py-32">
    <div className="container">
      <Reveal>
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Clients</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance">
            Trusted by founders and marketing teams worldwide.
          </h2>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 100}>
            <figure className="h-full p-8 rounded-2xl bg-card border border-border/60 shadow-soft flex flex-col">
              <div className="flex gap-0.5 text-accent mb-5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="font-display text-lg leading-snug text-balance flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border/60">
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
