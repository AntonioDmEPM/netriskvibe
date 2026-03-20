import ScrollReveal from "@/components/homepage/ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Category {
  nameHu: string;
  nameEn: string;
  spend: number[];
  savings: number[];
  share: number[];
  noteHu: string;
  noteEn: string;
}

const categories: Category[] = [
  { nameHu: "Energia (gáz + villany)", nameEn: "Energy (gas + electricity)", spend: [350000, 420000], savings: [25000, 60000], share: [12000, 30000], noteHu: "Váltás + tárgyalás", noteEn: "Switching + negotiation" },
  { nameHu: "Internet / Szélessáv", nameEn: "Internet / Broadband", spend: [48000, 72000], savings: [12000, 30000], share: [6000, 15000], noteHu: "20–40% túlfizetés", noteEn: "20–40% overpay rate" },
  { nameHu: "KGFB (kötelező biztosítás)", nameEn: "Car insurance (KGFB/MTPL)", spend: [50000, 70000], savings: [8000, 18000], share: [4000, 9000], noteHu: "Éves megújításkor", noteEn: "Annual renewal savings" },
  { nameHu: "Lakásbiztosítás", nameEn: "Home insurance", spend: [30000, 48000], savings: [6000, 15000], share: [3000, 7500], noteHu: "Ritkán hasonlítják össze", noteEn: "Often never compared" },
  { nameHu: "TV/Streaming előfizetések", nameEn: "TV/Streaming subscriptions", spend: [48000, 72000], savings: [15000, 36000], share: [7500, 18000], noteHu: "100% a nem használtakon", noteEn: "100% on unused ones" },
  { nameHu: "Mobil", nameEn: "Mobile", spend: [36000, 60000], savings: [6000, 18000], share: [3000, 9000], noteHu: "Hűségbüntetés", noteEn: "Loyalty penalty" },
  { nameHu: "Egyéb előfizetések", nameEn: "Other subscriptions", spend: [24000, 48000], savings: [12000, 30000], share: [6000, 15000], noteHu: "Nem használtak lemondása", noteEn: "Cancel unused" },
];

const maxSpend = 420000;
const fmt = (n: number) => `${n.toLocaleString("hu-HU")} Ft`;
const fmtRange = (r: number[]) => `${fmt(r[0])}–${fmt(r[1])}`;

