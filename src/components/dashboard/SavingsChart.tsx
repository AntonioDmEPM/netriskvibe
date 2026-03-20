import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

const categories = [
  { key: "insurance", label_hu: "Biztosítások", label_en: "Insurance", value: 52700, color: "bg-primary" },
  { key: "energy", label_hu: "Energia", label_en: "Energy", value: 42000, color: "bg-blue-500" },
  { key: "telecom", label_hu: "Telekommunikáció", label_en: "Telecom", value: 54000, color: "bg-teal-500" },
  { key: "banking", label_hu: "Banki szolgáltatások", label_en: "Banking", value: 20300, color: "bg-purple-500" },
  { key: "subs", label_hu: "Előfizetések", label_en: "Subscriptions", value: 18400, color: "bg-orange-500" },
];

const total = 187400;
const maxVal = Math.max(...categories.map((c) => c.value));

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

      <div className="space-y-3 mt-4">
        {categories.map((cat) => (
          <div key={cat.key} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-40 shrink-0 text-right">
              {lang === "hu" ? cat.label_hu : cat.label_en}
            </span>
            <div className="flex-1 h-7 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                style={{ width: animated ? `${(cat.value / maxVal) * 100}%` : "0%" }}
              >
                <span className="text-[11px] font-bold text-white whitespace-nowrap">
                  {cat.value.toLocaleString("hu-HU")} Ft
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
        <span className="text-sm font-bold text-foreground w-40 shrink-0 text-right">
          {lang === "hu" ? "ÖSSZESEN" : "TOTAL"}
        </span>
        <span className="text-2xl font-extrabold text-primary">
          {total.toLocaleString("hu-HU")} Ft
        </span>
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
