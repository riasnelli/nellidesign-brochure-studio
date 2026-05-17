import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";

const faqs = [
  { q: "How long does a brochure project take?", a: "Most company profiles and brochures take 7–14 days from brief approval to print-ready files. Rush projects are possible — just ask." },
  { q: "Do you provide content writing?", a: "I focus on design, but I work closely with your copy and can recommend trusted copywriters in my network if needed." },
  { q: "What do I need to start?", a: "A brief on your audience, goals, page count and any existing brand assets (logo, fonts, photos). I'll guide you if any of these are missing." },
  { q: "Do you handle printing?", a: "I deliver press-ready files and can recommend reliable print partners locally and internationally." },
  { q: "How does pricing work?", a: "Fixed project quotes — no hourly billing surprises. Send me your brief and you'll get a detailed proposal within a day." },
  { q: "How many revisions are included?", a: "Two full rounds of revisions are included in every project. Additional rounds can be added if needed." },
];

export const FAQ = () => {
  return (
  <section id="faq" className="py-24 md:py-32 bg-secondary/40">
    <div className="container max-w-3xl">
      <Reveal>
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance">
            Questions, answered.
          </h2>
        </div>
      </Reveal>
      <Reveal>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-2xl border border-border/60 px-6 shadow-soft">
              <AccordionTrigger className="text-left font-display text-lg font-medium hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
  );
};
