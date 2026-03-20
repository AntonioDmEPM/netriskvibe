import ScrollReveal from "@/components/homepage/ScrollReveal";

const phases = [
  {
    phase: "Phase 1",
    weeks: "12 weeks",
    title: "Contract Intelligence",
    bullets: ["Open Banking integration", "AI contract categorization", "Renewal alerting", "Market benchmarking"],
    tag: "MVP",
    tagColor: "bg-amber-500 text-white",
  },
  {
    phase: "Phase 2",
    weeks: "+16 weeks",
    title: "Automated Switching",
    bullets: ["Energy switching (regulated API)", "Broadband One Touch Switch", "Subscription cancellation", "Savings optimization"],
    tag: "GROWTH",
    tagColor: "bg-blue-600 text-white",
  },
  {
    phase: "Phase 3",
    weeks: "+20 weeks",
    title: "AI Negotiation",
    bullets: ["LLM-powered provider negotiation", "Voice AI (phone-based)", "Letter of Authority management", "Multi-provider optimization"],
    tag: "MOAT",
    tagColor: "bg-primary text-primary-foreground",
  },
];

const RoadmapSection = () => (
  <section className="py-24 sm:py-32 bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-4 tracking-tight">
          Implementation Roadmap
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          48 weeks from concept to competitive moat
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {phases.map((p, i) => (
          <ScrollReveal key={i} delay={i * 120}>
            <div className="relative rounded-2xl border-2 border-border bg-card p-6 sm:p-8 h-full flex flex-col">
              <span className={`absolute -top-3 right-6 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full ${p.tagColor}`}>
                {p.tag}
              </span>

              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">{p.phase}</p>
              <p className="text-sm text-muted-foreground mb-3">{p.weeks}</p>
              <h3 className="text-lg font-bold text-foreground mb-4">{p.title}</h3>

              <ul className="space-y-2 flex-1">
                {p.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span>{b}
                  </li>
                ))}
              </ul>

              {/* Progress indicator */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60 transition-all duration-1000"
                    style={{ width: i === 0 ? "100%" : i === 1 ? "60%" : "20%" }}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default RoadmapSection;
