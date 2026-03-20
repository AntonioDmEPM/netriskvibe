import { cn } from "@/lib/utils";

export type DemoTab = "netrisk" | "dashboard" | "vision";

const tabs: { id: DemoTab; label: string }[] = [
  { id: "netrisk", label: "Netrisk.hu — Agentic Homepage" },
  { id: "dashboard", label: "Personal Finance Dashboard" },
  { id: "vision", label: "Vision & Architecture" },
];

interface TopNavBarProps {
  activeTab: DemoTab;
  onTabChange: (tab: DemoTab) => void;
}

const TopNavBar = ({ activeTab, onTabChange }: TopNavBarProps) => (
  <div
    className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4"
    style={{ height: 36, background: "#0F172A" }}
  >
    <span className="text-[12px] font-medium tracking-wide text-white/60 select-none">
      ◆ EPAM Applied AI
    </span>

    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <span className="text-[12px] text-white/40 select-none">
      Prototype Demo v1.0
    </span>
  </div>
);

export default TopNavBar;
