import { TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/mockData";
import { useI18n } from "@/lib/i18n";

interface SavingsBannerProps {
  oldPrice: number;
  newPrice: number;
}

const SavingsBanner = ({ oldPrice, newPrice }: SavingsBannerProps) => {
  const { t } = useI18n();
  const savings = oldPrice - newPrice;
  if (savings <= 0) return null;

  const isEn = t("savings.label") === "Savings";
  const yrLabel = isEn ? "Ft/yr" : "Ft/év";

  return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
      <TrendingDown className="w-5 h-5 text-primary shrink-0" />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(oldPrice)} {yrLabel}
        </span>
        <span className="text-sm font-bold text-foreground">→</span>
        <span className="text-sm font-bold text-primary">
          {formatPrice(newPrice)} {yrLabel}
        </span>
      </div>
      <span className="ml-auto text-sm font-bold text-primary whitespace-nowrap">
        {t("savings.label")}: {formatPrice(savings)} {yrLabel}
      </span>
    </div>
  );
};

export default SavingsBanner;
