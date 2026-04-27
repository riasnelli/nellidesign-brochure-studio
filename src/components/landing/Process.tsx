import { Reveal } from "@/components/Reveal";

const steps = [
  { n: "01", title: "Discovery", text: "Quick brief call to understand your audience, goals and brand." },
  { n: "02", title: "Strategy & Concept", text: "I map content flow, hierarchy and 1–2 visual directions." },
  { n: "03", title: "Design & Refine", text: "Full layout in Adobe InDesign with two rounds of revisions." },
  { n: "04", title: "Deliver", text: "Print-ready PDFs, web PDFs, and source files — exactly when promised." },
];

export const Process = () => (
  <section id="process" className="py-24 md:py-32 bg-gradient-warm">
    <div className="container">
      <Reveal>
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Process</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance">
            A calm, predictable path from brief to print.
          </h2>
        </div>
      </Reveal>
      <div className="relative grid md:grid-cols-4 gap-8">
        <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" aria-hidden />
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 100}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-soft flex items-center justify-center font-display text-sm font-medium mb-5 relative z-10">
                {s.n}
              </div>
              <h3 className="font-display text-xl font-medium mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
