import ScrollReveal from "./ScrollReveal";

const stats = [
  { number: "2 000+", label: "napi szerződés" },
  { number: "1 000 000+", label: "visszatérő ügyfél" },
  { number: "22", label: "biztosító partner" },
  { number: "30 éve", label: "az Önök szolgálatában" },
];

const SocialProofBar = () => (
  <section className="bg-section-bg border-y border-border py-8 sm:py-10">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">{s.number}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default SocialProofBar;
