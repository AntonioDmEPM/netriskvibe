import { useI18n } from "@/lib/i18n";
import { contracts, statusConfig, type Contract } from "./contractData";

interface ContractListProps {
  onSelect: (contract: Contract) => void;
}

const ContractList = ({ onSelect }: ContractListProps) => {
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
              key={c.id}
              onClick={() => onSelect(c)}
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
