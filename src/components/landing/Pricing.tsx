import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₹1,500",
    unit: "/ Page",
    tagline: "For quick, no-frills brochures",
    features: [
      "Up to 4 A4 pages",
      "Clean, professional layout design",
      "Client provides all content, images & logo",
      "1 sample page (free) before confirmation",
      "Limited revisions (focused execution, no back-and-forth chaos)",
      "Print-ready high-resolution files",
    ],
    best: "Small businesses, simple flyers, fast requirements",
    cta: "Order Basic",
    highlight: false,
  },
  {
    name: "Standard",
    badge: "Most Popular",
    price: "₹1,200",
    unit: "/ Page",
    tagline: "For brands that need structure and consistency",
    features: [
      "Minimum 8 A4 pages",
      "Strategic layout with better visual flow",
      "Typography + spacing refinement (not just placing content)",
      "Basic visual enhancement (icons, styling, alignment consistency)",
      "Client provides content & brand assets",
      "1 sample page (free) before confirmation",
      "Structured revision process",
      "Print-ready high-resolution files",
    ],
    best: "Company profiles, detailed brochures, serious presentations",
    cta: "Start Standard",
    highlight: true,
  },
  {
    name: "Premium",
    badge: "Custom Experience",
    price: "Custom",
    unit: "Pricing",
    tagline: "For brands that want impact, not just design",
    features: [
      "Complete brochure strategy + layout planning",
      "Content writing / content restructuring included",
      "Brand alignment & visual direction (colors, typography, tone)",
      "Custom design concepts based on references & goals",
      "Image sourcing / styling support",
      "High-end, conversion-focused design approach",
      "Multiple design directions (if required)",
      "Priority workflow & deeper collaboration",
    ],
    best: "Established brands, premium businesses, high-stakes presentations",
    cta: "Request a Quote",
    highlight: false,
  },
];

const steps = [
  { n: "1", title: "Share your requirement" },
  { n: "2", title: "Get a free sample page" },
  { n: "3", title: "Approve & pay upfront to begin" },
  { n: "4", title: "Final delivery after completion & balance payment" },
];

export const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-secondary/30">
    <div className="container">
      <Reveal>
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Pricing Plans</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance">
            Transparent pricing. No surprises.
          </h2>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 80}>
            <article
              className={
                p.highlight
                  ? "relative h-full rounded-3xl p-8 bg-card border-2 border-accent shadow-card md:-translate-y-3 md:scale-[1.02]"
                  : "relative h-full rounded-3xl p-8 bg-card border border-border/60 shadow-soft"
              }
            >
              {p.badge && (
                <span
                  className={
                    p.highlight
                      ? "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium"
                      : "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-muted-foreground font-medium"
                  }
                >
                  {p.badge}
                </span>
              )}
              <h3 className="font-display text-2xl font-medium">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{p.tagline}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-4xl font-medium">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="text-foreground/80 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mb-5">
                <span className="font-medium text-foreground">Best for:</span> {p.best}
              </p>
              <Button
                asChild
                className="w-full rounded-full"
                variant={p.highlight ? "default" : "outline"}
              >
                <a href="#contact">{p.cta}</a>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-20">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">How It Works</p>
            <h3 className="text-3xl md:text-4xl font-display font-medium text-balance">
              Four simple steps from brief to delivery.
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-display font-medium flex items-center justify-center mb-4">
                  {s.n}
                </div>
                <p className="text-sm font-medium leading-relaxed">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
