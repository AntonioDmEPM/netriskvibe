import ScrollReveal from "@/components/homepage/ScrollReveal";
import { useEffect, useRef, useState } from "react";

const years = [
  { year: "Year 1", households: "50,000", revenue: "£17.5M", ebitda: "£6.6M", margin: "37%", progress: 33, highlight: false },
  { year: "Year 2", households: "250,000", revenue: "£75M", ebitda: "£39.7M", margin: "53%", progress: 66, highlight: false },
  { year: "Year 3", households: "750,000", revenue: "£202.5M", ebitda: "£112.2M", margin: "55%", progress: 100, highlight: true },
];

const comparables = [
  { name: "Rocket Money", val: "$1.275B", multiple: "12x revenue", desc: "Bill negotiation" },
  { name: "MoneySuperMarket", val: "£1.5B", multiple: "3.5x revenue", desc: "Price comparison" },
  { name: "Plum", val: "~£200M", multiple: "10–13x revenue", desc: "Smart savings" },
  { name: "Cleo", val: "~$750M", multiple: "7.5x revenue", desc: "AI budgeting" },
];

// Revenue data points for the SVG chart
const revenuePoints = [
  { x: 0, y: 0, label: "Now" },
  { x: 1, y: 17.5, label: "Y1" },
  { x: 2, y: 75, label: "Y2" },
  { x: 3, y: 202.5, label: "Y3" },
];

const AnimatedChart = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setDrawn(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const W = 600, H = 200, PX = 60, PY = 30;
  const maxY = 220;
  const toSvg = (x: number, y: number) => ({
    sx: PX + (x / 3) * (W - PX * 2),
    sy: H - PY - (y / maxY) * (H - PY * 2),
  });

  const pts = revenuePoints.map((p) => toSvg(p.x, p.y));
  // Smooth curve through points
  const d = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.sx} ${pt.sy}`;
    const prev = pts[i - 1];
    const cx = (prev.sx + pt.sx) / 2;
    return `${acc} C ${cx} ${prev.sy}, ${cx} ${pt.sy}, ${pt.sx} ${pt.sy}`;
  }, "");

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {[0, 50, 100, 150, 200].map((v) => {
        const { sy } = toSvg(0, v);
        return (
          <g key={v}>
            <line x1={PX} y1={sy} x2={W - PX} y2={sy} className="stroke-border" strokeWidth={1} strokeDasharray="4 4" />
            <text x={PX - 8} y={sy + 4} textAnchor="end" className="fill-muted-foreground" fontSize={10}>£{v}M</text>
          </g>
        );
      })}
      {/* Axis labels */}
      {revenuePoints.map((p, i) => {
        const { sx } = toSvg(p.x, 0);
        return <text key={i} x={sx} y={H - 6} textAnchor="middle" className="fill-muted-foreground" fontSize={11} fontWeight={500}>{p.label}</text>;
      })}
      {/* Line */}
      <path
        d={d}
        fill="none"
        className="stroke-primary"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={800}
        strokeDashoffset={drawn ? 0 : 800}
        style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }}
      />
      {/* Dots */}
      {pts.map((pt, i) => (
        <circle
          key={i}
          cx={pt.sx}
          cy={pt.sy}
          r={i === 0 ? 3 : 5}
          className="fill-primary"
          style={{
            opacity: drawn ? 1 : 0,
            transform: drawn ? "scale(1)" : "scale(0)",
            transformOrigin: `${pt.sx}px ${pt.sy}px`,
            transition: `opacity 0.3s ease-out ${0.4 + i * 0.3}s, transform 0.3s ease-out ${0.4 + i * 0.3}s`,
          }}
        />
      ))}
      {/* Value labels on dots */}
      {revenuePoints.slice(1).map((p, i) => {
        const pt = pts[i + 1];
        return (
          <text
            key={i}
            x={pt.sx}
            y={pt.sy - 12}
            textAnchor="middle"
            className="fill-foreground"
            fontSize={12}
            fontWeight={700}
            style={{ opacity: drawn ? 1 : 0, transition: `opacity 0.3s ease-out ${0.6 + i * 0.3}s` }}
          >
            £{p.y}M
          </text>
        );
      })}
    </svg>
  );
};

const ProjectionSection = () => (
  <section className="py-24 sm:py-32 bg-background">
    <div className="max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-3 tracking-tight">
          Path to Scale
        </h2>
        <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto text-balance">
          Base case: 50% savings share, UK market
        </p>
      </ScrollReveal>

      {/* Year cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
        {years.map((y, i) => (
          <ScrollReveal key={i} delay={i * 100}>
            <div
              className={`relative rounded-2xl p-6 sm:p-7 h-full flex flex-col ${
                y.highlight
                  ? "border-2 border-primary/50 shadow-xl shadow-primary/8 bg-card"
                  : "border border-border bg-card"
              }`}
            >
              {y.highlight && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
              )}
              <p className={`text-xs font-bold tracking-widest uppercase mb-4 ${y.highlight ? "text-primary" : "text-muted-foreground"}`}>
                {y.year}
              </p>

              <div className="space-y-3 flex-1 relative z-10">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Households</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">{y.households}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Revenue</p>
                  <p className={`text-2xl font-extrabold tabular-nums ${y.highlight ? "text-primary" : "text-foreground"}`}>{y.revenue}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">EBITDA</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">{y.ebitda}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Margin</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">{y.margin}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5 h-2 rounded-full bg-muted overflow-hidden relative z-10">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${y.progress}%` }}
                />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Revenue trajectory chart */}
      <ScrollReveal delay={300}>
        <div className="mb-10">
          <AnimatedChart />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={350}>
        <div className="space-y-2 text-center mb-20">
          <p className="text-sm text-muted-foreground italic">
            Conservative scenario: £64M revenue at Year 3 with 400K households
          </p>
          <p className="text-sm text-muted-foreground italic">
            Breakeven: 20,000–40,000 households (achievable in 6–12 months)
          </p>
        </div>
      </ScrollReveal>

      {/* Valuation Comparables */}
      <ScrollReveal delay={100}>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8">
          Valuation Comparables
        </h3>
      </ScrollReveal>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {comparables.map((c, i) => (
          <ScrollReveal key={i} delay={150 + i * 80}>
            <div className="rounded-xl border border-border bg-card p-5 text-center h-full">
              <p className="text-sm font-semibold text-foreground mb-1">{c.name}</p>
              <p className="text-2xl font-extrabold text-foreground tabular-nums">{c.val}</p>
              <p className="text-xs font-medium text-primary mt-1">{c.multiple}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{c.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={400}>
        <p className="text-sm text-muted-foreground text-center italic max-w-lg mx-auto">
          At Year 3 base case: 5–8x revenue = £1–1.6B valuation
        </p>
      </ScrollReveal>
    </div>
  </section>
);

export default ProjectionSection;
