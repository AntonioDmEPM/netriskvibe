import ScrollReveal from "@/components/homepage/ScrollReveal";
import { ArrowRight } from "lucide-react";

const todayMetrics = [
  { label: "Revenue per household", value: "€30–€75" },
  { label: "Model", value: "One-time CPA commission" },
  { label: "Customer engagement", value: "Once/year at renewal" },
  { label: "Return rate", value: "~20%" },
  { label: "Lifetime value", value: "€50–€125" },
  { label: "Defensibility", value: "Low" },
];

const tomorrowMetrics = [
  { label: "Revenue per household", value: "€188–€375/year", highlight: true },
  { label: "Model", value: "50% of verified savings — recurring" },
  { label: "Customer engagement", value: "Continuous (daily monitoring)" },
  { label: "Retention", value: "70–85% annual" },
  { label: "Lifetime value", value: "€550–€700" },
  { label: "Defensibility", value: "High (agent has full financial picture)" },
];

const bottomStats = [
  { big: "€263", sub: "Contribution margin per household (79%)" },
  { big: "<2 months", sub: "CAC payback" },
  { big: "13–30x", sub: "LTV:CAC ratio" },
];

const RevenueTransformationSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-section-bg">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-3 tracking-tight">
            From One-Time Clicks to Recurring Relationships
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-2xl mx-auto text-balance">
            How the agent model transforms unit economics
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-0 items-stretch mb-16">
          <ScrollReveal delay={80}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-8 opacity-60">
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-muted-foreground bg-muted px-3 py-1 rounded-full mb-5">
                Current model
              </span>
              <h3 className="text-lg font-bold text-foreground mb-1">
                Today: Price Comparison
              </h3>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground/70 tabular-nums mt-3 mb-5">
                €30–€75
              </p>
              <ul className="space-y-3">
                {todayMetrics.slice(1).map((m, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-muted-foreground/40 shrink-0 mt-0.5">•</span>
                    <span><span className="font-medium text-foreground/60">{m.label}:</span> {m.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex md:flex-col items-center justify-center py-4 md:py-0 md:px-6">
              <div className="flex items-center gap-2 md:flex-col md:gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-extrabold text-primary tabular-nums">5–8x</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="relative h-full rounded-2xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-xl shadow-primary/5">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-primary-foreground bg-primary px-3 py-1 rounded-full mb-5 relative z-10">
                Agent model
              </span>
              <h3 className="text-lg font-bold text-foreground mb-1 relative z-10">
                Tomorrow: Autonomous Agent
              </h3>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary tabular-nums mt-3 mb-5 relative z-10">
                €188–€375<span className="text-lg font-bold text-primary/70">/year</span>
              </p>
              <ul className="space-y-3 relative z-10">
                {tomorrowMetrics.slice(1).map((m, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary/60 shrink-0 mt-0.5">•</span>
                    <span><span className="font-medium text-foreground">{m.label}:</span> {m.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={250}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {bottomStats.map((s, i) => (
              <div key={i} className="text-center p-5 rounded-xl bg-card border border-border">
                <p className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums mb-1">{s.big}</p>
                <p className="text-sm text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto italic leading-relaxed">
            The model works because consumers pay nothing. 50% of savings they never would have found is pure upside. The agent creates value from inaction.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default RevenueTransformationSection;
