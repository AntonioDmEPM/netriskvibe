import { TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/mockData";

interface SavingsBannerProps {
  oldPrice: number;
  newPrice: number;
}

const SavingsBanner = ({ oldPrice, newPrice }: SavingsBannerProps) => {
  const savings = oldPrice - newPrice;
  if (savings <= 0) return null;

  return (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
      <TrendingDown className="w-5 h-5 text-primary shrink-0" />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(oldPrice)} HUF/yr
        </span>
        <span className="text-sm font-bold text-foreground">→</span>
        <span className="text-sm font-bold text-primary">
          {formatPrice(newPrice)} HUF/yr
        </span>
      </div>
      <span className="ml-auto text-sm font-bold text-primary whitespace-nowrap">
        Savings: {formatPrice(savings)} HUF/yr
      </span>
    </div>
  );
};

export default SavingsBanner;
