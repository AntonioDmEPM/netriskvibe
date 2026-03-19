import { useState } from "react";
import StickyNav from "@/components/homepage/StickyNav";
import HeroSection from "@/components/homepage/HeroSection";
import SocialProofBar from "@/components/homepage/SocialProofBar";
import HowItWorks from "@/components/homepage/HowItWorks";
import ProductGrid from "@/components/homepage/ProductGrid";
import BeforeAfter from "@/components/homepage/BeforeAfter";
import TrustPartners from "@/components/homepage/TrustPartners";
import FooterSection from "@/components/homepage/FooterSection";
import ConversationOverlay from "@/components/homepage/ConversationOverlay";

const Index = () => {
  const [overlay, setOverlay] = useState<{ flowId: string; initialMessage?: string } | null>(null);

  const openOverlay = (flowId: string, initialMessage?: string) => {
    setOverlay({ flowId, initialMessage });
  };

  return (
    <div className="min-h-screen bg-background">
      <StickyNav onOpenOverlay={() => openOverlay("new")} />
      <HeroSection onStartFlow={openOverlay} />
      <SocialProofBar />
      <HowItWorks />
      <ProductGrid onStartFlow={openOverlay} />
      <BeforeAfter />
      <TrustPartners />
      <FooterSection />

      {overlay && (
        <ConversationOverlay
          flowId={overlay.flowId}
          initialMessage={overlay.initialMessage}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  );
};

export default Index;
