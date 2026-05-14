import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/about-portrait.webp";

export const About = () => (
  <section id="about" className="py-24 md:py-32">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-accent opacity-15 blur-3xl rounded-3xl" aria-hidden />
            <img
              src={portrait}
              alt="Riasnelli — independent brochure design expert and founder of NelliDESiGN studio"
              title="Riasnelli — Brochure Design Expert at NelliDESiGN"
              loading="lazy"
              decoding="async"
              width={900}
              height={1100}
              itemProp="image"
              className="relative rounded-3xl shadow-card w-full max-w-md object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">About</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance leading-[1.05]">
            15+ years designing brochures that get read.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            I'm an independent designer working directly with founders, marketing leads and agencies. No middlemen, no juniors — just senior craft, fast turnarounds, and a focus on print pieces that actually move the needle.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {[
              { k: "15+", v: "Years" },
              { k: "300+", v: "Brochures" },
              { k: "120+", v: "Brands" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-3xl md:text-4xl font-medium text-accent">{s.k}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-10 rounded-full">
            <a href="#contact">Start a Project</a>
          </Button>
        </Reveal>
      </div>
    </div>
  </section>
);
