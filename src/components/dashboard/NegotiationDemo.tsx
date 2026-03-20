import { useI18n } from "@/lib/i18n";
import { Bot, Headphones, Play, RotateCcw } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Msg {
  sender: "agent" | "vodafone";
  text_hu: string;
  text_en: string;
  time: string;
}

const messages: Msg[] = [
  {
    sender: "agent", time: "14:32",
    text_hu: "Jó napot! Kovács Anna ügyfelünk nevében hívom, meghatalmazás alapján. A jelenlegi NetConnect 1000 csomagja havi 7 990 Ft. Szeretnénk az aktuális hűségajánlatukat kérni, tekintettel arra, hogy a Telekom hasonló sebességet havi 5 490 Ft-ért kínálja.",
    text_en: "Good day! I'm calling on behalf of our client Anna Kovács, under power of attorney. Her current NetConnect 1000 plan is 7,990 HUF/month. We'd like your current loyalty offer, given that Telekom offers similar speeds for 5,490 HUF/month.",
  },
  {
    sender: "vodafone", time: "14:33",
    text_hu: "Egy pillanat, megnézem az elérhető ajánlatainkat... A jelenlegi csomagját tudjuk havi 6 490 Ft-ra csökkenteni 12 hónapos hűségvállalással.",
    text_en: "One moment, let me check available offers... We can reduce the current plan to 6,490 HUF/month with a 12-month commitment.",
  },
  {
    sender: "agent", time: "14:34",
    text_hu: "Köszönöm az ajánlatot. Az ügyfelünk számára a Telekom 5 490 Ft-os ajánlata továbbra is kedvezőbb. Van lehetőség további kedvezményre?",
    text_en: "Thank you for the offer. For our client, Telekom's 5,490 HUF offer remains more attractive. Is there room for further discount?",
  },
  {
    sender: "vodafone", time: "14:36",
    text_hu: "A legjobb ajánlatunk havi 5 990 Ft, 24 hónapos hűségvállalással, és a sebességet 1 Gbps-re emeljük díjmentesen.",
    text_en: "Our best offer is 5,990 HUF/month with a 24-month commitment, and we'll upgrade speed to 1 Gbps free of charge.",
  },
  {
    sender: "agent", time: "14:37",
    text_hu: "Ezt elfogadom az ügyfelünk nevében. Kérem a szerződésmódosítás visszaigazolását emailben. Köszönöm!",
    text_en: "I accept this on behalf of our client. Please send the contract amendment confirmation by email. Thank you!",
  },
];

const NegotiationDemo = () => {
  const { lang } = useI18n();
  const [replayMode, setReplayMode] = useState<"idle" | "playing" | "done">("idle");
  const [visibleCount, setVisibleCount] = useState(messages.length);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const startReplay = useCallback(() => {
    // Clear previous timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setReplayMode("playing");
    setVisibleCount(0);

    messages.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === messages.length - 1) {
          setReplayMode("done");
        }
      }, 1500 * (i + 1));
      timeoutRefs.current.push(t);
    });
  }, []);

  const resetReplay = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setReplayMode("idle");
    setVisibleCount(messages.length);
  }, []);

  const showAll = replayMode === "idle";

  return (
    <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden">
      <div className="bg-secondary px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white">
            {lang === "hu" ? "AI Tárgyalási Motor — Demo" : "AI Negotiation Engine — Demo"}
          </h3>
          <p className="text-xs text-secondary-foreground/70">
            {lang === "hu"
              ? "Az ügynök képes az Ön nevében tárgyalni a szolgáltatókkal — telefonon, chaten vagy emailben."
              : "The agent can negotiate with providers on your behalf — by phone, chat, or email."}
          </p>
        </div>
        <div>
          {replayMode === "idle" && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              onClick={startReplay}
            >
              <Play className="w-3 h-3 mr-1" />
              {lang === "hu" ? "▶ Visszajátszás" : "▶ Replay"}
            </Button>
          )}
          {(replayMode === "playing" || replayMode === "done") && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              onClick={resetReplay}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              {lang === "hu" ? "Visszaállítás" : "Reset"}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
        {messages.map((msg, i) => {
          if (!showAll && i >= visibleCount) return null;

          return (
            <div
              key={i}
              className={`flex gap-2 ${msg.sender === "agent" ? "" : "justify-end"}`}
              style={{
                animation: showAll
                  ? `fade-in-up 0.4s ease-out ${i * 120}ms forwards`
                  : "fade-in-up 0.5s ease-out forwards",
                opacity: 0,
              }}
            >
              {msg.sender === "agent" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  msg.sender === "agent"
                    ? "bg-muted text-foreground"
                    : "bg-red-50 text-foreground border border-red-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {msg.sender === "agent"
                      ? "Netrisk AI Agent"
                      : lang === "hu"
                        ? "Vodafone Ügyfélszolgálat"
                        : "Vodafone Support"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm leading-relaxed">{lang === "hu" ? msg.text_hu : msg.text_en}</p>
              </div>
              {msg.sender === "vodafone" && (
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
          );
        })}

        {replayMode === "playing" && visibleCount < messages.length && (
          <div className="flex gap-2 items-center pl-10">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 typing-dot-seq" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 typing-dot-seq" style={{ animationDelay: "200ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 typing-dot-seq" style={{ animationDelay: "400ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-primary">
            ✅ {lang === "hu" ? "Sikeres tárgyalás" : "Successful negotiation"}
          </span>
          <span className="text-xs text-muted-foreground">—</span>
          <span className="text-sm font-bold text-foreground">
            {lang === "hu"
              ? "Havi 7 990 Ft → 5 990 Ft (−25%)"
              : "Monthly 7,990 → 5,990 HUF (−25%)"}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {lang === "hu"
            ? "A tárgyalás teljes hangfelvétele és a meghatalmazás (Letter of Authority) az ügyfél profiljában elérhető."
            : "The full negotiation recording and Letter of Authority are available in the client's profile."}
        </p>
      </div>
    </div>
  );
};

export default NegotiationDemo;
