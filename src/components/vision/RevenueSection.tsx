import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/homepage/ScrollReveal";

const models = [
  {
    title: "Savings Share",
    price: "30-40% of first year savings",
    bullets: ["Aligned incentives", "Harder to scale"],
    recommended: false,
  },
  {
    title: "Subscription",
    price: "€8-12/month premium",
    bullets: ["Predictable revenue", "High-value relationship"],
    recommended: true,
  },
  {
    title: "Freemium + Affiliate Hybrid",
    price: "Free monitoring → Paid switching",
    bullets: ["Free: monitoring + alerts (earns affiliate commission)", "Premium: autonomous switching + negotiation", "Best of both worlds"],
    recommended: false,
  },
];

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return value;
}

const RevenueSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tam = useCountUp(42, 1400, triggered);
  const arr = useCountUp(120, 1400, triggered);

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-section-bg">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-4 tracking-tight">
            Revenue Sizing
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
            Three monetisation models — one clear winner
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {models.map((m, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className={`relative rounded-2xl border-2 p-6 sm:p-8 h-full flex flex-col ${
                m.recommended
                  ? "border-primary bg-card shadow-xl shadow-primary/5"
                  : "border-border bg-card"
              }`}>
                {m.recommended && (
                  <span className="absolute -top-3 left-6 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground mb-2">{m.title}</h3>
                <p className="text-sm font-semibold text-primary mb-4">{m.price}</p>
                <ul className="space-y-2 flex-1">
                  {m.bullets.map((b, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary shrink-0">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={350}>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4 text-center">
              TAM Calculation
            </p>
            <div className="space-y-2 text-center">
              <p className="text-sm text-foreground">
                28M UK households × €150 avg captured savings = <span className="font-extrabold text-primary tabular-nums">€{tam / 10}.{tam % 10}B TAM</span>
              </p>
              <p className="text-sm text-foreground">
                1M subscribers × €120/year = <span className="font-extrabold text-primary tabular-nums">€{arr}M ARR</span> potential
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default RevenueSection;
