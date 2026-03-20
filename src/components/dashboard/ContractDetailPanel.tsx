import { useState } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { type Contract, statusConfig } from "./contractData";

interface ContractDetailPanelProps {
  contract: Contract;
  onClose: () => void;
}

/* ───── Status-specific detail data ───── */

const betterDealData: Record<string, { current: { plan_hu: string; plan_en: string; terms_hu: string; terms_en: string }; recommended: { provider: string; plan_hu: string; plan_en: string; monthly: number; terms_hu: string; terms_en: string }; annualSaving: number; assessment_hu: string; assessment_en: string }> = {
  "mvm-energy": {
    current: { plan_hu: "MVM Otthon Villany+Gáz", plan_en: "MVM Home Electricity+Gas", terms_hu: "Határozatlan idejű, árgarancia nélkül", terms_en: "Indefinite term, no price guarantee" },
    recommended: { provider: "E.ON", plan_hu: "E.ON Fix 12", plan_en: "E.ON Fix 12", monthly: 15000, terms_hu: "12 hónapos fix ár, online ügyintézés", terms_en: "12-month fixed price, online management" },
    annualSaving: 42000,
    assessment_hu: "Az energiadíjak az elmúlt hónapban csökkentek. Az E.ON új tarifája lényegesen kedvezőbb a jelenlegi MVM szerződésénél, és 12 hónapos árgaranciát is tartalmaz.",
    assessment_en: "Energy prices dropped last month. E.ON's new tariff is significantly cheaper than your current MVM contract and includes a 12-month price guarantee.",
  },
  "otp-bank": {
    current: { plan_hu: "OTP Alap Számlacsomag", plan_en: "OTP Basic Account", terms_hu: "Havi számlavezetési díj + tranzakciós költségek", terms_en: "Monthly account fee + transaction costs" },
    recommended: { provider: "MBH Bank", plan_hu: "MBH Ingyenes Számla", plan_en: "MBH Free Account", monthly: 0, terms_hu: "Ingyenes számlavezetés, ingyenes utalások", terms_en: "Free account management, free transfers" },
    annualSaving: 14400,
    assessment_hu: "Az OTP számlavezetési díja évi 14 400 Ft. Az MBH Bank ingyenes számlacsomagja teljes értékű alternatíva, de a váltás bonyolult lehet az állandó megbízások és a munkáltatói átutalás átállítása miatt.",
    assessment_en: "Your OTP account fee is 14,400 HUF/year. MBH Bank's free account is a full alternative, but switching may be complex due to standing orders and employer transfer setup.",
  },
};

const approvalData: Record<string, { action_hu: string; action_en: string; detail_hu: string; detail_en: string; saving: number; isKgfb: boolean }> = {
  "kobe-kgfb": {
    action_hu: "A kötelező biztosítás (KGFB) évfordulója 3 nap múlva lejár. Az AI összehasonlította az összes biztosítót — a Groupama ajánlata a legjobb.",
    action_en: "Your MTPL insurance anniversary expires in 3 days. The AI compared all insurers — Groupama's offer is the best.",
    detail_hu: "Groupama — évi 33 500 Ft (jelenlegi KÖBE: 38 000 Ft)",
    detail_en: "Groupama — 33,500 HUF/year (current KÖBE: 38,000 HUF)",
    saving: 4500,
    isKgfb: true,
  },
  "cib-card": {
    action_hu: "Nem használt hitelkártya felmondása — az éves díjat (5 900 Ft) megtakaríthatja. Az elmúlt 12 hónapban 0 tranzakciót rögzítettünk ezen a kártyán.",
    action_en: "Cancel unused credit card — save the annual fee (5,900 HUF). We recorded 0 transactions on this card in the last 12 months.",
    detail_hu: "CIB Visa Classic — éves díj: 5 900 Ft — utolsó használat: 14+ hónapja",
    detail_en: "CIB Visa Classic — annual fee: 5,900 HUF — last used: 14+ months ago",
    saving: 5900,
    isKgfb: false,
  },
};

