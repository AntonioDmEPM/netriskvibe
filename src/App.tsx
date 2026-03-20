import { useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import TopNavBar, { type DemoTab } from "@/components/TopNavBar";
import Index from "./pages/Index.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import VisionPage from "./pages/VisionPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppShell = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>("netrisk");
  const [fadeKey, setFadeKey] = useState(0);

  const handleTabChange = (tab: DemoTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setFadeKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <>
      <TopNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      <div style={{ paddingTop: 36 }}>
        <div
          key={fadeKey}
          className="animate-tab-fade-in"
        >
          {activeTab === "netrisk" && <Index onSwitchTab={handleTabChange} />}
          {activeTab === "dashboard" && <DashboardPage onSwitchTab={handleTabChange} />}
          {activeTab === "vision" && <VisionPage onSwitchTab={handleTabChange} />}
        </div>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
