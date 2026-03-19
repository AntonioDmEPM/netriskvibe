import { type AgentName, getAgentColor } from "@/lib/agentEvents";

const agents: { name: AgentName; emoji: string }[] = [
  { name: "Conversation Agent", emoji: "🟢" },
  { name: "Data Agent", emoji: "🔵" },
  { name: "Comparison Agent", emoji: "🟡" },
  { name: "Advisory Agent", emoji: "🟣" },
  { name: "Lifecycle Agent", emoji: "🔴" },
];

interface AgentPanelProps {
  activeAgent: AgentName | null;
}

const AgentPanel = ({ activeAgent }: AgentPanelProps) => (
  <div className="fixed bottom-6 left-6 z-[70] w-56 bg-[#0f172a] rounded-xl shadow-2xl border border-white/10 overflow-hidden">
    <div className="px-3 py-2 border-b border-white/10">
      <h4 className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
        Agent Architecture
      </h4>
    </div>
    <div className="px-3 py-2 space-y-1">
      {agents.map(({ name, emoji }) => {
        const isActive = activeAgent === name;
        return (
          <div
            key={name}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all duration-300 ${
              isActive ? "bg-white/10 text-white font-semibold" : "text-white/40"
            }`}
          >
            <div className="relative flex items-center justify-center w-4 h-4">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive ? "scale-100" : "scale-75 opacity-40"
                }`}
                style={{ backgroundColor: getAgentColor(name) }}
              />
              {isActive && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: getAgentColor(name) }}
                />
              )}
            </div>
            <span>{name}</span>
            {isActive && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider" style={{ color: getAgentColor(name) }}>
                Active
              </span>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default AgentPanel;
