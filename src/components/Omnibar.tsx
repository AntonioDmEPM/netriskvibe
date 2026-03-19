import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const suggestions = [
  "Car insurance for my 2023 Skoda Octavia",
  "Home insurance for an 85m² apartment in London",
  "Travel insurance for 2 weeks in Italy, 2 adults + 1 child",
  "Comprehensive coverage for my 2021 BMW X3",
];

interface OmnibarProps {
  onSubmit: (query: string) => void;
  isProcessing: boolean;
}

const Omnibar = ({ onSubmit, isProcessing }: OmnibarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (query.trim() && !isProcessing) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="omnibar-glow rounded-2xl bg-card border border-border overflow-hidden"
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <div className="mt-1">
            <motion.div
              animate={isProcessing ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Tell us what insurance you're looking for..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-base sm:text-lg leading-relaxed min-h-[28px] max-h-[120px]"
            rows={1}
            disabled={isProcessing}
          />
          <motion.button
            onClick={handleSubmit}
            disabled={!query.trim() || isProcessing}
            className="mt-0.5 p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {!isProcessing && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-4 justify-center"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                onClick={() => {
                  setQuery(s);
                  inputRef.current?.focus();
                }}
                className="px-3.5 py-2 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Omnibar;
