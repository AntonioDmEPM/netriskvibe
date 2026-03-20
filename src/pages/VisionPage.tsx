import VisionHero from "@/components/vision/VisionHero";
import EvolutionSection from "@/components/vision/EvolutionSection";
import ArchitectureSection from "@/components/vision/ArchitectureSection";
import RegulatorySection from "@/components/vision/RegulatorySection";
import RevenueSection from "@/components/vision/RevenueSection";
import RoadmapSection from "@/components/vision/RoadmapSection";
import ClosingCTA from "@/components/vision/ClosingCTA";

const VisionPage = () => (
  <div className="min-h-screen bg-background">
    <VisionHero />
    <EvolutionSection />
    <ArchitectureSection />
    <RegulatorySection />
    <RevenueSection />
    <RoadmapSection />
    <ClosingCTA />
  </div>
);

export default VisionPage;
