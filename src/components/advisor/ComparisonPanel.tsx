import QuoteCard from "./QuoteCard";
import type { QuoteData } from "@/lib/mockData";

interface ComparisonPanelProps {
  quotes: QuoteData[];
  recommended?: number;
  onSelect?: (insurerName: string) => void;
}

const ComparisonPanel = ({ quotes, recommended, onSelect }: ComparisonPanelProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">
        Recommended offers for you
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {quotes.map((q, i) => (
          <QuoteCard
            key={q.insurerName}
            quote={q}
            isRecommended={i === recommended}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ComparisonPanel;
