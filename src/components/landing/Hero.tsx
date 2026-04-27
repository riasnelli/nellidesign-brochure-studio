import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-brochures.jpg";
import { GoogleReviewBadge } from "@/components/GoogleReviewBadge";

export const Hero = () => {
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-warm opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-soft" aria-hidden />
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-up flex flex-wrap items-center justify-center gap-2.5 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border/60 shadow-soft text-xs font-medium text-muted-foreground">
              <Sparkles size={14} className="text-accent" />
              Trusted brochure design since 2009 · 15+ years
            </div>
            <GoogleReviewBadge />
          </div>
          <h1 className="fade-up fade-up-delay-1 text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95] text-balance">
            Brochures that <span className="text-accent italic">sell</span>,<br className="hidden md:block" /> not just inform.
          </h1>
          <p className="fade-up fade-up-delay-2 mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Premium, conversion-led brochure design for ambitious brands. Strategy + craft, delivered print-ready.
          </p>
          <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-7 shadow-glow">
              <a href="#contact">Get a Quote <ArrowRight size={16} className="ml-1" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 bg-card">
              <a href="#work">View Work</a>
            </Button>
          </div>
          <p className="fade-up fade-up-delay-4 mt-6 text-xs text-muted-foreground">
            Avg. response under 2 hours · Fixed quotes · 100% satisfaction
          </p>
        </div>

        <div className="fade-up fade-up-delay-4 mt-16 md:mt-20 relative">
          <div className="absolute -inset-4 bg-gradient-accent opacity-20 blur-3xl rounded-[3rem]" aria-hidden />
          <img
            src={heroImg}
            alt="Premium corporate brochure designs by NelliDESiGN"
            width={1600}
            height={1200}
            className="relative w-full rounded-3xl shadow-card"
          />
        </div>
      </div>
    </section>
  );
};
