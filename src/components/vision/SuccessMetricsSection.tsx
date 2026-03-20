import ScrollReveal from "@/components/homepage/ScrollReveal";
import { Users, Wallet, TrendingUp, CheckCircle, Star, RefreshCw, Handshake, Zap, Target } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Metric {
  icon: LucideIcon;
  label: string;
  target: string;
}

const metrics: Metric[] = [
  { icon: Users, label: "Households onboarded", target: "20,000" },
  { icon: Wallet, label: "Avg savings per household", target: "€300+" },
  { icon: TrendingUp, label: "Revenue per household", target: "€150+" },
  { icon: CheckCircle, label: "Savings verification rate", target: ">85%" },
  { icon: Star, label: "Consumer NPS", target: ">50" },
  { icon: RefreshCw, label: "Y1→Y2 retention", target: ">70%" },
  { icon: Handshake, label: "Negotiation success rate", target: ">60%" },
  { icon: Zap, label: "Time to first saving", target: "<7 days" },
  { icon: Target, label: "CAC payback", target: "<3 months" },
];

const SuccessMetricsSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-section-bg">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-3 tracking-tight">
            How We Measure Success
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-md mx-auto text-balance">
            Year 1 targets
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="rounded-xl border border-border bg-card p-5 text-center transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98] cursor-default h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                  {m.label}
                </p>
                <p className="text-2xl font-extrabold text-foreground tabular-nums">{m.target}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={550}>
          <p className="text-sm text-muted-foreground text-center mt-10 italic max-w-lg mx-auto">
            These metrics prove the model works. Every one is measurable from Day 1.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SuccessMetricsSection;
