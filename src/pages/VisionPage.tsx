import VisionHero from "@/components/vision/VisionHero";
import EvolutionSection from "@/components/vision/EvolutionSection";
import MarketGapSection from "@/components/vision/MarketGapSection";
import RevenueTransformationSection from "@/components/vision/RevenueTransformationSection";
import ArchitectureSection from "@/components/vision/ArchitectureSection";
import RegulatorySection from "@/components/vision/RegulatorySection";
import RevenueSection from "@/components/vision/RevenueSection";
import ProjectionSection from "@/components/vision/ProjectionSection";
import MarketOpportunitySection from "@/components/vision/MarketOpportunitySection";
import RoadmapSection from "@/components/vision/RoadmapSection";
import SuccessMetricsSection from "@/components/vision/SuccessMetricsSection";
import ClosingCTA from "@/components/vision/ClosingCTA";
import { type DemoTab } from "@/components/TopNavBar";

interface VisionPageProps {
  onSwitchTab?: (tab: DemoTab) => void;
}

const VisionPage = ({ onSwitchTab }: VisionPageProps) => (
  <div className="min-h-screen bg-background">
    <VisionHero />
    <EvolutionSection />
    <MarketGapSection />
    <RevenueTransformationSection />
    <ArchitectureSection />
    <RegulatorySection />
    <RevenueSection />
    <ProjectionSection />
    <MarketOpportunitySection />
    <RoadmapSection />
    <SuccessMetricsSection />
    <ClosingCTA onSwitchTab={onSwitchTab} />
  </div>
);

export default VisionPage;
