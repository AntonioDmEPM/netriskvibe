import ScrollReveal from "@/components/homepage/ScrollReveal";

const events = [
  { year: "2018", label: "PSD2 / Open Banking", region: "UK/EU", highlight: false },
  { year: "2023", label: "FCA Consumer Duty", region: "UK", highlight: false },
  { year: "2024", label: "Section 1033", region: "USA", highlight: false },
  { year: "2025–26", label: "PSD3 + FiDA", region: "EU", highlight: true },
  { year: "2027+", label: "Open Finance", region: "Insurance, Pensions, Investments", highlight: false },
];

const RegulatorySection = () => (
  <section className="py-24 sm:py-32 bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-4 tracking-tight">
          Why Now: Regulatory Enablers
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          A once-in-a-generation regulatory convergence across three continents
        </p>
      </ScrollReveal>

      {/* Timeline */}
      <ScrollReveal delay={150}>
        <div className="relative">
          {/* Horizontal line */}
          <div className="hidden sm:block absolute top-8 left-0 right-0 h-px bg-border" />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-2">
            {events.map((ev, i) => (
              <div key={i} className="relative text-center flex flex-col items-center">
                {/* Dot */}
                <div className={`w-4 h-4 rounded-full border-2 mb-3 ${
                  ev.highlight
                    ? "bg-primary border-primary shadow-lg shadow-primary/30"
                    : "bg-background border-muted-foreground/30"
                }`} />

                {ev.highlight && (
                  <span className="absolute -top-6 text-[10px] font-bold tracking-widest text-primary">
                    NOW
                  </span>
                )}

                <p className={`text-lg font-bold mb-1 ${ev.highlight ? "text-primary" : "text-foreground"}`}>
                  {ev.year}
                </p>
                <p className={`text-sm font-medium mb-1 ${ev.highlight ? "text-foreground" : "text-foreground/80"}`}>
                  {ev.label}
                </p>
                <p className="text-xs text-muted-foreground">{ev.region}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <div className="mt-16 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
          <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed" style={{ textWrap: "balance" as any }}>
            For the first time, an agent can <span className="font-bold text-primary">see</span> a consumer's
            full financial picture across <span className="font-bold text-primary">all</span> providers.
          </p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default RegulatorySection;
