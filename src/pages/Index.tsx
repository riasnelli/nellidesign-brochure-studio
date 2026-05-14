import { lazy, Suspense, useEffect, useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { api } from "@/lib/api";

const BottomNav = lazy(() => import("@/components/landing/BottomNav").then(m => ({ default: m.BottomNav })));
const Projects = lazy(() => import("@/components/landing/Projects").then(m => ({ default: m.Projects })));
const WhyMe = lazy(() => import("@/components/landing/WhyMe").then(m => ({ default: m.WhyMe })));
const Services = lazy(() => import("@/components/landing/Services").then(m => ({ default: m.Services })));
const Process = lazy(() => import("@/components/landing/Process").then(m => ({ default: m.Process })));
const About = lazy(() => import("@/components/landing/About").then(m => ({ default: m.About })));
const Tools = lazy(() => import("@/components/landing/Tools").then(m => ({ default: m.Tools })));
const Pricing = lazy(() => import("@/components/landing/Pricing").then(m => ({ default: m.Pricing })));
const Testimonials = lazy(() => import("@/components/landing/Testimonials").then(m => ({ default: m.Testimonials })));
const FAQ = lazy(() => import("@/components/landing/FAQ").then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import("@/components/landing/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/landing/Footer").then(m => ({ default: m.Footer })));

const Index = () => {
  const [navPosition, setNavPosition] = useState<"top" | "bottom">("top");

  useEffect(() => {
    api.getSettings()
      .then((s) => setNavPosition(s.navPosition === "bottom" ? "bottom" : "top"))
      .catch(() => {/* keep default */});
  }, []);

  useEffect(() => {
    document.title = "NelliDESiGN — Premium Brochure Design Studio";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta(
      "description",
      "Premium brochure design — company profiles, product catalogues and corporate brochures that convert. Fixed quote in 24 hours."
    );
    setOg("og:title", "NelliDESiGN — Premium Brochure Design Studio");
    setOg("og:description", "Premium brochure design — company profiles, product catalogues and corporate brochures that convert.");
    setOg("og:url", window.location.origin + "/");
    setOg("og:image", window.location.origin + "/og-image.jpg");
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + "/";

    const ld = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "NelliDESiGN",
      description: "Premium brochure design studio specialising in company profiles, product catalogues and corporate brochures.",
      areaServed: "Worldwide",
      url: window.location.origin,
      telephone: "+919497127222",
      image: window.location.origin + "/og-image.jpg",
    };
    let script = document.getElementById("ld-json") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-json";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, []);

  return (
    <main>
      {navPosition === "top" && <Navbar />}
      <Hero compact={navPosition === "bottom"} />
      <Suspense fallback={null}>
        <Projects />
        <WhyMe />
        <Services />
        <Process />
        <About />
        <Tools />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
        <Footer />
        {navPosition === "bottom" && <BottomNav />}
      </Suspense>
    </main>
  );
};

export default Index;
