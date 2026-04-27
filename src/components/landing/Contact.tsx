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
  brochureType: z.string().trim().max(100).optional(),
  pages: z.string().trim().max(20).optional(),
  budget: z.string().trim().max(50).optional(),
  timeline: z.string().trim().max(50).optional(),
  project: z.string().trim().min(1, "Tell me about your project").max(1000),
});

const WHATSAPP_NUMBER = "919497127222";

type FormState = {
  name: string;
  email: string;
  brochureType: string;
  pages: string;
  budget: string;
  timeline: string;
  project: string;
};

const buildWhatsAppMessage = (f: FormState) => {
  const line = (label: string, value: string) =>
    value.trim() ? `• ${label}: ${value.trim()}` : `• ${label}: _`;

  const intro = f.name.trim()
    ? `Hi NelliDesign 👋, this is ${f.name.trim()}.`
    : "Hi NelliDesign 👋,";

  const body = [
    intro,
    "",
    "I'd love to get a quote for a brochure project:",
    line("Brochure type", f.brochureType),
    line("Approx. pages", f.pages),
    line("Budget", f.budget),
    line("Timeline", f.timeline),
  ];

  if (f.project.trim()) {
    body.push("", "Project details:", f.project.trim());
  }

  if (f.email.trim()) {
    body.push("", `Email: ${f.email.trim()}`);
  }

  body.push("", "Looking forward to hearing from you!");
  return body.join("\n");
};

export const Contact = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    brochureType: "",
    pages: "",
    budget: "",
    timeline: "",
    project: "",
  });
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
      setForm({
        name: "",
        email: "",
        brochureType: "",
        pages: "",
        budget: "",
        timeline: "",
        project: "",
      });
      setLoading(false);
    }, 600);
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage(form)
  )}`;

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
                Fill in a few details and you'll get a fixed quote within 24 hours. Or send the same brief straight to my WhatsApp.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full bg-background/10 hover:bg-background/15 border border-background/20 transition-colors text-sm font-medium"
              >
                <MessageCircle size={16} className="text-accent" />
                Send brief on WhatsApp
              </a>
              <p className="mt-3 text-xs text-background/50">
                Tip: fill the form fields first — they auto-fill the WhatsApp message.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" className="text-background/80 text-xs uppercase tracking-wider">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
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
                      onChange={(e) => update("email", e.target.value)}
                      maxLength={255}
                      className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="brochureType" className="text-background/80 text-xs uppercase tracking-wider">Brochure type</Label>
                    <Input
                      id="brochureType"
                      value={form.brochureType}
                      onChange={(e) => update("brochureType", e.target.value)}
                      maxLength={100}
                      className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                      placeholder="Company profile, catalogue…"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pages" className="text-background/80 text-xs uppercase tracking-wider">Pages</Label>
                    <Input
                      id="pages"
                      value={form.pages}
                      onChange={(e) => update("pages", e.target.value)}
                      maxLength={20}
                      className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="budget" className="text-background/80 text-xs uppercase tracking-wider">Budget</Label>
                    <Input
                      id="budget"
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      maxLength={50}
                      className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                      placeholder="e.g. ₹25,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline" className="text-background/80 text-xs uppercase tracking-wider">Timeline</Label>
                    <Input
                      id="timeline"
                      value={form.timeline}
                      onChange={(e) => update("timeline", e.target.value)}
                      maxLength={50}
                      className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 h-12 rounded-xl"
                      placeholder="e.g. 2 weeks"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="project" className="text-background/80 text-xs uppercase tracking-wider">Project details</Label>
                  <Textarea
                    id="project"
                    value={form.project}
                    onChange={(e) => update("project", e.target.value)}
                    maxLength={1000}
                    rows={4}
                    className="mt-2 bg-background/5 border-background/15 text-background placeholder:text-background/40 rounded-xl resize-none"
                    placeholder="Goals, audience, anything else I should know…"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {loading ? "Sending…" : <>Send Enquiry <Send size={14} className="ml-1.5" /></>}
                  </Button>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full bg-background/5 hover:bg-background/10 border-background/20 text-background hover:text-background"
                  >
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={14} className="mr-1.5 text-accent" />
                      Send via WhatsApp
                    </a>
                  </Button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
