import ScrollReveal from "@/components/homepage/ScrollReveal";

const companies = ["Billshark", "Rocket Money", "Snoop", "Plum", "MSM", "AI Agent"];

type V = "yes" | "partial" | "no";

const matrix: V[][] = [
  ["no", "partial", "yes", "partial", "no", "yes"],
  ["yes", "yes", "no", "no", "no", "yes"],
  ["no", "no", "no", "partial", "no", "yes"],
  ["no", "no", "partial", "no", "partial", "yes"],
  ["no", "no", "yes", "yes", "yes", "yes"],
  ["no", "no", "no", "no", "no", "yes"],
  ["no", "no", "partial", "no", "no", "yes"],
];

const Cell = ({ value, isAgent }: { value: V; isAgent: boolean }) => {
  if (value === "yes")
    return (
      <span className={`text-base font-bold ${isAgent ? "text-primary" : "text-primary/80"}`}>
        ✓
      </span>
    );
  if (value === "partial")
    return <span className="text-base text-amber-500">⚠</span>;
  return <span className="text-base text-muted-foreground/40">✗</span>;
};

const capabilities = [
  "Monitors all bills continuously",
  "Negotiates with current provider",
  "Switches provider autonomously",
  "Covers all bill categories",
  "UK/EU market",
  "Truly autonomous (zero user action)",
  "Real-time / continuous optimization",
];

const MarketGapSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-3 tracking-tight">
            Nobody Does All of This — Yet
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-2xl mx-auto text-balance">
            Current players solve fragments of the problem. The autonomous agent solves all of it.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="relative overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground sticky left-0 bg-muted/50 z-20 min-w-[200px]">
                    Capability
                  </th>
                  {companies.map((c, i) => {
                    const isAgent = i === companies.length - 1;
                    return (
                      <th
                        key={c}
                        className={`py-3 px-3 text-center font-semibold whitespace-nowrap ${
                          isAgent
                            ? "bg-primary/10 text-primary sticky right-0 z-20 min-w-[100px]"
                            : "text-muted-foreground"
                        }`}
                      >
                        {c === "MSM" ? "MoneySuperMarket" : c}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {capabilities.map((cap, ri) => (
                  <tr key={ri} className="border-b border-border/60 last:border-0">
                    <td className="py-3 px-4 text-foreground font-medium sticky left-0 bg-background z-10">
                      {cap}
                    </td>
                    {matrix[ri].map((val, ci) => {
                      const isAgent = ci === companies.length - 1;
                      return (
                        <td
                          key={ci}
                          className={`py-3 px-3 text-center ${
                            isAgent ? "bg-primary/5 sticky right-0 z-10" : ""
                          }`}
                        >
                          <Cell value={val} isAgent={isAgent} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto italic">
            The core gap: no existing player acts as a fully autonomous, multi-category, continuous-optimization agent.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MarketGapSection;
