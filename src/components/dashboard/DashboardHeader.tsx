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

const fmt = (n: number) => `€${n.toLocaleString("en-US")}`;

const DashboardHeader = ({ optimizedCount }: DashboardHeaderProps) => {
  const totalSavings = 469;
  const customerShare = Math.round(totalSavings / 2);
  const serviceFee = totalSavings - customerShare;

  const animatedTotal = useCountUp(totalSavings, 2000);
  const animatedCustomer = useCountUp(customerShare, 2000);
  const animatedFee = useCountUp(serviceFee, 2000);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, Anna! 👋
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Your AI agent continuously monitors your contracts and looks for better deals.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 sm:p-8 opacity-0"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          animation: "fade-in-up 0.5s ease-out 0.1s forwards",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 md:gap-8 items-center">
          <div className="md:col-span-4 text-center md:text-left">
            <p className="text-sm font-medium text-gray-400 mb-2">
              Your savings this year
            </p>
            <p className="text-4xl sm:text-5xl font-extrabold tabular-nums mb-1" style={{ color: "#00A651" }}>
              {fmt(animatedTotal)}
            </p>
            <p className="text-sm text-gray-300">total savings</p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,166,81,0.15)" }}>
                <Wallet className="w-4 h-4" style={{ color: "#00A651" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#00A651" }}>
                  You keep: {fmt(animatedCustomer)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-300">
                  Service fee: {fmt(animatedFee)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic leading-snug">
              Completely free. You only pay when you save.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            {[
              { icon: CheckCircle, text: `${optimizedCount} contracts optimized`, color: "#00A651" },
              { icon: Handshake, text: "2 successful negotiations", color: "#00A651" },
              { icon: Scissors, text: "3 unused subscriptions cancelled", color: "#00A651" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <stat.icon className="w-4 h-4 shrink-0" style={{ color: stat.color }} />
                <span className="text-sm text-gray-300">{stat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-3 rounded-xl border border-border bg-card px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 opacity-0"
        style={{ animation: "fade-in-up 0.4s ease-out 0.4s forwards" }}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Without agent:</span>
          <span className="line-through text-destructive/60 font-medium">€0 savings</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">With agent:</span>
          <span className="font-bold" style={{ color: "#00A651" }}>
            {fmt(customerShare)} in your pocket
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
