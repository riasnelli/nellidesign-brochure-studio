import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <nav className="container flex items-center justify-between h-16" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-accent" aria-hidden />
          <span>NelliDESiGN</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <Button asChild size="sm" className="rounded-full">
            <a href="#contact">Get a Quote</a>
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background">
          <ul className="container py-4 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-1 text-sm">{l.label}</a>
              </li>
            ))}
            <li><Button asChild className="w-full rounded-full"><a href="#contact">Get a Quote</a></Button></li>
          </ul>
        </div>
      )}
    </header>
  );
};
