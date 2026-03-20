import { useState } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Contract, statusConfig } from "./contractData";

interface ContractDetailPanelProps {
  contract: Contract;
  onClose: () => void;
}

const betterDealData: Record<string, { current: { plan: string; terms: string }; recommended: { provider: string; plan: string; monthly: number; terms: string }; annualSaving: number; assessment: string }> = {
  "mvm-energy": {
    current: { plan: "MVM Home Electricity+Gas", terms: "Indefinite term, no price guarantee" },
    recommended: { provider: "E.ON", plan: "E.ON Fix 12", monthly: 38, terms: "12-month fixed price, online management" },
    annualSaving: 105,
    assessment: "Energy prices dropped last month. E.ON's new tariff is significantly cheaper than your current MVM contract and includes a 12-month price guarantee.",
  },
  "otp-bank": {
    current: { plan: "OTP Basic Account", terms: "Monthly account fee + transaction costs" },
    recommended: { provider: "MBH Bank", plan: "MBH Free Account", monthly: 0, terms: "Free account management, free transfers" },
    annualSaving: 36,
    assessment: "Your OTP account fee is €36/year. MBH Bank's free account is a full alternative, but switching may be complex due to standing orders and employer transfer setup.",
  },
};

const approvalData: Record<string, { action: string; detail: string; saving: number; isKgfb: boolean }> = {
  "kobe-kgfb": {
    action: "Your MTPL insurance anniversary expires in 3 days. The AI compared all insurers — Groupama's offer is the best.",
    detail: "Groupama — €84/year (current KÖBE: €95)",
    saving: 11,
    isKgfb: true,
  },
  "cib-card": {
    action: "Cancel unused credit card — save the annual fee (€15). We recorded 0 transactions on this card in the last 12 months.",
    detail: "CIB Visa Classic — annual fee: €15 — last used: 14+ months ago",
    saving: 15,
    isKgfb: false,
  },
};

const optimizedData: Record<string, { prev: string; prevCost: number; action: string; date: string; nextReview: string }> = {
  "allianz-home": {
    prev: "Generali — €11/mo",
    prevCost: 11, action: "Provider switch: Generali → Allianz. Better coverage (flood + burglary), lower premium.",
    date: "2025-12-15", nextReview: "Next review: December 2026",
  },
  "vodafone-net": {
    prev: "Vodafone NetConnect 1000 — €20/mo",
    prevCost: 20, action: "Successful negotiation: monthly fee reduced €20 → €15, speed upgraded to 1 Gbps free of charge.",
    date: "2026-03-06", nextReview: "Next review: March 2027",
  },
  "digi-tv": {
    prev: "Digi TV Family — €16/mo",
    prevCost: 16, action: "Plan downgrade: removed unwatched sports channels. Picture quality and channel selection unchanged.",
    date: "2026-02-20", nextReview: "Next review: August 2026",
  },
};

const kgfbQuotes = [
  { rank: 1, provider: "Groupama", annual: 84, badge: "Cheapest", badgeColor: "bg-amber-400 text-amber-900" },
  { rank: 2, provider: "Gránit", annual: 86, badge: "Recommended", badgeColor: "bg-gray-300 text-gray-800" },
  { rank: 3, provider: "KÖBE", annual: 95, badge: "Current", badgeColor: "bg-muted text-muted-foreground" },
];

const ContractDetailPanel = ({ contract, onClose }: ContractDetailPanelProps) => {
  const status = statusConfig[contract.status];
  const [switchTriggered, setSwitchTriggered] = useState(false);
  const [approved, setApproved] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[80] animate-fade-in" onClick={onClose} />

      <div className="fixed top-0 right-0 bottom-0 z-[90] w-full sm:w-[450px] bg-background border-l border-border shadow-2xl overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${contract.letterColor}`}>
              {contract.letter}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{contract.provider}</h3>
              <p className="text-xs text-muted-foreground">{contract.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
              {status.label}
            </span>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current cost</p>
            <p className="text-3xl font-extrabold text-foreground">
              €{contract.monthly}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          {contract.status === "better" && betterDealData[contract.id] && (() => {
            const d = betterDealData[contract.id];
            return (
              <>
                <p className="text-sm text-foreground leading-relaxed">{d.assessment}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3 bg-muted/30">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Current</p>
                    <p className="text-sm font-semibold text-foreground">{contract.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d.current.plan}</p>
                    <p className="text-lg font-bold text-foreground mt-2">€{contract.monthly}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{d.current.terms}</p>
                  </div>
                  <div className="rounded-xl border-2 border-primary p-3 bg-primary/5">
                    <p className="text-[10px] font-bold text-primary uppercase mb-2">Recommended</p>
                    <p className="text-sm font-semibold text-foreground">{d.recommended.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d.recommended.plan}</p>
                    <p className="text-lg font-bold text-primary mt-2">€{d.recommended.monthly}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{d.recommended.terms}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Annual savings</p>
                  <p className="text-2xl font-extrabold text-primary">€{d.annualSaving}</p>
                </div>

                {switchTriggered ? (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center animate-scale-in">
                    <Check className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-primary">
                      Switch initiated! We'll send an email confirmation.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => setSwitchTriggered(true)}>
                        Auto-switch ✓
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={onClose}>
                        Later
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center">
                      The agent handles the switch — you don't need to do anything.
                    </p>
                  </>
                )}
              </>
            );
          })()}

          {contract.status === "approval" && approvalData[contract.id] && (() => {
            const d = approvalData[contract.id];
            return (
              <>
                <p className="text-sm text-foreground leading-relaxed">{d.action}</p>

                {d.isKgfb ? (
                  <div className="space-y-2">
                    {kgfbQuotes.map((q) => (
                      <div key={q.rank} className={`flex items-center justify-between rounded-xl border p-3 ${q.rank === 1 ? "border-primary bg-primary/5" : "border-border"}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.badgeColor}`}>
                            #{q.rank} {q.badge}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{q.provider}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">€{q.annual}/yr</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">{d.detail}</p>
                  </div>
                )}

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Savings</p>
                  <p className="text-2xl font-extrabold text-primary">€{d.saving}/yr</p>
                </div>

                {approved ? (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center animate-scale-in">
                    <Check className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-primary">
                      Approved! The agent will start the process.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setApproved(true)}>
                      Approve ✓
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                      Decline
                    </Button>
                  </div>
                )}
              </>
            );
          })()}

          {contract.status === "optimized" && optimizedData[contract.id] && (() => {
            const d = optimizedData[contract.id];
            return (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="line-through">{d.prev}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-bold text-primary">€{contract.monthly}/mo</span>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Agent action</p>
                  <p className="text-sm text-foreground leading-relaxed">{d.action}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Executed: {d.date}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Annual savings</p>
                  <p className="text-2xl font-extrabold text-primary">
                    €{(d.prevCost - contract.monthly) * 12}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">{d.nextReview}</p>
                <p className="text-sm text-primary font-medium text-center">
                  Thank you for your trust! 🙏
                </p>
              </>
            );
          })()}

          {contract.status === "monitoring" && (
            <>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  Current cost: €{contract.monthly}/month — competitive based on market comparison.
                </p>
                <p className="text-sm text-foreground">
                  Next check: in 30 days
                </p>
                <p className="text-xs text-muted-foreground">
                  If market conditions change, we'll notify you immediately.
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
