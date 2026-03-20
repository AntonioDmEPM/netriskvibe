import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

const categories = [
  { key: "insurance", label_hu: "Biztosítások", label_en: "Insurance", value: 52700 },
  { key: "energy", label_hu: "Energia", label_en: "Energy", value: 42000 },
  { key: "telecom", label_hu: "Telekommunikáció", label_en: "Telecom", value: 54000 },
  { key: "banking", label_hu: "Banki szolgáltatások", label_en: "Banking", value: 20300 },
  { key: "subs", label_hu: "Előfizetések", label_en: "Subscriptions", value: 18400 },
];

const total = 187400;
const customerTotal = Math.round(total / 2);
const feeTotal = total - customerTotal;
const maxVal = Math.max(...categories.map((c) => c.value));

const fmt = (n: number) => n.toLocaleString("hu-HU");

const SavingsChart = () => {
  const { lang } = useI18n();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground mb-1">
        {lang === "hu"
          ? "Megtakarítások összesítése az elmúlt 12 hónapban"
          : "Savings summary over the last 12 months"}
      </h2>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#00A651" }} />
          <span className="text-xs text-muted-foreground">{lang === "hu" ? "Ön tartja meg (50%)" : "You keep (50%)"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-400/60" />
          <span className="text-xs text-muted-foreground">{lang === "hu" ? "Szolgáltatási díj (50%)" : "Service fee (50%)"}</span>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const customerVal = Math.round(cat.value / 2);
          const feeVal = cat.value - customerVal;
          const totalPct = (cat.value / maxVal) * 100;
          return (
            <div key={cat.key} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-40 shrink-0 text-right">
                {lang === "hu" ? cat.label_hu : cat.label_en}
              </span>
              <div className="flex-1 h-7 bg-muted rounded-full overflow-hidden flex">
                {/* Customer share — green */}
                <div
                  className="h-full transition-all duration-1000 ease-out flex items-center justify-end"
                  style={{
                    width: animated ? `${(totalPct * customerVal) / cat.value}%` : "0%",
                    background: "#00A651",
                    borderRadius: "9999px 0 0 9999px",
                  }}
                >
                  {animated && (
                    <span className="text-[10px] font-bold text-white whitespace-nowrap pr-1.5 pl-2">
                      {fmt(customerVal)}
                    </span>
                  )}
                </div>
                {/* Service fee — blue-gray */}
                <div
                  className="h-full bg-blue-400/50 transition-all duration-1000 ease-out flex items-center justify-end"
                  style={{
                    width: animated ? `${(totalPct * feeVal) / cat.value}%` : "0%",
                    borderRadius: "0 9999px 9999px 0",
                  }}
                >
                  {animated && (
                    <span className="text-[10px] font-bold text-white whitespace-nowrap pr-2">
                      {fmt(feeVal)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-foreground w-40 shrink-0 text-right">
            {lang === "hu" ? "ÖSSZESEN" : "TOTAL"}
          </span>
          <span className="text-2xl font-extrabold text-primary tabular-nums">
            {fmt(total)} Ft
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm pl-0 sm:pl-0">
          <span className="font-semibold" style={{ color: "#00A651" }}>
            {lang === "hu" ? "Ön:" : "You:"} {fmt(customerTotal)} Ft
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="font-semibold text-blue-400">
            {lang === "hu" ? "Díj:" : "Fee:"} {fmt(feeTotal)} Ft
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 max-w-2xl">
        {lang === "hu"
          ? "Összehasonlításként: az átlagos magyar háztartás évi 120 000–280 000 Ft-ot túlfizet a szerződésein."
          : "For comparison: the average Hungarian household overpays 120,000–280,000 HUF/year on contracts."}
      </p>
    </div>
  );
};

export default SavingsChart;
