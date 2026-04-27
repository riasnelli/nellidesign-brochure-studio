import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Projects } from "@/components/landing/Projects";
import { WhyMe } from "@/components/landing/WhyMe";
import { Services } from "@/components/landing/Services";
import { Process } from "@/components/landing/Process";
import { About } from "@/components/landing/About";
import { Tools } from "@/components/landing/Tools";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "NelliDESiGN — Premium Brochure Design | Company Profiles, Catalogues, Corporate";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta(
      "description",
      "Premium brochure design by NelliDESiGN. 15+ years crafting company profiles, product catalogues and corporate brochures that convert. Get a fixed quote in 24 hours."
    );
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
      <Navbar />
      <Hero />
      <Projects />
      <WhyMe />
      <Services />
      <Process />
      <About />
      <Tools />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
