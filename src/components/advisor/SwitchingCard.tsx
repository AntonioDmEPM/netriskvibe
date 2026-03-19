import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice } from "@/lib/mockData";

interface SwitchingCardProps {
  from?: { name: string; price: number };
  to: { name: string; price: number };
  onConfirm?: () => void;
}

const SwitchingCard = ({ from, to, onConfirm }: SwitchingCardProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const savings = from ? from.price - to.price : 0;

  const handleClick = () => {
    if (confirmed) return;
    setConfirmed(true);
    setTimeout(() => onConfirm?.(), 600);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-4 mb-4">
        {from && (
          <>
            <div className="flex-1 text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Previous</p>
              <p className="font-bold text-foreground">{from.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(from.price)} HUF/yr</p>
            </div>
            <ArrowRight className="w-6 h-6 text-primary shrink-0" />
          </>
        )}
        <div className="flex-1 text-center p-3 bg-green-50 border border-primary/20 rounded-lg">
          <p className="text-xs text-primary mb-1">New</p>
          <p className="font-bold text-foreground">{to.name}</p>
          <p className="text-sm text-primary font-semibold">{formatPrice(to.price)} HUF/yr</p>
        </div>
      </div>

      {savings > 0 && (
        <p className="text-center text-sm font-semibold text-primary mb-3">
          Savings: {formatPrice(savings)} HUF/yr
        </p>
      )}

      <button
        onClick={handleClick}
        disabled={confirmed}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          confirmed
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        {confirmed ? (
          <>
            <Check className="w-5 h-5 animate-check-pop" />
            Netrisk handles it!
          </>
        ) : (
          'Start switching'
        )}
      </button>
    </div>
  );
};

export default SwitchingCard;
