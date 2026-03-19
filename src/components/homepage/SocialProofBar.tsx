import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " 000 000";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger, target, duration]);

  return value;
}

interface StatDef {
  target: number;
  prefix: string;
  suffix: string;
  labelKey: string;
}

const stats: StatDef[] = [
  { target: 2000, prefix: "", suffix: "+", labelKey: "stats.contracts" },
  { target: 1000000, prefix: "", suffix: "+", labelKey: "stats.customers" },
  { target: 22, prefix: "", suffix: "", labelKey: "stats.partners" },
  { target: 30, prefix: "", suffix: "", labelKey: "stats.years.label" },
];

const StatItem = ({ stat, triggered }: { stat: StatDef; triggered: boolean }) => {
  const { t } = useI18n();
  const count = useCountUp(stat.target, 1500, triggered);
  const suffix = stat.labelKey === "stats.years.label" ? t("stats.years.suffix") : stat.suffix;
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">
        {stat.prefix}{formatNumber(count)}{suffix}
      </p>
      <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
    </div>
  );
};

const SocialProofBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-section-bg border-y border-border py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s) => (
              <StatItem key={s.labelKey} stat={s} triggered={triggered} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SocialProofBar;
