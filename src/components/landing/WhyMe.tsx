import { Reveal } from "@/components/Reveal";
import { Target, Palette, Rocket, ShieldCheck } from "lucide-react";

const points = [
  { icon: Target, title: "Strategy first", text: "Every layout decision starts with your audience and the action you want them to take." },
  { icon: Palette, title: "Design that elevates", text: "Editorial typography, restrained palettes, and details that signal premium." },
  { icon: Rocket, title: "Print + digital ready", text: "Files prepped for press, plus optimized PDFs for email and web sharing." },
  { icon: ShieldCheck, title: "On-time, on-brief", text: "Clear milestones, fast revisions, and a process you can rely on." },
];

export const WhyMe = () => (
  <section className="py-24 md:py-32 bg-secondary/40">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Why Choose Me</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance leading-[1.05]">
            Strategy and craft, working together.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-md">
            A brochure is a sales tool. I design with that in mind — pairing rigorous information design with the kind of detail that makes prospects trust you on first look.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-5">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full p-6 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-card transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                  <p.icon size={18} className="text-accent" />
                </div>
                <h3 className="font-display text-lg font-medium mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
