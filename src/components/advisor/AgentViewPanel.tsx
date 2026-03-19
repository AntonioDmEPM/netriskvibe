import { useEffect, useRef } from "react";
import { type AgentName, type AgentAction, getAgentColor } from "@/lib/agentEvents";
import { X } from "lucide-react";

interface AgentViewPanelProps {
  activeAgent: AgentName;
  profile: Record<string, string>;
  actions: AgentAction[];
  onClose: () => void;
}

const agents: AgentName[] = [
  'Conversation Agent',
  'Data Agent',
  'Comparison Agent',
  'Advisory Agent',
  'Lifecycle Agent',
];

const AgentViewPanel = ({ activeAgent, profile, actions, onClose }: AgentViewPanelProps) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [actions.length]);

  return (
    <aside className="w-[300px] shrink-0 h-full border-l border-border bg-card flex flex-col overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔍</span>
          <h3 className="text-sm font-bold text-foreground">Agent View</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Active Agents */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Agents
        </p>
        <div className="space-y-1">
          {agents.map((name) => (
            <div
              key={name}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                name === activeAgent ? 'bg-muted font-semibold text-foreground' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${name === activeAgent ? 'animate-pulse' : 'opacity-40'}`}
                style={{ backgroundColor: getAgentColor(name) }}
              />
              {name}
              {name === activeAgent && (
                <span className="ml-auto text-[10px] text-primary font-semibold">ACTIVE</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Profile */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Customer Profile
        </p>
        {Object.keys(profile).length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No data yet</p>
        ) : (
          <div className="space-y-1 font-mono text-[11px]">
            {Object.entries(profile).map(([key, val]) => (
              <div key={key} className="flex gap-1">
                <span className="text-muted-foreground shrink-0">{key}:</span>
                <span className="text-foreground font-medium break-all">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Log */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Action Log ({actions.length})
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          {actions.length === 0 ? (
            <p className="text-xs text-muted-foreground italic mt-1">Waiting for demo to start...</p>
          ) : (
            <div className="space-y-1.5 mt-1">
              {actions.map((action) => (
                <div key={action.id} className="flex gap-2 text-[11px] animate-fade-in">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: getAgentColor(action.agent) }}
                  />
                  <div>
                    <span className="font-semibold text-foreground">{action.agent}:</span>{' '}
                    <span className="text-muted-foreground">{action.text}</span>
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AgentViewPanel;
