import { useState, useRef, useEffect } from "react";
import { ArrowRight, Car, Home, Plane, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface HeroSectionProps {
  onStartFlow: (flowId: string, initialMessage?: string) => void;
  isReturning?: boolean;
}

const HeroSection = ({ onStartFlow, isReturning }: HeroSectionProps) => {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [returningInput, setReturningInput] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholders = [
    t("hero.placeholder.0"),
    t("hero.placeholder.1"),
    t("hero.placeholder.2"),
    t("hero.placeholder.3"),
    t("hero.placeholder.4"),
  ];

  const chips = [
    { emoji: "\u{1F697}", label: t("hero.chip.kgfb"), flowId: "returning" },
    { emoji: "\u{1F3E0}", label: t("hero.chip.home"), flowId: "" },
    { emoji: "\u2708\uFE0F", label: t("hero.chip.travel"), flowId: "" },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setPlaceholderIdx((prev) => (prev + 1) % 5);
      }, 3000);
    }, 1500);
    return () => { clearTimeout(timeout); if (interval) clearInterval(interval); };
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onStartFlow("new", inputValue.trim());
    setInputValue("");
  };

  const handleReturningSend = () => {
    if (!returningInput.trim()) return;
    onStartFlow("returning", returningInput.trim());
    setReturningInput("");
  };

  return (
    <section className="relative min-h-[70vh] flex items-center pt-[6.5rem] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-emerald-50/40" />

      <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-20">
        <AnimatePresence mode="wait">
          {!isReturning ? (
            <motion.div
              key="new"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
            >
              <div className="flex-1 lg:max-w-[55%]">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
                >
                  <span>✨</span>
                  {t("hero.badge")}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-tight mb-5"
                >
                  {t("hero.title1")}
                  <br />
                  <span className="text-primary">{t("hero.title2")}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
                >
                  {t("hero.subtitle")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hero-input-glow flex items-center gap-2 bg-background border-2 border-border rounded-2xl p-2 shadow-lg hover:border-primary/30 transition-colors max-w-xl"
                >
                  <div className="relative flex-1 h-12">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                      className="absolute inset-0 w-full h-full px-4 bg-transparent text-foreground outline-none text-base z-10"
                    />
                    {!inputValue && (
                      <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={placeholderIdx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3 }}
                            className="text-muted-foreground text-base"
                          >
                            {placeholders[placeholderIdx]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSend}
                    className="shrink-0 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {chips.map((chip, i) => (
                    <motion.button
                      key={chip.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.1 }}
                      onClick={() => { if (chip.flowId) onStartFlow(chip.flowId); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-foreground text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-100"
                    >
                      <span>{chip.emoji}</span>
                      {chip.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden lg:flex flex-1 items-center justify-center relative"
              >
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Shield className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="absolute -top-4 right-8 animate-float">
                    <div className="w-14 h-14 rounded-2xl bg-background shadow-lg border border-border flex items-center justify-center">
                      <Car className="w-7 h-7 text-blue-500" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -left-4 animate-float-delay-1">
                    <div className="w-14 h-14 rounded-2xl bg-background shadow-lg border border-border flex items-center justify-center">
                      <Home className="w-7 h-7 text-orange-500" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 -right-10 animate-float-delay-2">
                    <div className="w-14 h-14 rounded-2xl bg-background shadow-lg border border-border flex items-center justify-center">
                      <Plane className="w-7 h-7 text-teal-500" />
                    </div>
                  </div>
                  <div className="absolute -top-8 -left-8 animate-float-delay-2">
                    <div className="bg-background rounded-2xl rounded-bl-md shadow-lg border border-border px-3 py-2 text-xs text-muted-foreground max-w-[120px]">
                      {t("hero.bubble.plate")}
                    </div>
                  </div>
                  <div className="absolute -bottom-10 right-0 animate-float">
                    <div className="bg-primary/10 rounded-2xl rounded-br-md shadow-sm px-3 py-2 text-xs text-primary font-medium max-w-[140px]">
                      {t("hero.bubble.savings")}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="returning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
              >
                <span>👋</span>
                {t("hero.returning.badge")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-tight mb-5"
              >
                {t("hero.returning.title")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl"
              >
                {t("hero.returning.subtitle.pre")}<span className="text-primary font-semibold">{t("hero.returning.subtitle.savings")}</span>
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => onStartFlow("returning")}
                className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-lg font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center gap-2 mb-4"
              >
                {t("hero.returning.cta")}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col items-center gap-2 mt-2 w-full max-w-md"
              >
                <p className="text-sm text-muted-foreground">{t("hero.returning.or")}</p>
                <div className="flex items-center gap-2 w-full bg-background border border-border rounded-xl p-1.5 shadow-sm">
                  <input
                    type="text"
                    value={returningInput}
                    onChange={(e) => setReturningInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleReturningSend(); }}
                    placeholder={t("hero.returning.placeholder")}
                    className="flex-1 h-9 px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button
                    onClick={handleReturningSend}
                    className="shrink-0 w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => onStartFlow("returning")}
                className="mt-10 w-full max-w-3xl bg-card border border-border rounded-2xl shadow-lg p-5 sm:p-6 cursor-pointer hover:shadow-xl hover:border-primary/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
                  <div className="flex-1 text-left">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t("dashboard.kgfb")}</p>
                    <p className="text-lg font-bold text-foreground">KÖBE</p>
                    <p className="text-sm text-muted-foreground">38 000 Ft/év</p>
                    <span className="inline-block mt-2 text-xs font-semibold bg-destructive/10 text-destructive px-2.5 py-1 rounded-full">
                      {t("dashboard.expires")}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <div className="w-px h-full bg-border" />
                    <ArrowRight className="w-5 h-5 text-primary mx-3 shrink-0" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="sm:hidden flex justify-center">
                    <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t("dashboard.recommended")}</p>
                    <p className="text-lg font-bold text-foreground">Groupama</p>
                    <p className="text-sm text-primary font-semibold">33 500 Ft/év</p>
                    <span className="inline-block mt-2 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {t("dashboard.savings")}
                    </span>
                  </div>
                  <div className="flex items-center sm:pl-2">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                      {t("dashboard.switch")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
