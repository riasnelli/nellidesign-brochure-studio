import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/Reveal";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  project: z.string().trim().min(1, "Tell me about your project").max(1000),
});

const WHATSAPP_NUMBER = "919497127222";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", project: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Thanks! I'll reply within 2 hours.");
      setForm({ name: "", email: "", project: "" });
      setLoading(false);
    }, 600);
  };

  const waText = encodeURIComponent(
    "Hi NelliDesign 👋,\n\nI came across your work and I'd love to get a quote for a brochure project.\n\n• Brochure type: \n• Approx. pages: \n• Timeline: \n\nLooking forward to hearing from you!"
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-warm opacity-70" aria-hidden />
      <div className="container relative">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-foreground text-background p-8 md:p-14 lg:p-20 shadow-card relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/30 blur-3xl" aria-hidden />
          <div className="grid lg:grid-cols-2 gap-12 relative">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Let's Talk</p>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-balance leading-[1.05]">
                Tell me about your brochure.
              </h2>
              <p className="mt-5 text-background/70 text-lg max-w-md">
                Send a quick brief and you'll get a fixed quote within 24 hours. Or message me directly on WhatsApp.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full bg-background/10 hover:bg-background/15 border border-background/20 transition-colors text-sm font-medium"
              >
                <MessageCircle size={16} className="text-accent" />
                Chat on WhatsApp
              </a>
            </Reveal>
            <Reveal delay={120}>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-background/80 text-xs uppercase tracking-wider">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                    className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-background/80 text-xs uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={255}
                    className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="project" className="text-background/80 text-xs uppercase tracking-wider">Project</Label>
                  <Textarea
                    id="project"
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    maxLength={1000}
                    rows={4}
                    className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 rounded-xl resize-none"
                    placeholder="Brochure type, page count, deadline…"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {loading ? "Sending…" : <>Send Enquiry <Send size={14} className="ml-1.5" /></>}
                </Button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
