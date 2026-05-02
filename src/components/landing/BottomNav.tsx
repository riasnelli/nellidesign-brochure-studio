import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export const BottomNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop: fixed pill at bottom of viewport */}
      <div className="fixed bottom-4 inset-x-0 z-50 hidden md:flex justify-center pointer-events-none">
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center gap-6 pl-6 pr-2 py-2 rounded-full bg-card/90 backdrop-blur-md border border-border/60 shadow-card"
        >
          <a href="#top" className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight">
            <span className="w-2 h-2 rounded-full bg-gradient-accent" aria-hidden />
            <span>NelliDESiGN</span>
          </a>
          <ul className="flex items-center gap-6 text-sm text-muted-foreground">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
          <Button asChild size="sm" className="rounded-full">
            <a href="#contact">Get a Quote</a>
          </Button>
        </nav>
      </div>

      {/* Mobile: floating action button + sheet */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-card flex items-center justify-center"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        {open && (
          <div className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl bg-card border border-border/60 shadow-card p-4">
            <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-2 font-display font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-gradient-accent" aria-hidden />
              NelliDESiGN
            </a>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-1 text-sm">{l.label}</a>
                </li>
              ))}
              <li className="pt-2">
                <Button asChild className="w-full rounded-full">
                  <a href="#contact" onClick={() => setOpen(false)}>Get a Quote</a>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
