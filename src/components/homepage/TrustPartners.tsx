import ScrollReveal from "./ScrollReveal";

const partners = [
  "Allianz", "Generali", "Genertel", "Groupama", "K&H", "KÖBE",
  "Union", "UNIQA", "Signal", "CIG", "Colonnade", "Magyar Posta",
];

const TrustPartners = () => (
  <section className="py-16 sm:py-24 bg-section-bg">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-10">
          22 biztosító, egy tanácsadó
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {partners.map((p) => (
            <span
              key={p}
              className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground"
            >
              {p}
            </span>
          ))}
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
