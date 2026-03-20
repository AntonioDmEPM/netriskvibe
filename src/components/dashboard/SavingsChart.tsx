import { useEffect, useState } from "react";

const categories = [
  { key: "insurance", label: "Insurance", value: 132 },
  { key: "energy", label: "Energy", value: 105 },
  { key: "telecom", label: "Telecom", value: 135 },
  { key: "banking", label: "Banking", value: 51 },
  { key: "subs", label: "Subscriptions", value: 46 },
];

const total = 469;
const customerTotal = Math.round(total / 2);
const feeTotal = total - customerTotal;
const maxVal = Math.max(...categories.map((c) => c.value));

const fmt = (n: number) => `€${n.toLocaleString("en-US")}`;

const SavingsChart = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground mb-1">
        Savings summary over the last 12 months
      </h2>

      <div className="flex items-center gap-4 mt-2 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#00A651" }} />
          <span className="text-xs text-muted-foreground">You keep (50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-400/60" />
          <span className="text-xs text-muted-foreground">Service fee (50%)</span>
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
                {cat.label}
              </span>
              <div className="flex-1 h-7 bg-muted rounded-full overflow-hidden flex">
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
            TOTAL
          </span>
          <span className="text-2xl font-extrabold text-primary tabular-nums">
            {fmt(total)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm pl-0 sm:pl-0">
          <span className="font-semibold" style={{ color: "#00A651" }}>
            You: {fmt(customerTotal)}
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="font-semibold text-blue-400">
            Fee: {fmt(feeTotal)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 max-w-2xl">
        For comparison: the average Hungarian household overpays €300–700/year on contracts.
      </p>
    </div>
  );
};

export default SavingsChart;
