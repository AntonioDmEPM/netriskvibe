import { motion } from "framer-motion";
import { Star, TrendingDown, Shield, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface Recommendation {
  id: string;
  provider: string;
  monthlyPrice: string;
  yearlyPrice: string;
  savings?: string;
  badge?: string;
  badgeType?: "best" | "cheapest" | "popular";
  reason: string;
  highlights: string[];
  rating: number;
  coverage: string;
}

const badgeConfig = {
  best: { bg: "bg-secondary/10 text-secondary", icon: Star },
  cheapest: { bg: "bg-savings/10 text-savings", icon: TrendingDown },
  popular: { bg: "bg-agent/10 text-agent", icon: Zap },
};

const RecommendationCard = ({
  recommendation,
  index,
}: {
  recommendation: Recommendation;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const badge = recommendation.badgeType ? badgeConfig[recommendation.badgeType] : null;
  const BadgeIcon = badge?.icon || Star;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.15,
      }}
      className="card-elevated rounded-2xl bg-card border border-border overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-display font-bold text-foreground">
                {recommendation.provider}
              </h3>
              {badge && recommendation.badge && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg}`}>
                  <BadgeIcon className="w-3 h-3" />
                  {recommendation.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-body">
              {recommendation.coverage}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < recommendation.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3 mb-4">
          <div>
            <span className="text-3xl font-display font-bold text-foreground">
              {recommendation.monthlyPrice}
            </span>
            <span className="text-sm text-muted-foreground font-body ml-1">
              / hó
            </span>
          </div>
          {recommendation.savings && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-savings/10 text-savings text-sm font-medium mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              {recommendation.savings} megtakarítás
            </span>
          )}
        </div>

        {/* Agent reason */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/5 border border-secondary/10 mb-4">
          <Shield className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground font-body leading-relaxed">
            {recommendation.reason}
          </p>
        </div>

        {/* Expandable highlights */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          {expanded ? "Kevesebb részlet" : "Több részlet"}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <ul className="mt-3 space-y-2">
            {recommendation.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                <div className="w-1.5 h-1.5 rounded-full bg-agent mt-1.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-sm tracking-wide transition-all hover:shadow-lg"
        >
          Ajánlat kérése
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
