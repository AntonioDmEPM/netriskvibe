import { formatPrice, type QuoteData } from "@/lib/mockData";

interface QuoteCardProps {
  quote: QuoteData;
  isRecommended?: boolean;
  onSelect?: (insurerName: string) => void;
}

const badgeColors: Record<string, string> = {
  cheapest: 'bg-red-50 text-red-700 border-red-200',
  recommended: 'bg-green-50 text-green-700 border-green-200',
  current: 'bg-gray-50 text-gray-600 border-gray-200',
  popular: 'bg-blue-50 text-blue-700 border-blue-200',
};

const QuoteCard = ({ quote, isRecommended, onSelect }: QuoteCardProps) => {
  return (
    <div
      className={`bg-card rounded-lg border shadow-md p-4 transition-all ${
        isRecommended ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: quote.insurerColor }}
          />
          <h4 className="font-bold text-foreground">{quote.insurerName}</h4>
        </div>
        {quote.badge && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badgeColors[quote.badge.variant] || badgeColors.current}`}>
            {quote.badge.text}
          </span>
        )}
      </div>

      <div className="mb-3">
        <span className="text-2xl font-bold text-foreground">
          {formatPrice(quote.yearlyPrice)} HUF/yr
        </span>
        <span className="text-sm text-muted-foreground ml-2">
          {formatPrice(quote.monthlyPrice)} HUF/mo
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {quote.features.map((f, i) => (
          <span
            key={i}
            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
          >
            {f}
          </span>
        ))}
      </div>

      {quote.assessment && (
        <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">
          {quote.assessment}
        </p>
      )}

      {onSelect && (
        <button
          onClick={() => onSelect(quote.insurerName)}
          className="w-full py-2 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          I choose this
        </button>
      )}
    </div>
  );
};

export default QuoteCard;
