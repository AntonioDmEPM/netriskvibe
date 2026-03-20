import { contracts, statusConfig, type Contract } from "./contractData";

interface ContractListProps {
  onSelect: (contract: Contract) => void;
  kgfbApproved: boolean;
  highlightedContractId: string | null;
}

const ContractList = ({ onSelect, kgfbApproved, highlightedContractId }: ContractListProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Contracts</h2>
      <div className="space-y-2">
        {contracts.map((c, i) => {
          const isKgfbSwitching = kgfbApproved && c.id === "kobe-kgfb";
          const status = isKgfbSwitching
            ? { label: "✅ Switch in progress", className: "bg-primary/10 text-primary border-primary/20" }
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
                <p className="text-xs text-muted-foreground truncate">{c.type}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground tabular-nums">
                  €{c.monthly}
                  <span className="text-muted-foreground font-normal text-xs">/mo</span>
                </p>
                <span className={`inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors duration-500 ${status.className}`}>
                  {status.label}
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
