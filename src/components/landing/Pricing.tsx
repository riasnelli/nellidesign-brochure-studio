import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Check, FileText, Sparkles, CheckCircle2, PackageCheck } from "lucide-react";

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
  { n: "1", title: "Share Requirement", desc: "Tell us about your project", Icon: FileText },
  { n: "2", title: "Free Sample Page", desc: "Preview the design direction", Icon: Sparkles },
  { n: "3", title: "Approve & Pay", desc: "Confirm with upfront payment", Icon: CheckCircle2 },
  { n: "4", title: "Final Delivery", desc: "Receive files on balance payment", Icon: PackageCheck },
];

export const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-secondary/30">
    <div className="container">
      <Reveal>
        <div className="max-w-2xl mx-auto text-center mb-14">
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
                type="button"
                className="w-full rounded-full"
                variant={p.highlight ? "default" : "outline"}
                onClick={() => {
                  try {
                    sessionStorage.setItem("selectedPlan", p.name);
                  } catch {}
                  window.dispatchEvent(
                    new CustomEvent("plan:selected", { detail: { plan: p.name } })
                  );
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  else window.location.hash = "#contact";
                }}
              >
                {p.cta}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="relative flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center ring-1 ring-accent/20">
                    <s.Icon size={26} strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-foreground text-[11px] font-medium flex items-center justify-center shadow-soft">
                    {s.n}
                  </span>
                </div>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[180px]">
                  {s.desc}
                </p>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px border-t border-dashed border-border"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
