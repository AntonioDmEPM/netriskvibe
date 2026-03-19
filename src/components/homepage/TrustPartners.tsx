import ScrollReveal from "./ScrollReveal";

const partners = [
  "Allianz", "Generali", "Genertel", "Groupama", "K&H", "KÖBE",
  "Union", "UNIQA", "Signal", "CIG", "Colonnade", "Magyar Posta",
];

const TrustPartners = () => (
  <section className="py-16 sm:py-24 bg-section-bg overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-10">
          22 biztosító, egy tanácsadó
        </h2>
      </ScrollReveal>

      {/* Marquee */}
      <ScrollReveal delay={100}>
        <div className="relative group mb-10">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-3 animate-marquee group-hover:[animation-play-state:paused]">
              {[...partners, ...partners].map((p, i) => (
                <span
                  key={`${p}-${i}`}
                  className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground whitespace-nowrap shrink-0"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="flex gap-3 animate-marquee group-hover:[animation-play-state:paused]" aria-hidden>
              {[...partners, ...partners].map((p, i) => (
                <span
                  key={`dup-${p}-${i}`}
                  className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground whitespace-nowrap shrink-0"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="text-center max-w-xl mx-auto">
          <blockquote className="text-lg text-foreground font-medium italic mb-3">
            „Tavaly 14 000 Ft-ot spóroltak átlagosan a biztosítót váltó ügyfeleink."
          </blockquote>
          <p className="text-sm text-muted-foreground">— Netrisk KGFB Index, 2024</p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default TrustPartners;
