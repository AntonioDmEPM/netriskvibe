import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number, trigger: boolean, prefix = "", suffix = "") {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return value;
}

const stats = [
  { target: 1200, prefix: "€", suffix: "+", label: "average annual household overpayment" },
  { target: 12, prefix: "8-", suffix: "", label: "contracts per household to optimize" },
  { target: 67, prefix: "", suffix: "%", label: "of consumers would trust an AI financial agent" },
];

const VisionHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)" }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
        backgroundSize: "64px 64px"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
          style={{ textWrap: "balance" as any }}
        >
          The Personal Finance Agent
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto" style={{ textWrap: "pretty" as any }}>
          From compare-and-click to set-and-forget
        </p>
        <p className="text-base sm:text-lg font-semibold mb-16" style={{ color: "#00A651" }}>
          We don't show you the best deal. We get you the best deal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto">
          {stats.map((s, i) => {
            const count = useCountUp(s.target, 1600, triggered);
            return (
              <div
                key={i}
                className="text-center opacity-0 translate-y-4"
                style={{
                  animation: triggered ? `fade-in-up 0.5s ease-out ${0.3 + i * 0.15}s forwards` : "none",
                }}
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums mb-2">
                  {s.prefix}{i === 1 ? `8-${count}` : count}{s.suffix}
                </p>
                <p className="text-sm text-gray-400 leading-snug">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default VisionHero;
