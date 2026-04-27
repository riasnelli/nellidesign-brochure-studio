import { Reveal } from "@/components/Reveal";

const tools = ["InDesign", "Illustrator", "Photoshop", "Acrobat", "Bridge", "Figma"];

export const Tools = () => (
  <section className="py-20 border-y border-border bg-secondary/30">
    <div className="container">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <p className="text-sm text-muted-foreground max-w-xs">
            Crafted in the industry-standard Adobe Suite — print-ready, every time.
          </p>
          <ul className="flex flex-wrap gap-x-10 gap-y-4 font-display text-xl md:text-2xl text-foreground/70">
            {tools.map((t) => (
              <li key={t} className="hover:text-accent transition-colors cursor-default">{t}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);
