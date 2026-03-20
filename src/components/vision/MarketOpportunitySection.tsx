import ScrollReveal from "@/components/homepage/ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

const categories = [
  { name: "Energy", spend: [1800, 2200], savings: [100, 250], share: [50, 125], note: "Switching + negotiation" },
  { name: "Broadband", spend: [350, 500], savings: [80, 200], share: [40, 100], note: "20–40% overpay rate" },
  { name: "Car insurance", spend: [400, 700], savings: [50, 175], share: [25, 88], note: "Annual renewal savings" },
  { name: "Home insurance", spend: [300, 500], savings: [60, 150], share: [30, 75], note: "Often never compared" },
  { name: "Subscriptions", spend: [300, 600], savings: [100, 300], share: [50, 150], note: "100% on unused ones" },
  { name: "Mobile", spend: [200, 400], savings: [40, 120], share: [20, 60], note: "Loyalty penalty" },
];

const maxSpend = 2200;
const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;
const fmtRange = (r: number[]) => `${fmt(r[0])}–${fmt(r[1])}`;

const MarketOpportunitySection = () => {
  const barsRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-section-bg">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-3 tracking-tight">
            The Size of the Prize
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto text-balance">
            UK household recurring spend — excluding mortgage and rent
          </p>
        </ScrollReveal>

        {/* Horizontal bar chart */}
        <ScrollReveal delay={80}>
          <div ref={barsRef} className="space-y-5 mb-10">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 mb-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-muted-foreground/20" /> Annual spend</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--accent-warm))" }} /> Savings potential</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" /> Company share (50%)</span>
            </div>

            {categories.map((cat, i) => {
              const spendPct = (cat.spend[1] / maxSpend) * 100;
              const savingsPct = (cat.savings[1] / maxSpend) * 100;
              const sharePct = (cat.share[1] / maxSpend) * 100;

              return (
                <div key={i} className="group">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                    <span className="text-[11px] text-muted-foreground italic hidden sm:inline">{cat.note}</span>
                  </div>
                  <div className="relative h-8 rounded-lg bg-muted overflow-hidden">
                    {/* Spend bar */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg bg-muted-foreground/15 transition-all duration-1000 ease-out"
                      style={{ width: animated ? `${spendPct}%` : "0%" }}
                    />
                    {/* Savings bar */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out"
                      style={{
                        width: animated ? `${savingsPct}%` : "0%",
                        background: "hsl(var(--accent-warm) / 0.5)",
                        transitionDelay: "200ms",
                      }}
                    />
                    {/* Company share bar */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg bg-primary/70 transition-all duration-1000 ease-out"
                      style={{
                        width: animated ? `${sharePct}%` : "0%",
                        transitionDelay: "400ms",
                      }}
                    />
                    {/* Labels inside */}
                    <div className="absolute inset-0 flex items-center px-3 text-[11px] font-medium text-foreground/70 tabular-nums pointer-events-none">
                      {animated && (
                        <span className="opacity-80">{fmtRange(cat.spend)} spend → {fmtRange(cat.savings)} savings → {fmtRange(cat.share)} share</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Summary stats */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total addressable spend</p>
              <p className="text-xl font-extrabold text-foreground tabular-nums">£3,550–5,300</p>
              <p className="text-xs text-muted-foreground">per household / year</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Achievable savings</p>
              <p className="text-xl font-extrabold text-foreground tabular-nums" style={{ color: "hsl(var(--accent-warm))" }}>£430–1,195</p>
              <p className="text-xs text-muted-foreground">per household / year</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Company revenue (50%)</p>
              <p className="text-xl font-extrabold text-primary tabular-nums">£215–598</p>
              <p className="text-xs text-muted-foreground">per household / year</p>
            </div>
          </div>
        </ScrollReveal>

        {/* TAM box */}
        <ScrollReveal delay={280}>
          <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-lg shadow-primary/5 mb-10 text-center">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Total Addressable Market</p>
            <p className="text-lg sm:text-xl font-bold text-foreground mb-2">
              28M UK households × £350 avg company share = <span className="text-primary">£9.8B TAM</span>
            </p>
            <p className="text-sm text-muted-foreground">
              At 2.7% market penetration (750K households) = <span className="font-semibold text-foreground">£202.5M revenue</span>
            </p>
          </div>
        </ScrollReveal>

        {/* Adjacent markets */}
        <ScrollReveal delay={350}>
          <div className="flex items-start gap-3 justify-center text-center">
            <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground italic max-w-2xl">
              Adjacent markets: EU (200M households via PSD2), US (130M households via Section 1033), SME/business bills
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;
