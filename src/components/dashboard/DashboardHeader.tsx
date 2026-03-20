import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Wallet, Shield, CheckCircle, Handshake, Scissors } from "lucide-react";

interface DashboardHeaderProps {
  optimizedCount: number;
  optimizedProgress: number;
}

function useCountUp(target: number, duration: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

const fmt = (n: number) => n.toLocaleString("hu-HU");

const DashboardHeader = ({ optimizedCount, optimizedProgress }: DashboardHeaderProps) => {
  const { lang } = useI18n();
  const totalSavings = 187400;
  const customerShare = Math.round(totalSavings / 2);
  const serviceFee = totalSavings - customerShare;

  const animatedTotal = useCountUp(totalSavings, 2000);
  const animatedCustomer = useCountUp(customerShare, 2000);
  const animatedFee = useCountUp(serviceFee, 2000);

  return (
    <div className="mb-8">
      {/* Welcome */}
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

      {/* Savings Counter — hero card */}
      <div
        className="rounded-2xl p-6 sm:p-8 opacity-0"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          animation: "fade-in-up 0.5s ease-out 0.1s forwards",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 md:gap-8 items-center">
          {/* LEFT — 40% */}
          <div className="md:col-span-4 text-center md:text-left">
            <p className="text-sm font-medium text-gray-400 mb-2">
              {lang === "hu" ? "Az Ön megtakarításai idén" : "Your savings this year"}
            </p>
            <p className="text-4xl sm:text-5xl font-extrabold tabular-nums mb-1" style={{ color: "#00A651" }}>
              {fmt(animatedTotal)} Ft
            </p>
            <p className="text-sm text-gray-300">
              {lang === "hu" ? "megtakarítás összesen" : "total savings"}
            </p>
          </div>

          {/* CENTER — 30% */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,166,81,0.15)" }}>
                <Wallet className="w-4 h-4" style={{ color: "#00A651" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#00A651" }}>
                  {lang === "hu" ? "Ön tartja meg:" : "You keep:"} {fmt(animatedCustomer)} Ft
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-300">
                  {lang === "hu" ? "Szolgáltatási díj:" : "Service fee:"} {fmt(animatedFee)} Ft
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic leading-snug">
              {lang === "hu"
                ? "Teljesen ingyenes. Csak akkor fizetünk, ha Ön spórol."
                : "Completely free. You only pay when you save."}
            </p>
          </div>

          {/* RIGHT — 30% */}
          <div className="md:col-span-3 space-y-2.5">
            {[
              { icon: CheckCircle, text_hu: `${optimizedCount} szerződés optimalizálva`, text_en: `${optimizedCount} contracts optimized`, color: "#00A651" },
              { icon: Handshake, text_hu: "2 sikeres tárgyalás", text_en: "2 successful negotiations", color: "#00A651" },
              { icon: Scissors, text_hu: "3 felesleges előfizetés törölve", text_en: "3 unused subscriptions cancelled", color: "#00A651" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <stat.icon className="w-4 h-4 shrink-0" style={{ color: stat.color }} />
                <span className="text-sm text-gray-300">
                  {lang === "hu" ? stat.text_hu : stat.text_en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "Without Agent" comparison bar */}
      <div
        className="mt-3 rounded-xl border border-border bg-card px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 opacity-0"
        style={{ animation: "fade-in-up 0.4s ease-out 0.4s forwards" }}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{lang === "hu" ? "Ügynök nélkül:" : "Without agent:"}</span>
          <span className="line-through text-destructive/60 font-medium">0 Ft {lang === "hu" ? "megtakarítás" : "savings"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{lang === "hu" ? "Az ügynökkel:" : "With agent:"}</span>
          <span className="font-bold" style={{ color: "#00A651" }}>
            {fmt(customerShare)} Ft {lang === "hu" ? "a zsebében" : "in your pocket"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
