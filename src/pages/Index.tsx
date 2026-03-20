import { useState, useEffect, useCallback } from "react";
import StickyNav from "@/components/homepage/StickyNav";
import HeroSection from "@/components/homepage/HeroSection";
import SocialProofBar from "@/components/homepage/SocialProofBar";
import HowItWorks from "@/components/homepage/HowItWorks";
import ProductGrid from "@/components/homepage/ProductGrid";
import BeforeAfter from "@/components/homepage/BeforeAfter";
import TrustPartners from "@/components/homepage/TrustPartners";
import FooterSection from "@/components/homepage/FooterSection";
import ConversationOverlay from "@/components/homepage/ConversationOverlay";
import AnnouncementBar from "@/components/homepage/AnnouncementBar";
import AdvisorFAB from "@/components/homepage/AdvisorFAB";
import PresenterBar from "@/components/homepage/PresenterBar";
import AgentPanel from "@/components/homepage/AgentPanel";
import { type AgentName, getAgentEvents, type TurnAgentEvents } from "@/lib/agentEvents";
import { type DemoTab } from "@/components/TopNavBar";
import { useI18n } from "@/lib/i18n";

interface IndexProps {
  onSwitchTab?: (tab: DemoTab) => void;
}

const Index = ({ onSwitchTab }: IndexProps) => {
  const [overlay, setOverlay] = useState<{ flowId: string; initialMessage?: string } | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentName | null>(null);
  const [agentEventsMap, setAgentEventsMap] = useState<TurnAgentEvents[] | null>(null);

  const openOverlay = useCallback((flowId: string, initialMessage?: string) => {
    setOverlay({ flowId, initialMessage });
    if (presenterMode) {
      const events = getAgentEvents(flowId);
      setAgentEventsMap(events);
      if (events.length > 0) setActiveAgent(events[0].activeAgent);
    }
  }, [presenterMode]);

  const handleTurnChange = useCallback((turnIndex: number) => {
    if (!agentEventsMap) return;
    if (turnIndex < agentEventsMap.length) {
      setActiveAgent(agentEventsMap[turnIndex].activeAgent);
    }
  }, [agentEventsMap]);

  const handleReset = useCallback(() => {
    setOverlay(null);
    setActiveAgent(null);
    setAgentEventsMap(null);
  }, []);

  // Ctrl+Shift+P toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setPresenterMode((p) => !p);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const topOffset = presenterMode ? "2.5rem" : "2.25rem";

  const { lang } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Cross-link banner to Dashboard */}
      {onSwitchTab && (
        <div className="bg-secondary text-secondary-foreground text-center py-2 px-4 text-sm">
          <span>💡 {lang === "hu" ? "Nézze meg, hogyan működik a teljes pénzügyi ügynök → " : "See how the full financial agent works → "}</span>
          <button
            onClick={() => onSwitchTab("dashboard")}
            className="font-bold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            Dashboard
          </button>
        </div>
      )}

      {presenterMode && (
        <PresenterBar onStartFlow={openOverlay} onReset={handleReset} />
      )}

      <AnnouncementBar
        isReturning={isReturning}
        onToggle={setIsReturning}
        style={{ top: presenterMode ? "calc(36px + 2.5rem)" : "36px" }}
      />
      <StickyNav
        onOpenOverlay={() => openOverlay("new")}
        hasAnnouncementBar
        extraTopOffset={36 + (presenterMode ? 40 : 0)}
        isReturning={isReturning}
      />
      <HeroSection onStartFlow={openOverlay} isReturning={isReturning} />
      <SocialProofBar />
      <HowItWorks />
      <ProductGrid onStartFlow={openOverlay} />
      <BeforeAfter />
      <TrustPartners />
      <FooterSection onActivatePresenter={() => setPresenterMode(true)} />

      {!overlay && !presenterMode && <AdvisorFAB onClick={() => openOverlay("new")} />}

      {overlay && (
        <ConversationOverlay
          flowId={overlay.flowId}
          initialMessage={overlay.initialMessage}
          onClose={() => { setOverlay(null); setActiveAgent(null); setAgentEventsMap(null); }}
          onTurnChange={presenterMode ? handleTurnChange : undefined}
        />
      )}

      {presenterMode && <AgentPanel activeAgent={activeAgent} />}
    </div>
  );
};

export default Index;
