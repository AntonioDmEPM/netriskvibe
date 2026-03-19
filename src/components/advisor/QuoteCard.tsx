import { formatPrice, type QuoteData } from "@/lib/mockData";
import { insurers } from "@/lib/mockData";
import { useI18n } from "@/lib/i18n";

interface QuoteCardProps {
  quote: QuoteData;
  isRecommended?: boolean;
  onSelect?: (insurerName: string) => void;
}

const badgeColors: Record<string, string> = {
  cheapest: 'bg-amber-100 text-amber-800 border-amber-300',
  recommended: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  current: 'bg-gray-100 text-gray-500 border-gray-200',
  popular: 'bg-blue-100 text-blue-700 border-blue-300',
};

function getInsurerData(name: string) {
  return insurers.find((i) => i.name === name);
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-muted-foreground w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/70 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-muted-foreground w-6 text-right">{value}/5</span>
    </div>
  );
}

const QuoteCard = ({ quote, isRecommended, onSelect }: QuoteCardProps) => {
  const { t, lang } = useI18n();
  const ins = getInsurerData(quote.insurerName);
  const claimsSpeed = ins?.claims_speed ?? 3;
  const satisfaction = ins?.satisfaction ?? 3.5;

  return (
    <div
      className={`bg-card rounded-lg border shadow-md p-4 transition-all overflow-hidden ${
        isRecommended
          ? 'border-primary ring-2 ring-primary/20 animate-recommended-pulse'
          : 'border-border'
      }`}
      style={{ borderLeftWidth: '4px', borderLeftColor: quote.insurerColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-foreground">{quote.insurerName}</h4>
        </div>
        {quote.badge && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeColors[quote.badge.variant] || badgeColors.current}`}>
            {quote.badge.text}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <span className="text-2xl font-bold text-foreground">
          {formatPrice(quote.yearlyPrice)} Ft/{lang === "en" ? "yr" : "év"}
        </span>
        <span className="text-sm text-muted-foreground ml-2">
          {formatPrice(quote.monthlyPrice)} Ft/{lang === "en" ? "mo" : "hó"}
        </span>
      </div>

      {/* Mini comparison bars */}
      <div className="space-y-1.5 mb-3">
        <MiniBar label={t("quote.claims")} value={claimsSpeed} max={5} />
        <MiniBar label={t("quote.satisfaction")} value={Math.round(satisfaction)} max={5} />
      </div>

      {/* Feature pills */}
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

      {/* Assessment */}
      {quote.assessment && (
        <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">
          {quote.assessment}
        </p>
      )}

      {/* CTA */}
      {onSelect && (
        <button
          onClick={() => onSelect(quote.insurerName)}
          className="w-full py-2 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200"
        >
          {t("quote.select")}
        </button>
      )}
    </div>
  );
};

export default QuoteCard;
