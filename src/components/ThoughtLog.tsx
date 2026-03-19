import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Loader2, Search, BarChart3, Shield } from "lucide-react";

export interface ThoughtStep {
  id: string;
  text: string;
  status: "thinking" | "done";
  icon: "search" | "analyze" | "compare" | "verify";
}

const iconMap = {
  search: Search,
  analyze: BarChart3,
  compare: Brain,
  verify: Shield,
};

const ThoughtLog = ({ steps }: { steps: ThoughtStep[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-agent" />
        <span className="text-sm font-medium text-muted-foreground font-body">
          Az ügynök gondolkodik...
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {steps.map((step) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border"
              >
                <Icon className="w-4 h-4 text-agent shrink-0" />
                <span className="text-sm text-foreground font-body flex-1">
                  {step.text}
                </span>
                {step.status === "thinking" ? (
                  <Loader2 className="w-4 h-4 text-agent animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-savings shrink-0" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ThoughtLog;
