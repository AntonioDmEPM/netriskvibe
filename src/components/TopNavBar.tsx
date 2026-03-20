import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
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

const TopNavBar = ({ activeTab, onTabChange }: TopNavBarProps) => {
  const { lang, setLang } = useI18n();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4"
      style={{ height: 36, background: "#0F172A" }}
    >
      <span className="text-[12px] font-medium tracking-wide text-white/60 select-none">
        ◆ EPAM Applied AI
      </span>

      <div className="flex items-center gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-3 py-1 text-[12px] font-medium transition-colors rounded-t-md",
              activeTab === tab.id
                ? "text-white font-bold"
                : "text-white/50 hover:text-white/80"
            )}
          >
            {tab.label}
            {/* Active indicator line */}
            {activeTab === tab.id && (
              <span
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                style={{ background: "hsl(153 100% 33%)" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-full bg-white/10 p-0.5">
          <button
            onClick={() => setLang("hu")}
            className={cn(
              "px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all",
              lang === "hu" ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            HU
          </button>
          <button
            onClick={() => setLang("en")}
            className={cn(
              "px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all",
              lang === "en" ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            EN
          </button>
        </div>
        <span className="text-[12px] text-white/40 select-none">
          Prototype Demo v1.0
        </span>
      </div>
    </div>
  );
};

export default TopNavBar;
