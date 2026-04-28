import { Reveal } from "@/components/Reveal";
import { Star } from "lucide-react";

const GoogleG = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

type Review = {
  name: string;
  meta: string;
  date: string;
  initial?: string;
  avatarColor?: string;
  quote: string;
};

const items: Review[] = [
  {
    name: "Mohamed Ajmal Abdul Salam",
    meta: "Local Guide · 15 reviews · 16 photos",
    date: "12 Oct 2023",
    initial: "M",
    avatarColor: "#1A73E8",
    quote:
      "Mr. Rias was a through professional in bringing to life my ideas through creative use of his many years of experience in this field. He was able to point out the many intricacies of design and modern standards that we ourselves would not usually be aware, and correct our preferences, where required. Would definitely recommend !",
  },
  {
    name: "Corinne Bertschi",
    meta: "3 reviews",
    date: "31 Oct 2023",
    initial: "C",
    avatarColor: "#7B4FFF",
    quote:
      "I can simply say that NelliDesign did the best job ever. I would particularly like to emphasize that he was able to graphically implement my ideas extremely well and I received an answer within hours. It became clear to me pretty quickly that with NelliDesign I was not \u201Cjust\u201D developing the logo and wine etiquette but also the homepage.",
  },
  {
    name: "Captain Neanderthal",
    meta: "2 reviews",
    date: "3 Aug 2022",
    initial: "C",
    avatarColor: "#0F9D58",
    quote:
      "I used NelliDesiGN's services recently for some flyers and brochures for one of our companies. It was a very smooth deal. I met him once in Kochi to develop a personal connection and thereafter all my communications were either through emails, phone calls or whats app chats. It was very easy to communicate with Rias who understood our needs. We are very happy with his work and will use him for a lot more design work in the near future. I recommend him highly and wish him all the very best. Captain Nair",
  },
];

export const Testimonials = () => (
  <section className="py-24 md:py-32 bg-secondary/30">
    <div className="container">
      <Reveal>
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Reviews</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-balance mb-6">
            What clients say on Google.
          </h2>
          <a
            href="https://share.google/dhdPfWZGNulmH4gAK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border/60 shadow-soft hover:shadow-card transition-all"
          >
            <GoogleG size={18} />
            <span className="text-sm font-semibold">Google</span>
            <span className="h-4 w-px bg-border" />
            <span className="text-sm font-bold">5.0</span>
            <span className="flex gap-0.5 text-[#FBBC04]">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} size={13} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">· verified reviews</span>
          </a>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 100}>
            <figure className="h-full p-7 rounded-2xl bg-card border border-border/60 shadow-soft flex flex-col">
              <header className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-base flex-shrink-0"
                    style={{ backgroundColor: t.avatarColor }}
                    aria-hidden
                  >
                    {t.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-[#1A73E8] truncate">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.meta}</div>
                  </div>
                </div>
                <GoogleG size={18} />
              </header>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5 text-[#FBBC04]">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{t.date}</span>
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground/85 flex-1">
                {t.quote}
              </blockquote>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