const optimizedData: Record<string, { prev_hu: string; prev_en: string; prevCost: number; action_hu: string; action_en: string; date: string; nextReview_hu: string; nextReview_en: string }> = {
  "allianz-home": {
    prev_hu: "Generali — 4 533 Ft/hó", prev_en: "Generali — 4,533 HUF/mo",
    prevCost: 4533, action_hu: "Szolgáltató váltás: Generali → Allianz. Jobb fedezeti kör (árvíz + betörés), alacsonyabb díj.", action_en: "Provider switch: Generali → Allianz. Better coverage (flood + burglary), lower premium.",
    date: "2025-12-15", nextReview_hu: "Következő felülvizsgálat: 2026. december", nextReview_en: "Next review: December 2026",
  },
  "vodafone-net": {
    prev_hu: "Vodafone NetConnect 1000 — 7 990 Ft/hó", prev_en: "Vodafone NetConnect 1000 — 7,990 HUF/mo",
    prevCost: 7990, action_hu: "Sikeres tárgyalás: havi díj csökkentve 7 990 Ft → 5 990 Ft, sebesség emelve 1 Gbps-re díjmentesen.", action_en: "Successful negotiation: monthly fee reduced 7,990 → 5,990 HUF, speed upgraded to 1 Gbps free of charge.",
    date: "2026-03-06", nextReview_hu: "Következő felülvizsgálat: 2027. március", nextReview_en: "Next review: March 2027",
  },
  "digi-tv": {
    prev_hu: "Digi TV Családi — 6 490 Ft/hó", prev_en: "Digi TV Family — 6,490 HUF/mo",
    prevCost: 6490, action_hu: "Csomag csökkentés: a nem nézett sport csatornák eltávolítva. A kép- és csatorna minőség változatlan.", action_en: "Plan downgrade: removed unwatched sports channels. Picture quality and channel selection unchanged.",
    date: "2026-02-20", nextReview_hu: "Következő felülvizsgálat: 2026. augusztus", nextReview_en: "Next review: August 2026",
  },
};

const kgfbQuotes = [
  { rank: 1, provider: "Groupama", annual: 33500, badge_hu: "Legolcsóbb", badge_en: "Cheapest", badgeColor: "bg-amber-400 text-amber-900" },
  { rank: 2, provider: "Gránit", annual: 34200, badge_hu: "Ajánlott", badge_en: "Recommended", badgeColor: "bg-gray-300 text-gray-800" },
  { rank: 3, provider: "KÖBE", annual: 38000, badge_hu: "Jelenlegi", badge_en: "Current", badgeColor: "bg-muted text-muted-foreground" },
];

/* ───── Component ───── */

