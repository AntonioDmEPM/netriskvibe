import VisionHero from "@/components/vision/VisionHero";
import EvolutionSection from "@/components/vision/EvolutionSection";
import ArchitectureSection from "@/components/vision/ArchitectureSection";
import RegulatorySection from "@/components/vision/RegulatorySection";
import RevenueSection from "@/components/vision/RevenueSection";
import RoadmapSection from "@/components/vision/RoadmapSection";
import ClosingCTA from "@/components/vision/ClosingCTA";
import { type DemoTab } from "@/components/TopNavBar";

interface VisionPageProps {
  onSwitchTab?: (tab: DemoTab) => void;
}

const VisionPage = ({ onSwitchTab }: VisionPageProps) => (
  <div className="min-h-screen bg-background">
    <VisionHero />
    <EvolutionSection />
    <ArchitectureSection />
    <RegulatorySection />
    <RevenueSection />
    <RoadmapSection />
    <ClosingCTA onSwitchTab={onSwitchTab} />
  </div>
);

export default VisionPage;
