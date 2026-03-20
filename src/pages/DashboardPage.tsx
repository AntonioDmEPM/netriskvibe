import { useState, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ContractList from "@/components/dashboard/ContractList";
import SavingsChart from "@/components/dashboard/SavingsChart";

import ContractDetailPanel from "@/components/dashboard/ContractDetailPanel";
import FloatingAgentIndicator from "@/components/dashboard/FloatingAgentIndicator";
import { type Contract } from "@/components/dashboard/contractData";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { type DemoTab } from "@/components/TopNavBar";

interface DashboardPageProps {
  onSwitchTab?: (tab: DemoTab) => void;
}

const DashboardPage = ({ onSwitchTab }: DashboardPageProps) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [kgfbApproved, setKgfbApproved] = useState(false);
  const [highlightedContractId, setHighlightedContractId] = useState<string | null>(null);
  const { toast } = useToast();

  const optimizedCount = kgfbApproved ? 6 : 5;
  const optimizedProgress = kgfbApproved ? 75 : 62.5;

  const handleKgfbApprove = useCallback(() => {
    setKgfbApproved(true);
    toast({
      title: "A KGFB váltást elindítottuk!",
      description: "Emailben visszaigazoljuk.",
    });
  }, [toast]);

  const handleScrollToContract = useCallback((contractId: string) => {
    setHighlightedContractId(contractId);
    const el = document.getElementById(`contract-${contractId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightedContractId(null), 3000);
    }
  }, []);

  const { lang } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb navigation */}
      {onSwitchTab && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0 flex items-center justify-between text-sm">
          <button
            onClick={() => onSwitchTab("netrisk")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Netrisk homepage
          </button>
          <button
            onClick={() => onSwitchTab("vision")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === "hu" ? "Az architektúra megtekintése" : "View the architecture"} →
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader optimizedCount={optimizedCount} optimizedProgress={optimizedProgress} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ActivityFeed
              kgfbApproved={kgfbApproved}
              onKgfbApprove={handleKgfbApprove}
              onScrollToContract={handleScrollToContract}
            />
          </div>
          <div className="lg:col-span-2">
            <ContractList
              onSelect={setSelectedContract}
              kgfbApproved={kgfbApproved}
              highlightedContractId={highlightedContractId}
            />
          </div>
        </div>

        <SavingsChart />
      </div>

      {selectedContract && (
        <ContractDetailPanel
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}

      <FloatingAgentIndicator />
    </div>
  );
};

export default DashboardPage;
