import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Omnibar from "@/components/Omnibar";
import ThoughtLog, { ThoughtStep } from "@/components/ThoughtLog";
import RecommendationCard, { Recommendation } from "@/components/RecommendationCard";
import AgentFAB from "@/components/AgentFAB";
import StatsBar from "@/components/StatsBar";
import ComparisonChat from "@/components/ComparisonChat";

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    provider: "Allianz",
    monthlyPrice: "$48",
    yearlyPrice: "$576",
    savings: "$110/yr",
    badge: "Best Value",
    badgeType: "best",
    reason: "For your 2022 BMW and age group, this offers the optimal price-to-coverage ratio. Accident insurance and roadside assistance are the strongest here.",
    highlights: [
      "$0 deductible on glass damage",
      "24-hour roadside assistance",
      "Rental car coverage for up to 5 days",
      "Supplemental accident insurance for driver",
    ],
    rating: 5,
    coverage: "Full Coverage + Add-ons",
  },
  {
    id: "2",
    provider: "Generali",
    monthlyPrice: "$42",
    yearlyPrice: "$504",
    savings: "$182/yr",
    badge: "Cheapest",
    badgeType: "cheapest",
    reason: "If price is your top priority, this is the best choice. Provides adequate coverage for daily commuting with a basic package.",
    highlights: [
      "Basic roadside assistance",
      "Online claims filing",
      "Monthly payments with no surcharge",
    ],
    rating: 4,
    coverage: "Basic Liability Package",
  },
  {
    id: "3",
    provider: "PostaInsurance",
    monthlyPrice: "$43",
    yearlyPrice: "$516",
    badge: "Most Popular",
    badgeType: "popular",
    reason: "Most customers with a similar profile chose this option. A well-balanced package with excellent customer service and fast claims processing.",
    highlights: [
      "Fast claims processing (avg 5 business days)",
      "Premium customer support",
      "Legal protection add-on",
      "Nationwide partner service network",
    ],
    rating: 4,
    coverage: "Premium Liability Package",
  },
];

const thoughtSteps: { text: string; icon: ThoughtStep["icon"] }[] = [
  { text: "Retrieving vehicle data (2022 BMW)...", icon: "search" },
  { text: "Analyzing quotes from 12 insurers...", icon: "analyze" },
  { text: "Comparing value-for-money for your profile...", icon: "compare" },
  { text: "Verifying coverage terms...", icon: "verify" },
];

type AppState = "idle" | "thinking" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("idle");
  const [steps, setSteps] = useState<ThoughtStep[]>([]);
  const [query, setQuery] = useState("");

  const simulateAgent = useCallback((userQuery: string) => {
    setQuery(userQuery);
    setAppState("thinking");
    setSteps([]);

    thoughtSteps.forEach((step, i) => {
      setTimeout(() => {
        setSteps((prev) => [
          ...prev.map((s) => ({ ...s, status: "done" as const })),
          { id: `step-${i}`, text: step.text, status: "thinking" as const, icon: step.icon },
        ]);
      }, i * 1200);
    });

    setTimeout(() => {
      setSteps((prev) => prev.map((s) => ({ ...s, status: "done" as const })));
      setTimeout(() => setAppState("results"), 500);
    }, thoughtSteps.length * 1200);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 gap-10 sm:gap-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center max-w-2xl"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
                  Looking for insurance?{" "}
                  <span className="gradient-text">Just ask.</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Compare insurance quotes in a single sentence — our AI agent
                  finds the best deal for you.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <Omnibar onSubmit={simulateAgent} isProcessing={false} />
              </motion.div>

              <StatsBar />
            </motion.div>
          )}

          {appState === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 gap-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary thinking-dot" />
                  </div>
                  Processing
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  "{query}"
                </p>
              </motion.div>

              <ThoughtLog steps={steps} />
            </motion.div>
          )}

          {appState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-savings animate-pulse" />
                  <span className="text-sm text-savings font-medium">
                    3 quotes ready
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  Recommended insurance for you
                </h2>
                <p className="text-muted-foreground">
                  "{query}"
                </p>

                <motion.button
                  onClick={() => {
                    setAppState("idle");
                    setQuery("");
                    setSteps([]);
                  }}
                  className="mt-4 text-sm text-primary hover:underline font-medium"
                  whileHover={{ x: -3 }}
                >
                  ← New search
                </motion.button>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  {mockRecommendations.map((rec, i) => (
                    <RecommendationCard key={rec.id} recommendation={rec} index={i} />
                  ))}
                </div>

                <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
                  <ComparisonChat
                    query={query}
                    recommendations={mockRecommendations.map((r) => ({
                      provider: r.provider,
                      monthlyPrice: r.monthlyPrice,
                      coverage: r.coverage,
                      reason: r.reason,
                      highlights: r.highlights,
                    }))}
                  />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-muted-foreground mt-10"
              >
                Quotes are for informational purposes only. Final pricing will be determined after detailed data verification.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {appState !== "results" && <AgentFAB />}
    </div>
  );
};

export default Index;