const MarketOpportunitySection = () => {
  const { lang } = useI18n();
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
            {lang === "hu" ? "A nyeremény nagysága — Magyar piac" : "The Size of the Prize — Hungarian Market"}
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto text-balance">
            {lang === "hu"
              ? "Magyar háztartások visszatérő kiadásai — jelzáloghitel és lakbér nélkül"
              : "Hungarian household recurring spend — excluding mortgage and rent"}
          </p>
        </ScrollReveal>

        {/* Horizontal bar chart */}
        <ScrollReveal delay={80}>
          <div ref={barsRef} className="space-y-5 mb-10">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 mb-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-muted-foreground/20" /> {lang === "hu" ? "Éves kiadás" : "Annual spend"}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--accent-warm))" }} /> {lang === "hu" ? "Megtakarítási potenciál" : "Savings potential"}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" /> {lang === "hu" ? "Cég részesedése (50%)" : "Company share (50%)"}</span>
            </div>

            {categories.map((cat, i) => {
              const spendPct = (cat.spend[1] / maxSpend) * 100;
              const savingsPct = (cat.savings[1] / maxSpend) * 100;
              const sharePct = (cat.share[1] / maxSpend) * 100;
              const name = lang === "hu" ? cat.nameHu : cat.nameEn;
              const note = lang === "hu" ? cat.noteHu : cat.noteEn;

              return (
                <div key={i} className="group">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{name}</span>
                    <span className="text-[11px] text-muted-foreground italic hidden sm:inline">{note}</span>
                  </div>
                  <div className="relative h-8 rounded-lg bg-muted overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg bg-muted-foreground/15 transition-all duration-1000 ease-out"
                      style={{ width: animated ? `${spendPct}%` : "0%" }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out"
                      style={{
                        width: animated ? `${savingsPct}%` : "0%",
                        background: "hsl(var(--accent-warm) / 0.5)",
                        transitionDelay: "200ms",
                      }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg bg-primary/70 transition-all duration-1000 ease-out"
                      style={{
                        width: animated ? `${sharePct}%` : "0%",
                        transitionDelay: "400ms",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-3 text-[11px] font-medium text-foreground/70 tabular-nums pointer-events-none">
                      {animated && (
                        <span className="opacity-80">
                          {fmtRange(cat.spend)} {lang === "hu" ? "kiadás" : "spend"} → {fmtRange(cat.savings)} {lang === "hu" ? "megtakarítás" : "savings"} → {fmtRange(cat.share)} {lang === "hu" ? "részesedés" : "share"}
                        </span>
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
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{lang === "hu" ? "Összes elérhető kiadás" : "Total addressable spend"}</p>
              <p className="text-xl font-extrabold text-foreground tabular-nums">586 000–790 000 Ft</p>
              <p className="text-xs text-muted-foreground">{lang === "hu" ? "háztartásonként / év" : "per household / year"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{lang === "hu" ? "Elérhető megtakarítás" : "Achievable savings"}</p>
              <p className="text-xl font-extrabold text-foreground tabular-nums" style={{ color: "hsl(var(--accent-warm))" }}>84 000–207 000 Ft</p>
              <p className="text-xs text-muted-foreground">{lang === "hu" ? "háztartásonként / év" : "per household / year"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{lang === "hu" ? "Cég bevétele (50%)" : "Company revenue (50%)"}</p>
              <p className="text-xl font-extrabold text-primary tabular-nums">42 000–103 000 Ft</p>
              <p className="text-xs text-muted-foreground">{lang === "hu" ? "háztartásonként / év" : "per household / year"}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* TAM box */}
        <ScrollReveal delay={280}>
          <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-lg shadow-primary/5 mb-10 text-center">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
              {lang === "hu" ? "Teljes elérhető piac" : "Total Addressable Market"}
            </p>
            <p className="text-lg sm:text-xl font-bold text-foreground mb-2">
              {lang === "hu"
                ? <>4M magyar háztartás × 75 000 Ft átlagos cég részesedés = <span className="text-primary">300 Mrd Ft TAM (~€750M)</span></>
                : <>4M Hungarian households × 75,000 Ft avg company share = <span className="text-primary">300 Bn Ft TAM (~€750M)</span></>}
            </p>
            <p className="text-sm text-muted-foreground">
              {lang === "hu"
                ? <>5% penetráció (200 000 háztartás) = <span className="font-semibold text-foreground">15 Mrd Ft bevétel (~€37.5M)</span></>
                : <>At 5% penetration (200,000 households) = <span className="font-semibold text-foreground">15 Bn Ft revenue (~€37.5M)</span></>}
            </p>
          </div>
        </ScrollReveal>

        {/* Adjacent markets */}
        <ScrollReveal delay={350}>
          <div className="flex flex-col items-center gap-3 text-center">
            <Globe className="w-5 h-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground italic max-w-2xl">
              {lang === "hu"
                ? "A Netrisk Csoport 6 közép-kelet-európai piacon működik: Magyarország, Csehország (Klik.cz), Lengyelország (Rankomat), Ausztria (Durchblicker), Litvánia, Szlovákia — összesen 25M+ háztartás"
                : "Netrisk Group operates in 6 CEE markets: Hungary, Czech Republic (Klik.cz), Poland (Rankomat), Austria (Durchblicker), Lithuania, Slovakia — combined 25M+ households"}
            </p>
            <p className="text-sm text-muted-foreground italic max-w-2xl">
              {lang === "hu"
                ? "Az EU-szintű PSD2 lehetővé teszi ugyanezt a modellt mind a 27 tagállamban"
                : "EU-wide PSD2 enables the same model across all 27 member states"}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;
