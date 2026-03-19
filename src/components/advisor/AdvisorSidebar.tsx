import { MessageSquarePlus, Play, RotateCcw } from "lucide-react";

interface AdvisorSidebarProps {
  onNewConversation: () => void;
  onStartDemo: (id: string) => void;
  activeDemo: string | null;
}

const demos = [
  { id: 'returning', label: 'Demo: Returning Customer', icon: RotateCcw },
  { id: 'new', label: 'Demo: New Customer', icon: Play },
  { id: 'advisory', label: 'Demo: Advisory', icon: MessageSquarePlus },
];

const AdvisorSidebar = ({ onNewConversation, onStartDemo, activeDemo }: AdvisorSidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-secondary text-secondary-foreground">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            n
          </div>
          <span className="font-bold text-base text-secondary-foreground">netrisk.hu</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      <div className="px-4 pt-4">
        <p className="text-xs text-secondary-foreground/50 uppercase tracking-wider font-medium mb-2 px-1">
          Demo Scenarios
        </p>
        <div className="space-y-1">
          {demos.map((d) => (
            <button
              key={d.id}
              onClick={() => onStartDemo(d.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                activeDemo === d.id
                  ? 'bg-sidebar-accent text-secondary-foreground'
                  : 'text-secondary-foreground/70 hover:bg-sidebar-accent/50 hover:text-secondary-foreground'
              }`}
            >
              <d.icon className="w-4 h-4 shrink-0" />
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] text-secondary-foreground/40 leading-relaxed">
          Prototype — Agentic Transformation Demo
        </p>
      </div>
    </div>
  );
};

export default AdvisorSidebar;
