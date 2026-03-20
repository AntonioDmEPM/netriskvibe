import { useI18n } from "@/lib/i18n";
import { TrendingUp, FileText, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  optimizedCount: number;
  optimizedProgress: number;
}

const DashboardHeader = ({ optimizedCount, optimizedProgress }: DashboardHeaderProps) => {
  const { lang } = useI18n();
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const target = 187400;
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedSavings(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const from = animatedProgress;
    const to = optimizedProgress;
    const duration = 800;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedProgress(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [optimizedProgress]);

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const stats = [
    {
      color: "bg-primary/10 border-primary/20",
      textColor: "text-primary",
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      label: lang === "hu" ? "Éves megtakarítás" : "Annual savings",
      value: `${animatedSavings.toLocaleString("hu-HU")} Ft`,
      sub: lang === "hu" ? "↑ 23% vs. tavaly" : "↑ 23% vs. last year",
    },
    {
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      label: lang === "hu" ? "Aktív szerződések" : "Active contracts",
      value: "8",
      sub: null,
    },
    {
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
      icon: <CheckCircle className="w-5 h-5 text-orange-600" />,
      label: lang === "hu" ? "Optimalizálva" : "Optimized",
      value: `${optimizedCount}/8`,
      sub: null,
      progress: true,
    },
    {
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      label: lang === "hu" ? "Következő teendő" : "Next action",
      value: lang === "hu" ? "3 nap múlva" : "In 3 days",
      sub: null,
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          {lang === "hu" ? "Üdvözöljük, Anna! 👋" : "Welcome, Anna! 👋"}
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          {lang === "hu"
            ? "Az AI ügynöke folyamatosan figyeli a szerződéseit és keresi a jobb ajánlatokat."
            : "Your AI agent continuously monitors your contracts and looks for better deals."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${s.color} opacity-0`}
            style={{ animation: `fade-in-up 0.4s ease-out ${i * 100}ms forwards` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              {s.progress ? (
                <svg width="44" height="44" viewBox="0 0 44 44" className="-mr-1">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <circle
                    cx="22" cy="22" r="18" fill="none" stroke="hsl(24 95% 53%)" strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 22 22)"
                    style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                  <text x="22" y="26" textAnchor="middle" className="text-[10px] font-bold fill-orange-700">
                    {Math.round(animatedProgress)}%
                  </text>
                </svg>
              ) : (
                s.icon
              )}
            </div>
            <p className={`text-2xl font-bold ${s.textColor} tabular-nums`}>{s.value}</p>
            {s.sub && <p className="text-xs text-primary mt-1 font-medium">{s.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
