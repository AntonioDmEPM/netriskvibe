import { useI18n } from "@/lib/i18n";

type Status = "optimized" | "better" | "monitoring" | "approval";

interface Contract {
  provider: string;
  letter: string;
  letterColor: string;
  type_hu: string;
  type_en: string;
  monthly: number;
  status: Status;
}

const contracts: Contract[] = [
  { provider: "KÖBE", letter: "K", letterColor: "bg-secondary text-white", type_hu: "Kötelező biztosítás (KGFB)", type_en: "MTPL Insurance", monthly: 3167, status: "approval" },
  { provider: "Allianz", letter: "A", letterColor: "bg-blue-600 text-white", type_hu: "Lakásbiztosítás", type_en: "Home Insurance", monthly: 3850, status: "optimized" },
  { provider: "MVM", letter: "M", letterColor: "bg-red-600 text-white", type_hu: "Energia (villany+gáz)", type_en: "Energy (electricity+gas)", monthly: 18500, status: "better" },
  { provider: "Vodafone", letter: "V", letterColor: "bg-red-500 text-white", type_hu: "Internet", type_en: "Internet", monthly: 5990, status: "optimized" },
  { provider: "Telekom", letter: "T", letterColor: "bg-pink-600 text-white", type_hu: "Mobil", type_en: "Mobile", monthly: 6490, status: "monitoring" },
  { provider: "OTP", letter: "O", letterColor: "bg-green-700 text-white", type_hu: "Bankszámla", type_en: "Bank Account", monthly: 1200, status: "better" },
  { provider: "CIB", letter: "C", letterColor: "bg-indigo-700 text-white", type_hu: "Hitelkártya", type_en: "Credit Card", monthly: 492, status: "approval" },
  { provider: "Digi", letter: "D", letterColor: "bg-cyan-600 text-white", type_hu: "TV előfizetés", type_en: "TV Subscription", monthly: 3990, status: "optimized" },
];

const statusConfig: Record<Status, { label_hu: string; label_en: string; className: string }> = {
  optimized: { label_hu: "✅ Optimalizálva", label_en: "✅ Optimized", className: "bg-primary/10 text-primary border-primary/20" },
  better: { label_hu: "⚡ Jobb ajánlat elérhető", label_en: "⚡ Better deal available", className: "bg-orange-50 text-orange-700 border-orange-200" },
  monitoring: { label_hu: "🔍 Figyelés alatt", label_en: "🔍 Monitoring", className: "bg-blue-50 text-blue-700 border-blue-200" },
  approval: { label_hu: "⚠️ Jóváhagyás szükséges", label_en: "⚠️ Approval needed", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

const ContractList = () => {
  const { lang } = useI18n();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {lang === "hu" ? "Szerződések" : "Contracts"}
      </h2>
      <div className="space-y-2">
        {contracts.map((c, i) => {
          const status = statusConfig[c.status];
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${c.letterColor}`}>
                {c.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.provider}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {lang === "hu" ? c.type_hu : c.type_en}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">
                  {c.monthly.toLocaleString("hu-HU")} Ft
                  <span className="text-muted-foreground font-normal text-xs">
                    /{lang === "hu" ? "hó" : "mo"}
                  </span>
                </p>
                <span className={`inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
                  {lang === "hu" ? status.label_hu : status.label_en}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractList;
