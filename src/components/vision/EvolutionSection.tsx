import { Search, MessageSquareMore, Bot, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/homepage/ScrollReveal";
import { useI18n } from "@/lib/i18n";

const EvolutionSection = () => {
  const { lang } = useI18n();

  const eras = [
    {
      icon: Search,
      era: lang === "hu" ? "Összehasonlítás" : "Compare",
      period: "2000–2020",
      desc: lang === "hu" ? "Ár-összehasonlító oldalak" : "Price comparison sites",
      bullets: lang === "hu"
        ? ["A fogyasztó keres, összehasonlít, kattint, jelentkezik", "Éves interakció, a fogyasztó végzi a munkát"]
        : ["Consumer searches, compares, clicks, applies", "Annual interaction, consumer does all the work"],
      revenue: lang === "hu" ? "€30-80 kattintásonként" : "€30-80 per click",
      examples: lang === "hu" ? "MoneySuperMarket, Netrisk, Check24" : "MoneySuperMarket, Netrisk, Check24",
      style: "opacity-60",
      border: "border-border",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
    {
      icon: MessageSquareMore,
      era: lang === "hu" ? "Tanácsadás" : "Advise",
      period: "2024–2026",
      desc: lang === "hu" ? "AI-alapú tanácsadás" : "AI-powered advisory",
      bullets: lang === "hu"
        ? ["Beszélgetős ágens megtalálja a legjobb ajánlatot", "A fogyasztó még mindig dönt és jóváhagy"]
        : ["Conversational agent finds the best deal", "Consumer still decides and approves"],
      revenue: lang === "hu" ? "€50-150 tranzakciónként" : "€50-150 per transaction",
      examples: lang === "hu" ? "Amit az imént bemutattunk (1. fül)" : "What we just demoed (Tab 1)",
      style: "",
      border: "border-primary/40 shadow-lg shadow-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      badge: lang === "hu" ? "JELEN" : "PRESENT",
    },
    {
      icon: Bot,
      era: lang === "hu" ? "Cselekvés" : "Act",
      period: "2026+",
      desc: lang === "hu" ? "Autonóm pénzügyi ágens" : "Autonomous financial agent",
      bullets: lang === "hu"
        ? ["Az ágens figyel, tárgyal, automatikusan vált", "A fogyasztó egyszer jóváhagy, az ágens folyamatosan optimalizál"]
        : ["Agent monitors, negotiates, switches automatically", "Consumer approves once, agent optimizes continuously"],
      revenue: lang === "hu" ? "€100-180 háztartásonként/év" : "€100-180 per household per year",
      examples: lang === "hu" ? "Amit építünk (2. fül)" : "What we're building (Tab 2)",
      style: "",
      border: "border-primary shadow-xl shadow-primary/10",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      badge: lang === "hu" ? "JÖVŐ" : "FUTURE",
      glow: true,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-4 tracking-tight">
            {lang === "hu" ? "A fogyasztói pénzügyek fejlődése" : "The Evolution of Consumer Finance"}
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            {lang === "hu"
              ? "Három paradigmaváltás abban, hogyan kezelik a fogyasztók a pénzüket"
              : "Three paradigm shifts in how consumers manage their money"}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {eras.map((era, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <div className="relative h-full">
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}

                <div
                  className={`relative rounded-2xl border-2 ${era.border} bg-card p-6 sm:p-8 h-full flex flex-col ${era.style}`}
                >
                  {era.glow && (
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                  )}

                  {era.badge && (
                    <span className={`absolute -top-3 left-6 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full ${
                      era.badge === "FUTURE" || era.badge === "JÖVŐ" ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground"
                    }`}>
                      {era.badge}
                    </span>
                  )}

                  <div className={`w-12 h-12 rounded-xl ${era.iconBg} flex items-center justify-center mb-5`}>
                    <era.icon className={`w-6 h-6 ${era.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1">"{era.era}"</h3>
                  <p className="text-sm text-muted-foreground mb-4">{era.period}</p>
                  <p className="text-sm font-medium text-foreground/80 mb-3">{era.desc}</p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {era.bullets.map((b, j) => (
                      <li key={j} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-border pt-4 mt-auto">
                    <p className="text-sm font-semibold text-foreground tabular-nums">{era.revenue}</p>
                    <p className="text-xs text-muted-foreground mt-1 italic">{era.examples}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EvolutionSection;
