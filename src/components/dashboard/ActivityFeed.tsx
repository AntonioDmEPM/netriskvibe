import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Eye } from "lucide-react";
import { activityConversations } from "./activityConversations";
import ActivityDetailPopup from "./ActivityDetailPopup";

interface FeedItem {
  color: string;
  dotClass: string;
  time: string;
  text: string;
  action?: "kgfb-approve" | "mvm-details";
  savings?: number;
  buttons?: { label: string; variant: "default" | "outline"; action?: string }[];
}

const fmt = (n: number) => `€${n.toLocaleString("en-US")}`;

const feedItems: FeedItem[] = [
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time: "2 hours ago",
    text: "Energy prices dropped. E.ON's new tariff is €105/year cheaper than your current MVM contract. Switch prepared.",
    savings: 105,
    buttons: [{ label: "Details →", variant: "outline", action: "mvm-details" }],
  },
  {
    color: "bg-amber-500", dotClass: "border-amber-200",
    time: "yesterday",
    text: "Your MTPL insurance anniversary expires in 3 days. Groupama quote: €84/year — €11 savings. Approval needed.",
    savings: 11,
    action: "kgfb-approve",
    buttons: [
      { label: "Approve ✓", variant: "default", action: "kgfb-approve" },
      { label: "Details", variant: "outline" },
    ],
  },
  {
    color: "bg-blue-500", dotClass: "border-blue-200",
    time: "3 days ago",
    text: "Analyzed your Telekom mobile contract. Current plan is competitive — no switch recommended. Next check: in 30 days.",
  },
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time: "1 week ago",
    text: "Successfully renegotiated Vodafone internet: €20 → €15/month. Annual savings: €60. ✅ Executed automatically.",
    savings: 60,
  },
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time: "2 weeks ago",
    text: "Switched home insurance from Generali → Allianz. Annual savings: €21, better coverage. ✅",
    savings: 21,
  },
  {
    color: "bg-blue-500", dotClass: "border-blue-200",
    time: "3 weeks ago",
    text: "Analyzed your OTP bank account. MBH Bank's free plan would save €36/year, but switching is complex (standing orders). Would only proceed with your confirmation.",
    savings: 36,
  },
  {
    color: "bg-amber-500", dotClass: "border-amber-200",
    time: "1 month ago",
    text: "Detected an unused annual fee (€15) on your CIB credit card. Cancellation request prepared.",
    savings: 15,
    buttons: [{ label: "Approve cancellation", variant: "outline" }],
  },
  {
    color: "bg-primary", dotClass: "border-primary/30",
    time: "1 month ago",
    text: "Successfully switched your Digi TV subscription to a cheaper plan. Monthly savings: €6. ✅",
    savings: 75,
  },
];

interface ActivityFeedProps {
  kgfbApproved: boolean;
  onKgfbApprove: () => void;
  onScrollToContract: (contractId: string) => void;
}

const SavingsSplitBar = ({ savings }: { savings: number }) => {
  const customer = Math.round(savings / 2);
  const fee = savings - customer;
  return (
    <div className="mt-2 pt-2 border-t border-border/50">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">
          Savings: {fmt(savings)}/yr
        </span>
        <span className="text-muted-foreground/50">→</span>
        <span className="font-semibold" style={{ color: "#00A651" }}>
          You: {fmt(customer)}
        </span>
        <span className="text-muted-foreground/40">|</span>
        <span className="font-medium text-blue-400/80">
          Fee: {fmt(fee)}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden mt-1.5 bg-muted">
        <div className="h-full rounded-l-full" style={{ width: "50%", background: "#00A651" }} />
        <div className="h-full rounded-r-full bg-blue-400/50" style={{ width: "50%" }} />
      </div>
    </div>
  );
};

const ActivityFeed = ({ kgfbApproved, onKgfbApprove, onScrollToContract }: ActivityFeedProps) => {
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
      <h2 className="text-lg font-semibold text-foreground mb-4">Agent Activity</h2>
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
                      {item.time}
                    </span>
                    {clickable && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium shrink-0">
                        <Eye className="w-3 h-3" />
                        Details
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {item.text}
                  </p>
                  {item.buttons && (
                    <div className="flex gap-2 mt-2">
                      {item.buttons.map((btn, j) => {
                        if (btn.action === "kgfb-approve") {
                          if (kgfbApproved) {
                            return (
                              <span key={j} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary px-3 py-1.5 rounded-md bg-primary/10">
                                ✅ Approved — switch in progress
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
                                <><Loader2 className="w-3 h-3 animate-spin mr-1" />Processing...</>
                              ) : (
                                btn.label
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
                              {btn.label}
                            </Button>
                          );
                        }
                        return (
                          <Button key={j} size="sm" variant={btn.variant} className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                            {btn.label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  {item.savings && <SavingsSplitBar savings={item.savings} />}
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
