import { useState } from "react";

const FloatingAgentIndicator = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`flex items-center gap-2.5 rounded-full bg-card border border-border shadow-lg px-4 py-2.5 transition-all duration-300 cursor-default ${
          expanded ? "pr-5" : ""
        }`}
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">
          AI agent active
        </span>
      </div>

      <div
        className={`absolute bottom-full right-0 mb-2 w-72 rounded-xl bg-card border border-border shadow-xl p-4 transition-all duration-200 origin-bottom-right ${
          expanded
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-1 pointer-events-none"
        }`}
      >
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last check</span>
            <span className="font-medium text-foreground">2 hours ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next</span>
            <span className="font-medium text-foreground">In 4 hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monitoring</span>
            <span className="font-medium text-foreground">8 contracts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingAgentIndicator;
