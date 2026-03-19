import { useState, useRef } from "react";
import { ArrowRight, Car, Home, Plane, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStartFlow: (flowId: string, initialMessage?: string) => void;
}

const chips = [
  { emoji: "🚗", label: "Kötelező biztosítás váltás", flowId: "returning" },
  { emoji: "🏠", label: "Lakásbiztosítás", flowId: "" },
  { emoji: "✈️", label: "Utasbiztosítás", flowId: "" },
];

const HeroSection = ({ onStartFlow }: HeroSectionProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onStartFlow("new", inputValue.trim());
    setInputValue("");
  };

  return (
    <section className="relative min-h-[70vh] flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-emerald-50/40" />

      <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side — 55% */}
          <div className="flex-1 lg:max-w-[55%]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
            >
              <span>✨</span>
              Új! AI tanácsadó
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-tight mb-5"
            >
              A biztosítási tanácsadója,
              <br />
              <span className="text-primary">aki sosem alszik</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
            >
              Nem kell kalkulátort kitöltenie. Mondja el, mire van szüksége, és a Netrisk AI megtalálja a legjobb ajánlatot — percek alatt, magyarul.
            </motion.p>

            {/* Hero input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hero-input-glow flex items-center gap-2 bg-background border-2 border-border rounded-2xl p-2 shadow-lg hover:border-primary/30 transition-colors max-w-xl"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Írja be a rendszámát, vagy mondja el, miben segíthetek..."
                className="flex-1 h-12 px-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />
              <button
                onClick={handleSend}
                className="shrink-0 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {chips.map((chip, i) => (
                <motion.button
                  key={chip.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.1 }}
                  onClick={() => {
                    if (chip.flowId) {
                      onStartFlow(chip.flowId);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-foreground text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-100"
                >
                  <span>{chip.emoji}</span>
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right side — illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex flex-1 items-center justify-center relative"
          >
            {/* Central circle */}
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>

              {/* Floating icons */}
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

              {/* Floating chat bubbles */}
              <div className="absolute -top-8 -left-8 animate-float-delay-2">
                <div className="bg-background rounded-2xl rounded-bl-md shadow-lg border border-border px-3 py-2 text-xs text-muted-foreground max-w-[120px]">
                  "Rendszámom: ABC-123"
                </div>
              </div>
              <div className="absolute -bottom-10 right-0 animate-float">
                <div className="bg-primary/10 rounded-2xl rounded-br-md shadow-sm px-3 py-2 text-xs text-primary font-medium max-w-[140px]">
                  "31 200 Ft/év — 15% olcsóbb!"
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
