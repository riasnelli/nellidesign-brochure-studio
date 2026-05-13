import { Navbar } from "@/components/landing/Navbar";
import { BottomNav } from "@/components/landing/BottomNav";
import { Hero } from "@/components/landing/Hero";
import { Projects } from "@/components/landing/Projects";
import { WhyMe } from "@/components/landing/WhyMe";
import { Services } from "@/components/landing/Services";
import { Process } from "@/components/landing/Process";
import { About } from "@/components/landing/About";
import { Tools } from "@/components/landing/Tools";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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
    </main>
  );
};

export default Index;
