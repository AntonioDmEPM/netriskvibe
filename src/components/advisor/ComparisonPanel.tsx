import { motion } from "framer-motion";
import { Sparkles, Check, X, Star } from "lucide-react";
import { formatPrice, insurers as allInsurers, type QuoteData } from "@/lib/mockData";
import { useI18n } from "@/lib/i18n";

interface ComparisonPanelProps {
  quotes: QuoteData[];
  recommended?: number;
  onSelect?: (insurerName: string) => void;
}

const badgeColors: Record<string, string> = {
  cheapest: "bg-amber-100 text-amber-800 border-amber-200",
  recommended: "bg-emerald-100 text-emerald-800 border-emerald-200",
  current: "bg-gray-100 text-gray-500 border-gray-200",
  popular: "bg-blue-100 text-blue-700 border-blue-200",
};

function getInsurerMeta(name: string) {
  return allInsurers.find((i) => i.short_name === name || i.name === name);
}

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
  ) : (
    <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
  );
}

/** Find the best (lowest) price among quotes */
function cheapestPrice(quotes: QuoteData[]): number {
  return Math.min(...quotes.map((q) => q.yearlyPrice));
}

const ComparisonPanel = ({ quotes, recommended, onSelect }: ComparisonPanelProps) => {
  const { t, lang } = useI18n();
  const lowestPrice = cheapestPrice(quotes);

  // Enrich quotes with insurer metadata
  const enriched = quotes.map((q) => ({
    ...q,
    meta: getInsurerMeta(q.insurerName),
  }));

  const colCount = enriched.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-primary" />
        {t("comparison.title")}
      </h4>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-sm border-separate border-spacing-0">
          {/* ── Header: insurer names + badges ── */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card" />
              {enriched.map((q, i) => (
                <th
                  key={q.insurerName}
                  className={`text-center px-3 pt-3 pb-2 min-w-[120px] ${
                    i === recommended
                      ? "bg-primary/5 rounded-t-xl"
                      : "bg-card"
                  }`}
                >
                  <div
                    className="w-8 h-1 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: q.insurerColor }}
                  />
                  <div className="font-bold text-foreground text-sm">{q.insurerName}</div>
                  {q.badge && (
                    <span
                      className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        badgeColors[q.badge.variant] || badgeColors.current
                      }`}
                    >
                      {q.badge.text}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-xs">
            {/* ── Price row ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-2 whitespace-nowrap">
                {lang === "en" ? "Price / year" : "Ár / év"}
              </td>
              {enriched.map((q, i) => (
                <td
                  key={q.insurerName}
                  className={`text-center py-2 px-3 ${
                    i === recommended ? "bg-primary/5" : ""
                  }`}
                >
                  <span
                    className={`font-bold text-base ${
                      q.yearlyPrice === lowestPrice
                        ? "text-emerald-600"
                        : "text-foreground"
                    }`}
                  >
                    {formatPrice(q.yearlyPrice)} Ft
                  </span>
                </td>
              ))}
            </tr>

            {/* ── Monthly price row ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-1.5 whitespace-nowrap">
                {lang === "en" ? "Price / month" : "Ár / hó"}
              </td>
              {enriched.map((q, i) => (
                <td
                  key={q.insurerName}
                  className={`text-center py-1.5 px-3 text-muted-foreground ${
                    i === recommended ? "bg-primary/5" : ""
                  }`}
                >
                  {formatPrice(q.monthlyPrice)} Ft
                </td>
              ))}
            </tr>

            {/* ── Separator ── */}
            <tr>
              <td colSpan={colCount + 1} className="py-1">
                <div className="border-t border-border" />
              </td>
            </tr>

            {/* ── Claims speed ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-2 whitespace-nowrap">
                {lang === "en" ? "Claims speed" : "Kárrendezés"}
              </td>
              {enriched.map((q, i) => {
                const days = q.claimsSpeedDays ?? q.meta?.claims_speed_days ?? 0;
                const rating = q.meta?.claims_speed ?? 3;
                return (
                  <td
                    key={q.insurerName}
                    className={`text-center py-2 px-3 ${
                      i === recommended ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <Stars value={rating} />
                      <span className="text-muted-foreground">{days}d avg</span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* ── Customer satisfaction ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-2 whitespace-nowrap">
                {t("quote.satisfaction")}
              </td>
              {enriched.map((q, i) => (
                <td
                  key={q.insurerName}
                  className={`text-center py-2 px-3 ${
                    i === recommended ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <Stars value={q.satisfaction} />
                    <span className="text-muted-foreground">{q.satisfaction}/5</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* ── Digital rating ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-2 whitespace-nowrap">
                {lang === "en" ? "Digital" : "Digitális"}
              </td>
              {enriched.map((q, i) => {
                const rating = q.digitalRating ?? q.meta?.digital_rating ?? 3;
                return (
                  <td
                    key={q.insurerName}
                    className={`text-center py-2 px-3 ${
                      i === recommended ? "bg-primary/5" : ""
                    }`}
                  >
                    <Stars value={rating} />
                  </td>
                );
              })}
            </tr>

            {/* ── Roadside assistance ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-2 whitespace-nowrap">
                {lang === "en" ? "Roadside assist" : "Asszisztencia"}
              </td>
              {enriched.map((q, i) => {
                const has = q.roadsideAssistance ?? q.meta?.roadside ?? false;
                return (
                  <td
                    key={q.insurerName}
                    className={`text-center py-2 px-3 ${
                      i === recommended ? "bg-primary/5" : ""
                    }`}
                  >
                    <BoolCell value={has} />
                  </td>
                );
              })}
            </tr>

            {/* ── Market share ── */}
            <tr>
              <td className="sticky left-0 z-10 bg-card text-muted-foreground font-medium pr-3 py-2 whitespace-nowrap">
                {lang === "en" ? "Market share" : "Piaci részesedés"}
              </td>
              {enriched.map((q, i) => {
                const share = q.marketSharePct ?? q.meta?.market_share_pct ?? 0;
                return (
                  <td
                    key={q.insurerName}
                    className={`text-center py-2 px-3 ${
                      i === recommended ? "bg-primary/5" : ""
                    }`}
                  >
                    <span className="text-foreground font-medium">{share}%</span>
                  </td>
                );
              })}
            </tr>

            {/* ── Separator ── */}
            <tr>
              <td colSpan={colCount + 1} className="py-1">
                <div className="border-t border-border" />
              </td>
            </tr>

            {/* ── Select button row ── */}
            {onSelect && (
              <tr>
                <td className="sticky left-0 z-10 bg-card" />
                {enriched.map((q, i) => (
                  <td
                    key={q.insurerName}
                    className={`text-center px-3 pb-3 pt-2 ${
                      i === recommended ? "bg-primary/5 rounded-b-xl" : ""
                    }`}
                  >
                    <button
                      onClick={() => onSelect(q.insurerName)}
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        i === recommended
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {t("quote.select")}
                    </button>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisonPanel;
