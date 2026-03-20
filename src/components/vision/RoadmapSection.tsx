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

const buildPhases = [
  {
    label: "Phase 1 — MVP",
    weeks: "12 weeks",
    team: "8–10 engineers, 2 designers, 1 PM, 1 architect",
    cost: "£400–600K",
    deliverables: "Open Banking integration, contract detection, benchmarking dashboard, savings calculator",
    color: "bg-amber-500",
  },
  {
    label: "Phase 2 — Auto-Switch",
    weeks: "16 weeks",
    team: "12–15 engineers, 2 QA, 1 data engineer, 1 compliance",
    cost: "£600–900K",
    deliverables: "Energy/broadband/mobile switching APIs, subscription cancellation, savings verification, payment collection",
    color: "bg-blue-600",
  },
  {
    label: "Phase 3 — AI Negotiation",
    weeks: "20 weeks",
    team: "15–18 engineers, 2 ML engineers, 2 QA, security review",
    cost: "£800K–1.2M",
    deliverables: "LLM negotiation engine, Voice AI, Letter of Authority system, multi-category optimization",
    color: "bg-primary",
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

      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
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

      {/* Build Investment */}
      <ScrollReveal>
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
          What It Takes to Build
        </h3>
        <p className="text-muted-foreground text-center mb-10 max-w-md mx-auto">
          Team, cost, and deliverables by phase
        </p>
      </ScrollReveal>

      <div className="space-y-4 mb-6">
        {buildPhases.map((bp, i) => (
          <ScrollReveal key={i} delay={i * 100}>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/40">
                <span className={`w-2.5 h-2.5 rounded-full ${bp.color} shrink-0`} />
                <span className="text-sm font-bold text-foreground">{bp.label}</span>
                <span className="text-xs text-muted-foreground ml-auto tabular-nums">{bp.weeks}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                {/* Team */}
                <div className="p-4">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1.5">Team</p>
                  <p className="text-sm text-foreground leading-relaxed">{bp.team}</p>
                </div>
                {/* Cost */}
                <div className="p-4">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1.5">Investment</p>
                  <p className="text-lg font-extrabold text-foreground tabular-nums">{bp.cost}</p>
                </div>
                {/* Deliverables */}
                <div className="p-4">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1.5">Deliverables</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bp.deliverables}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Summary bar */}
      <ScrollReveal delay={350}>
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-4 text-center mb-6">
          <p className="text-sm font-bold text-foreground">
            Total to full product: <span className="text-primary">~48 weeks</span> | <span className="text-primary">£1.8–2.7M</span> | Full-stack autonomous agent
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <div className="space-y-3 text-center">
          <p className="text-xs text-muted-foreground italic max-w-2xl mx-auto">
            Built on: AWS/Azure + TrueLayer (Open Banking) + EPAM DIAL (LLM orchestration) + ElevenLabs (Voice AI)
          </p>
          <p className="text-xs text-muted-foreground italic max-w-2xl mx-auto">
            For a switching company with existing provider integrations, Phase 1 can be accelerated to 8 weeks.
          </p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default RoadmapSection;