const ContractDetailPanel = ({ contract, onClose }: ContractDetailPanelProps) => {
  const { lang } = useI18n();
  const status = statusConfig[contract.status];
  const [switchTriggered, setSwitchTriggered] = useState(false);
  const [approved, setApproved] = useState(false);

  const hu = lang === "hu";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[80] animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-[90] w-full sm:w-[450px] bg-background border-l border-border shadow-2xl overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${contract.letterColor}`}>
              {contract.letter}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{contract.provider}</h3>
              <p className="text-xs text-muted-foreground">{hu ? contract.type_hu : contract.type_en}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
              {hu ? status.label_hu : status.label_en}
            </span>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Current cost */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">{hu ? "Jelenlegi díj" : "Current cost"}</p>
            <p className="text-3xl font-extrabold text-foreground">
              {contract.monthly.toLocaleString("hu-HU")} Ft
              <span className="text-base font-normal text-muted-foreground">/{hu ? "hó" : "mo"}</span>
            </p>
          </div>

          {/* ═══ BETTER DEAL ═══ */}
          {contract.status === "better" && betterDealData[contract.id] && (() => {
            const d = betterDealData[contract.id];
            return (
              <>
                <p className="text-sm text-foreground leading-relaxed">{hu ? d.assessment_hu : d.assessment_en}</p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Current */}
                  <div className="rounded-xl border border-border p-3 bg-muted/30">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">{hu ? "Jelenlegi" : "Current"}</p>
                    <p className="text-sm font-semibold text-foreground">{contract.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">{hu ? d.current.plan_hu : d.current.plan_en}</p>
                    <p className="text-lg font-bold text-foreground mt-2">{contract.monthly.toLocaleString("hu-HU")} Ft</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{hu ? d.current.terms_hu : d.current.terms_en}</p>
                  </div>
                  {/* Recommended */}
                  <div className="rounded-xl border-2 border-primary p-3 bg-primary/5">
                    <p className="text-[10px] font-bold text-primary uppercase mb-2">{hu ? "Ajánlott" : "Recommended"}</p>
                    <p className="text-sm font-semibold text-foreground">{d.recommended.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">{hu ? d.recommended.plan_hu : d.recommended.plan_en}</p>
                    <p className="text-lg font-bold text-primary mt-2">{d.recommended.monthly.toLocaleString("hu-HU")} Ft</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{hu ? d.recommended.terms_hu : d.recommended.terms_en}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{hu ? "Éves megtakarítás" : "Annual savings"}</p>
                  <p className="text-2xl font-extrabold text-primary">{d.annualSaving.toLocaleString("hu-HU")} Ft</p>
                </div>

                {switchTriggered ? (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center animate-scale-in">
                    <Check className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-primary">
                      {hu ? "Váltás elindítva! Email visszaigazolást küldünk." : "Switch initiated! We'll send an email confirmation."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => setSwitchTriggered(true)}>
                        {hu ? "Automatikus váltás ✓" : "Auto-switch ✓"}
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={onClose}>
                        {hu ? "Később" : "Later"}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center">
                      {hu ? "A váltást az ügynök intézi — Önnek semmit nem kell tennie." : "The agent handles the switch — you don't need to do anything."}
                    </p>
                  </>
                )}
              </>
            );
          })()}

          {/* ═══ APPROVAL NEEDED ═══ */}
          {contract.status === "approval" && approvalData[contract.id] && (() => {
            const d = approvalData[contract.id];
            return (
              <>
                <p className="text-sm text-foreground leading-relaxed">{hu ? d.action_hu : d.action_en}</p>

                {d.isKgfb ? (
                  <div className="space-y-2">
                    {kgfbQuotes.map((q) => (
                      <div key={q.rank} className={`flex items-center justify-between rounded-xl border p-3 ${q.rank === 1 ? "border-primary bg-primary/5" : "border-border"}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.badgeColor}`}>
                            #{q.rank} {hu ? q.badge_hu : q.badge_en}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{q.provider}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{q.annual.toLocaleString("hu-HU")} Ft/{hu ? "év" : "yr"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">{hu ? d.detail_hu : d.detail_en}</p>
                  </div>
                )}

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{hu ? "Megtakarítás" : "Savings"}</p>
                  <p className="text-2xl font-extrabold text-primary">{d.saving.toLocaleString("hu-HU")} Ft/{hu ? "év" : "yr"}</p>
                </div>

                {approved ? (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center animate-scale-in">
                    <Check className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-primary">
                      {hu ? "Jóváhagyva! Az ügynök elindítja a folyamatot." : "Approved! The agent will start the process."}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setApproved(true)}>
                      {hu ? "Jóváhagyom ✓" : "Approve ✓"}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                      {hu ? "Elutasítom" : "Decline"}
                    </Button>
                  </div>
                )}
              </>
            );
          })()}

          {/* ═══ OPTIMIZED ═══ */}
          {contract.status === "optimized" && optimizedData[contract.id] && (() => {
            const d = optimizedData[contract.id];
            return (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="line-through">{hu ? d.prev_hu : d.prev_en}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-bold text-primary">{contract.monthly.toLocaleString("hu-HU")} Ft/{hu ? "hó" : "mo"}</span>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">{hu ? "Az ügynök tevékenysége" : "Agent action"}</p>
                  <p className="text-sm text-foreground leading-relaxed">{hu ? d.action_hu : d.action_en}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {hu ? "Végrehajtva" : "Executed"}: {d.date}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{hu ? "Éves megtakarítás" : "Annual savings"}</p>
                  <p className="text-2xl font-extrabold text-primary">
                    {((d.prevCost - contract.monthly) * 12).toLocaleString("hu-HU")} Ft
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">{hu ? d.nextReview_hu : d.nextReview_en}</p>
                <p className="text-sm text-primary font-medium text-center">
                  {hu ? "Köszönjük a bizalmát! 🙏" : "Thank you for your trust! 🙏"}
                </p>
              </>
            );
          })()}

          {/* ═══ MONITORING ═══ */}
          {contract.status === "monitoring" && (
            <>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {hu
                    ? "Jelenlegi díj: 6 490 Ft/hó — a piaci összehasonlítás alapján ez versenyképes."
                    : "Current cost: 6,490 HUF/month — competitive based on market comparison."}
                </p>
                <p className="text-sm text-foreground">
                  {hu ? "Következő ellenőrzés: 30 nap múlva" : "Next check: in 30 days"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hu
                    ? "Ha változik a piaci helyzet, azonnal értesítjük."
                    : "If market conditions change, we'll notify you immediately."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContractDetailPanel;
