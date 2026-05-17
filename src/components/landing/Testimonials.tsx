import { Reveal } from "@/components/Reveal";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import avatarMohamed from "@/assets/review-mohamed.webp";
import avatarCorinne from "@/assets/review-corinne.webp";
import avatarCaptain from "@/assets/review-captain.webp";

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
  avatar: string;
  quote: string;
};

const items: Review[] = [
  {
    name: "Mohamed Ajmal Abdul Salam",
    meta: "Local Guide · 15 reviews · 16 photos",
    date: "12 Oct 2023",
    avatar: avatarMohamed,
    quote:
      "Mr. Rias was a through professional in bringing to life my ideas through creative use of his many years of experience in this field. He was able to point out the many intricacies of design and modern standards that we ourselves would not usually be aware, and correct our preferences, where required. Would definitely recommend !",
  },
  {
    name: "Corinne Bertschi",
    meta: "3 reviews",
    date: "31 Oct 2023",
    avatar: avatarCorinne,
    quote:
      "I can simply say that NelliDesign did the best job ever. I would particularly like to emphasize that he was able to graphically implement my ideas extremely well and I received an answer within hours. It became clear to me pretty quickly that with NelliDesign I was not \u201Cjust\u201D developing the logo and wine etiquette but also the homepage.",
  },
  {
    name: "Captain Neanderthal",
    meta: "2 reviews",
    date: "3 Aug 2022",
    avatar: avatarCaptain,
    quote:
      "I used NelliDesiGN's services recently for some flyers and brochures for one of our companies. It was a very smooth deal. I met him once in Kochi to develop a personal connection and thereafter all my communications were either through emails, phone calls or whats app chats. It was very easy to communicate with Rias who understood our needs. We are very happy with his work and will use him for a lot more design work in the near future. I recommend him highly and wish him all the very best. Captain Nair",
  },
];

const ReviewCard = ({ t }: { t: Review }) => (
  <figure className="h-full p-7 rounded-2xl bg-card border border-border/60 shadow-soft flex flex-col">
    <header className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={t.avatar}
          alt={`${t.name} profile photo`}
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
        />
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
    <blockquote className="text-sm leading-relaxed text-foreground/85 flex-1 overflow-y-auto pr-1 max-h-[180px] [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]">
      {t.quote}
    </blockquote>
  </figure>
);

const toIsoDate = (d: string) => {
  // Convert "12 Oct 2023" → "2023-10-12"
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toISOString().split("T")[0];
};

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "NelliDESiGN",
  description:
    "Premium brochure design studio specialising in company profiles, product catalogues and corporate brochures.",
  url: typeof window !== "undefined" ? window.location.origin : "https://nellidesign.com",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: items.length.toString(),
    bestRating: "5",
    worstRating: "1",
  },
  review: items.map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    datePublished: toIsoDate(t.date),
    reviewBody: t.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    publisher: { "@type": "Organization", name: "Google" },
  })),
};

export const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);



  return (
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

        {/* Desktop / Tablet grid — equal heights */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <ReviewCard t={t} />
            </Reveal>
          ))}
        </div>

        {/* Mobile swipeable carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
            <div className="flex gap-4">
              {items.map((t) => (
                <div key={t.name} className="flex-[0_0_88%] min-w-0">
                  <ReviewCard t={t} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Reviews navigation">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                aria-selected={selected === i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  selected === i ? "w-6 bg-foreground" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
