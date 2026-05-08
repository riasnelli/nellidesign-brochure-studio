import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-brochures.webp";
import { GoogleReviewBadge } from "@/components/GoogleReviewBadge";

export const Hero = ({ compact = false }: { compact?: boolean } = {}) => {
  return (
    <section
      id="top"
      className={
        compact
          ? "relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden"
          : "relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      }
    >
      <div className="absolute inset-0 bg-gradient-warm opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-soft" aria-hidden />
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-up flex flex-col md:flex-row flex-wrap items-center justify-center gap-2.5 mb-8">
            <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border/60 shadow-soft text-xs font-medium text-muted-foreground">
              <Sparkles size={14} className="text-accent" />
              Trusted Brochure Design Expert Since 2009 · 15+ years
            </div>
            <GoogleReviewBadge />
            <p className="md:hidden text-xs font-medium text-muted-foreground inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-accent" />
              Trusted Brochure Design Expert Since 2009 · 15+ years
            </p>
          </div>
          <h1 className="fade-up fade-up-delay-1 font-medium text-muted-foreground mb-2 whitespace-nowrap md:whitespace-normal text-[1rem] md:text-[1.3rem]">
            Professional Brochure Design Expert in India
          </h1>
          <h2 className="fade-up fade-up-delay-1 font-display font-bold tracking-tight leading-[0.95] text-balance text-[3rem] md:text-[5.5rem]">
            Brochures that <span className="text-accent italic">perform</span>,<br className="hidden md:block" /> not just inform.
          </h2>
          <p className="fade-up fade-up-delay-2 mt-7 text-lg md:text-xl text-muted-foreground mx-auto text-balance" style={{ maxWidth: "52rem" }}>
            Premium brochure, company profile, and catalogue design services for ambitious brands across India — crafted for print, branding, and sales performance.
          </p>
          <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-7 shadow-glow">
            <a href="#contact">Start Your Brochure <ArrowRight size={16} className="ml-1" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 bg-card">
              <a href="#work">View Work</a>
            </Button>
          </div>
          <p className="fade-up fade-up-delay-4 mt-6 text-xs text-muted-foreground">
            Based in Kochi, Kerala — Serving Bangalore, Chennai, Mumbai, Delhi, Hyderabad & all over India.
          </p>
        </div>

        <div className="fade-up fade-up-delay-4 mt-16 md:mt-20 relative">
          <div className="absolute -inset-4 bg-gradient-accent opacity-20 blur-3xl rounded-[3rem]" aria-hidden />
          <img
            src={heroImg}
            alt="Premium corporate brochure designs by NelliDESiGN"
            width={1600}
            height={1200}
            fetchPriority="high"
            decoding="async"
            loading="eager"
            sizes="(max-width: 768px) 100vw, 1200px"
            className="relative w-full rounded-3xl shadow-card"
          />
        </div>
      </div>
    </section>
  );
};
