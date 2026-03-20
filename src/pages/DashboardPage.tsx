import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ContractList from "@/components/dashboard/ContractList";
import SavingsChart from "@/components/dashboard/SavingsChart";
import NegotiationDemo from "@/components/dashboard/NegotiationDemo";
import ContractDetailPanel from "@/components/dashboard/ContractDetailPanel";
import { type Contract } from "@/components/dashboard/contractData";

const DashboardPage = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ActivityFeed />
          </div>
          <div className="lg:col-span-2">
            <ContractList onSelect={setSelectedContract} />
          </div>
        </div>

        <SavingsChart />
        <NegotiationDemo />
      </div>

      {selectedContract && (
        <ContractDetailPanel
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
