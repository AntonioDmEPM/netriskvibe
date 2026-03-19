import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-primary" />
        Javasolt ajánlatok
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {quotes.map((q, i) => (
          <motion.div
            key={q.insurerName}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.1,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <QuoteCard
              quote={q}
              isRecommended={i === recommended}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonPanel;
