import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Eye } from "lucide-react";
import { activityConversations } from "./activityConversations";
import ActivityDetailPopup from "./ActivityDetailPopup";

interface FeedItem {
  color: string;
  dotClass: string;
  time_hu: string;
  time_en: string;
  text_hu: string;
  text_en: string;
  action?: "kgfb-approve" | "mvm-details";
  // Annual savings for this activity (null = no savings line)
  savings?: number;
  buttons?: { label_hu: string; label_en: string; variant: "default" | "outline"; action?: string }[];
}

const fmt = (n: number) => n.toLocaleString("hu-HU");

const feedItems: FeedItem[] = [
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time_hu: "2 órája", time_en: "2 hours ago",
    text_hu: "Az energiadíjak csökkentek. Az E.ON új tarifája évi 42 000 Ft-tal olcsóbb, mint a jelenlegi MVM szerződése. Váltás előkészítve.",
    text_en: "Energy prices dropped. E.ON's new tariff is 42,000 HUF/year cheaper than your current MVM contract. Switch prepared.",
    savings: 42000,
    buttons: [{ label_hu: "Részletek →", label_en: "Details →", variant: "outline", action: "mvm-details" }],
  },
  {
    color: "bg-amber-500", dotClass: "border-amber-200",
    time_hu: "tegnap", time_en: "yesterday",
    text_hu: "A kötelező biztosítás (KGFB) évfordulója 3 nap múlva lejár. Groupama ajánlata évi 33 500 Ft — 4 500 Ft megtakarítás. Jóváhagyása szükséges.",
    text_en: "Your MTPL insurance anniversary expires in 3 days. Groupama quote: 33,500 HUF/year — 4,500 HUF savings. Approval needed.",
    savings: 4500,
    action: "kgfb-approve",
    buttons: [
      { label_hu: "Jóváhagyom ✓", label_en: "Approve ✓", variant: "default", action: "kgfb-approve" },
      { label_hu: "Részletek", label_en: "Details", variant: "outline" },
    ],
  },
  {
    color: "bg-blue-500", dotClass: "border-blue-200",
    time_hu: "3 napja", time_en: "3 days ago",
    text_hu: "A Telekom mobil szerződését elemeztem. A jelenlegi díjcsomag versenyképes — nem javaslok váltást. Következő ellenőrzés: 30 nap múlva.",
    text_en: "Analyzed your Telekom mobile contract. Current plan is competitive — no switch recommended. Next check: in 30 days.",
  },
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time_hu: "1 hete", time_en: "1 week ago",
    text_hu: "Sikeresen újratárgyaltam a Vodafone internet díját: havi 7 990 Ft → 5 990 Ft. Éves megtakarítás: 24 000 Ft. ✅ Automatikusan végrehajtva.",
    text_en: "Successfully renegotiated Vodafone internet: 7,990 → 5,990 HUF/month. Annual savings: 24,000 HUF. ✅ Executed automatically.",
    savings: 24000,
  },
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time_hu: "2 hete", time_en: "2 weeks ago",
    text_hu: "A lakásbiztosítást átváltottam Generali → Allianz-ra. Éves megtakarítás: 8 200 Ft, jobb fedezeti kör. ✅",
    text_en: "Switched home insurance from Generali → Allianz. Annual savings: 8,200 HUF, better coverage. ✅",
    savings: 8200,
  },
  {
    color: "bg-blue-500", dotClass: "border-blue-200",
    time_hu: "3 hete", time_en: "3 weeks ago",
    text_hu: "Az OTP bankszámlát elemeztem. Az MBH Bank ingyenes számlacsomagja évi 14 400 Ft megtakarítás lenne, de a váltás bonyolult (állandó megbízások átállítása). Csak az Ön megerősítésével lépnék.",
    text_en: "Analyzed your OTP bank account. MBH Bank's free plan would save 14,400 HUF/year, but switching is complex (standing orders). Would only proceed with your confirmation.",
    savings: 14400,
  },
  {
    color: "bg-amber-500", dotClass: "border-amber-200",
    time_hu: "1 hónapja", time_en: "1 month ago",
    text_hu: "A CIB hitelkártyán észleltem egy nem használt éves díjat (5 900 Ft). Felmondási kérelmet készítettem elő.",
    text_en: "Detected an unused annual fee (5,900 HUF) on your CIB credit card. Cancellation request prepared.",
    savings: 5900,
    buttons: [{ label_hu: "Felmondás jóváhagyása", label_en: "Approve cancellation", variant: "outline" }],
  },
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time_hu: "1 hónapja", time_en: "1 month ago",
    text_hu: "A Digi TV előfizetését sikeresen leváltottam egy olcsóbb csomagra. Havi megtakarítás: 2 500 Ft. ✅",
    text_en: "Successfully switched your Digi TV subscription to a cheaper plan. Monthly savings: 2,500 HUF. ✅",
    savings: 30000, // annualized: 2500 * 12
  },
];

