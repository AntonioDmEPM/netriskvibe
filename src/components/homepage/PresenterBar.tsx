import { RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PresenterBarProps {
  onStartFlow: (flowId: string) => void;
  onReset: () => void;
}

const PresenterBar = ({ onStartFlow, onReset }: PresenterBarProps) => {
  const { t } = useI18n();

  const flows = [
    { id: "returning", label: t("presenter.flow1"), color: "bg-blue-600 hover:bg-blue-700" },
    { id: "new", label: t("presenter.flow2"), color: "bg-emerald-600 hover:bg-emerald-700" },
    { id: "advisory", label: t("presenter.flow3"), color: "bg-purple-600 hover:bg-purple-700" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-10 bg-[#0f172a] flex items-center px-4 gap-4">
      <span className="text-xs font-bold text-white flex items-center gap-1.5 shrink-0">
        {t("presenter.label")}
      </span>

      <div className="flex-1 flex items-center justify-center gap-2">
        {flows.map((f) => (
          <button
            key={f.id}
            onClick={() => onStartFlow(f.id)}
            className={`${f.color} text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
};

export default PresenterBar;
