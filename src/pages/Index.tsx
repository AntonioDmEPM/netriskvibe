import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Omnibar from "@/components/Omnibar";
import ThoughtLog, { ThoughtStep } from "@/components/ThoughtLog";
import RecommendationCard, { Recommendation } from "@/components/RecommendationCard";
import AgentFAB from "@/components/AgentFAB";
import StatsBar from "@/components/StatsBar";

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    provider: "Allianz Hungária",
    monthlyPrice: "12 450 Ft",
    yearlyPrice: "149 400 Ft",
    savings: "28 600 Ft/év",
    badge: "Legjobb ajánlat",
    badgeType: "best",
    reason: "Az Ön 2022-es BMW-jéhez és 30 éves korosztályához ez az optimális ár-érték arány. A balesetbiztosítás és az assistance csomag itt a legerősebb.",
    highlights: [
      "0 Ft önrész üvegkár esetén",
      "24 órás assistance szolgáltatás",
      "Bérautó biztosítás 5 napig",
      "Kiegészítő baleset-biztosítás sofőrnek",
    ],
    rating: 5,
    coverage: "Teljes körű KGFB + kiegészítők",
  },
  {
    id: "2",
    provider: "Generali Biztosító",
    monthlyPrice: "10 890 Ft",
    yearlyPrice: "130 680 Ft",
    savings: "47 320 Ft/év",
    badge: "Legolcsóbb",
    badgeType: "cheapest",
    reason: "Ha az ár a legfontosabb szempont, ez a legjobb választás. Budapesti ingázáshoz elegendő fedezetet nyújt alapcsomag mellett.",
    highlights: [
      "Alap assistance csomag",
      "Online kárbejelentés",
      "Havi díjfizetés felár nélkül",
    ],
    rating: 4,
    coverage: "Alap KGFB csomag",
  },
  {
    id: "3",
    provider: "Magyar Posta Biztosító",
    monthlyPrice: "11 200 Ft",
    yearlyPrice: "134 400 Ft",
    badge: "Népszerű választás",
    badgeType: "popular",
    reason: "A legtöbb hasonló profilú ügyfél ezt választotta. Kiegyensúlyozott csomag jó ügyfélszolgálattal és gyors kárrendezéssel.",
    highlights: [
      "Gyors kárrendezés (átlag 5 munkanap)",
      "Prémium ügyfélszolgálat",
      "Kiegészítő jogvédelem",
      "Partner szerviz hálózat országszerte",
    ],
    rating: 4,
    coverage: "Prémium KGFB csomag",
  },
];

const thoughtSteps: { text: string; icon: ThoughtStep["icon"] }[] = [
  { text: "Jármű adatok lekérdezése (2022 BMW)...", icon: "search" },
  { text: "12 biztosító ajánlatainak elemzése...", icon: "analyze" },
  { text: "Ár-érték arány összehasonlítás az Ön profiljára...", icon: "compare" },
  { text: "Fedezeti feltételek ellenőrzése...", icon: "verify" },
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
              {/* Hero text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center max-w-2xl"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-4">
                  Biztosítás,{" "}
                  <span className="gradient-text">intelligensen</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-body leading-relaxed">
                  Mondja el természetes nyelven, mire van szüksége — az AI ügynökünk
                  megtalálja a legjobb ajánlatot Önnek.
                </p>
              </motion.div>

              {/* Omnibar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <Omnibar onSubmit={simulateAgent} isProcessing={false} />
              </motion.div>

              {/* Stats */}
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agent/10 text-agent text-sm font-medium font-body mb-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-agent thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-agent thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-agent thinking-dot" />
                  </div>
                  Feldolgozás alatt
                </div>
                <p className="text-sm text-muted-foreground font-body max-w-md">
                  „{query}"
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
              className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20"
            >
              {/* Results header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-savings animate-pulse" />
                  <span className="text-sm text-savings font-medium font-body">
                    3 ajánlat készen áll
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
                  Az Önnek ajánlott biztosítások
                </h2>
                <p className="text-muted-foreground font-body">
                  „{query}"
                </p>

                <motion.button
                  onClick={() => {
                    setAppState("idle");
                    setQuery("");
                    setSteps([]);
                  }}
                  className="mt-4 text-sm text-agent hover:underline font-body"
                  whileHover={{ x: -3 }}
                >
                  ← Új keresés
                </motion.button>
              </motion.div>

              {/* Recommendation cards */}
              <div className="space-y-4">
                {mockRecommendations.map((rec, i) => (
                  <RecommendationCard key={rec.id} recommendation={rec} index={i} />
                ))}
              </div>

              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-muted-foreground font-body mt-10"
              >
                Az ajánlatok tájékoztató jellegűek. A végleges díj a részletes adategyeztetés után kerül meghatározásra.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AgentFAB />
    </div>
  );
};

export default Index;