interface ActivityFeedProps {
  kgfbApproved: boolean;
  onKgfbApprove: () => void;
  onScrollToContract: (contractId: string) => void;
}

const SavingsSplitBar = ({ savings, lang }: { savings: number; lang: string }) => {
  const customer = Math.round(savings / 2);
  const fee = savings - customer;
  return (
    <div className="mt-2 pt-2 border-t border-border/50">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">
          {lang === "hu" ? "Megtakarítás:" : "Savings:"} {fmt(savings)} Ft/{lang === "hu" ? "év" : "yr"}
        </span>
        <span className="text-muted-foreground/50">→</span>
        <span className="font-semibold" style={{ color: "#00A651" }}>
          {lang === "hu" ? "Ön:" : "You:"} {fmt(customer)} Ft
        </span>
        <span className="text-muted-foreground/40">|</span>
        <span className="font-medium text-blue-400/80">
          {lang === "hu" ? "Díj:" : "Fee:"} {fmt(fee)} Ft
        </span>
      </div>
      {/* Mini two-tone bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden mt-1.5 bg-muted">
        <div className="h-full rounded-l-full" style={{ width: "50%", background: "#00A651" }} />
        <div className="h-full rounded-r-full bg-blue-400/50" style={{ width: "50%" }} />
      </div>
    </div>
  );
};

const ActivityFeed = ({ kgfbApproved, onKgfbApprove, onScrollToContract }: ActivityFeedProps) => {
  const { lang } = useI18n();
  const [approving, setApproving] = useState(false);
  const [openConversationIdx, setOpenConversationIdx] = useState<number | null>(null);

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      onKgfbApprove();
    }, 1000);
  };

  const hasConversation = (idx: number) => activityConversations[idx] != null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {lang === "hu" ? "Ügynök aktivitás" : "Agent Activity"}
      </h2>
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {feedItems.map((item, i) => {
            const clickable = hasConversation(i);
            return (
              <div
                key={i}
                className="relative pl-7 opacity-0"
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 100}ms forwards` }}
              >
                <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full ${item.color} border-2 ${item.dotClass} ring-2 ring-background`} />
                <div
                  className={`bg-card border border-border rounded-lg p-3 transition-all duration-150 ${
                    clickable ? "cursor-pointer hover:shadow-md hover:border-primary/20 active:scale-[0.99]" : ""
                  }`}
                  onClick={() => { if (clickable) setOpenConversationIdx(i); }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {lang === "hu" ? item.time_hu : item.time_en}
                    </span>
                    {clickable && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium shrink-0">
                        <Eye className="w-3 h-3" />
                        {lang === "hu" ? "Részletek" : "Details"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {lang === "hu" ? item.text_hu : item.text_en}
                  </p>
                  {item.buttons && (
                    <div className="flex gap-2 mt-2">
                      {item.buttons.map((btn, j) => {
                        if (btn.action === "kgfb-approve") {
                          if (kgfbApproved) {
                            return (
                              <span key={j} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary px-3 py-1.5 rounded-md bg-primary/10">
                                ✅ {lang === "hu" ? "Jóváhagyva — váltás folyamatban" : "Approved — switch in progress"}
                              </span>
                            );
                          }
                          return (
                            <Button
                              key={j}
                              size="sm"
                              variant={btn.variant}
                              className="h-7 text-xs"
                              onClick={handleApprove}
                              disabled={approving}
                            >
                              {approving ? (
                                <><Loader2 className="w-3 h-3 animate-spin mr-1" />{lang === "hu" ? "Feldolgozás..." : "Processing..."}</>
                              ) : (
                                lang === "hu" ? btn.label_hu : btn.label_en
                              )}
                            </Button>
                          );
                        }
                        if (btn.action === "mvm-details") {
                          return (
                            <Button
                              key={j}
                              size="sm"
                              variant={btn.variant}
                              className="h-7 text-xs"
                              onClick={(e) => { e.stopPropagation(); onScrollToContract("mvm-energy"); }}
                            >
                              {lang === "hu" ? btn.label_hu : btn.label_en}
                            </Button>
                          );
                        }
                        return (
                          <Button key={j} size="sm" variant={btn.variant} className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                            {lang === "hu" ? btn.label_hu : btn.label_en}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  {/* 50/50 savings split bar */}
                  {item.savings && <SavingsSplitBar savings={item.savings} lang={lang} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openConversationIdx !== null && activityConversations[openConversationIdx] && (
        <ActivityDetailPopup
          conversation={activityConversations[openConversationIdx]!}
          onClose={() => setOpenConversationIdx(null)}
        />
      )}
    </div>
  );
};

export default ActivityFeed;
