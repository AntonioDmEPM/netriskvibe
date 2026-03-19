import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { target: 2000, prefix: "", suffix: "+", label: "napi szerződés" },
  { target: 1000000, prefix: "", suffix: "+", label: "visszatérő ügyfél" },
  { target: 22, prefix: "", suffix: "", label: "biztosító partner" },
  { target: 30, prefix: "", suffix: " éve", label: "az Önök szolgálatában" },
];

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
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger, target, duration]);

  return value;
}

const StatItem = ({ stat, triggered }: { stat: typeof stats[0]; triggered: boolean }) => {
  const count = useCountUp(stat.target, 1500, triggered);
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">
        {stat.prefix}{formatNumber(count)}{stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
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
              <StatItem key={s.label} stat={s} triggered={triggered} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SocialProofBar;
