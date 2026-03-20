import { useState } from "react";
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

  return (
    <>
      <TopNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ paddingTop: 36 }}>
        {activeTab === "netrisk" && <Index />}
        {activeTab === "dashboard" && <DashboardPage />}
        {activeTab === "vision" && <VisionPage />}
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
