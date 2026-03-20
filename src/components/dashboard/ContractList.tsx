import { useI18n } from "@/lib/i18n";
import { contracts, statusConfig, type Contract } from "./contractData";

interface ContractListProps {
  onSelect: (contract: Contract) => void;
  kgfbApproved: boolean;
  highlightedContractId: string | null;
}

const ContractList = ({ onSelect, kgfbApproved, highlightedContractId }: ContractListProps) => {
  const { lang } = useI18n();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {lang === "hu" ? "Szerződések" : "Contracts"}
      </h2>
      <div className="space-y-2">
        {contracts.map((c, i) => {
          // Override KGFB status if approved
          const isKgfbSwitching = kgfbApproved && c.id === "kobe-kgfb";
          const effectiveStatus = isKgfbSwitching ? "switching" as const : c.status;
          const status = isKgfbSwitching
            ? { label_hu: "✅ Váltás folyamatban", label_en: "✅ Switch in progress", className: "bg-primary/10 text-primary border-primary/20" }
            : statusConfig[c.status];

          const isHighlighted = highlightedContractId === c.id;

          return (
            <div
              key={c.id}
              id={`contract-${c.id}`}
              onClick={() => onSelect(c)}
              className={`flex items-center gap-3 rounded-xl border bg-card p-3 cursor-pointer opacity-0 transition-all duration-500 ${
                isHighlighted
                  ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 scale-[1.02]"
                  : "border-border hover:shadow-md"
              }`}
              style={{ animation: `fade-in-up 0.4s ease-out ${i * 60}ms forwards` }}
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
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {c.monthly.toLocaleString("hu-HU")} Ft
                  <span className="text-muted-foreground font-normal text-xs">
                    /{lang === "hu" ? "hó" : "mo"}
                  </span>
                </p>
                <span className={`inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors duration-500 ${status.className}`}>
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
