import { Bot, Headphones, Play, RotateCcw } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Msg {
  sender: "agent" | "vodafone";
  text: string;
  time: string;
}

const messages: Msg[] = [
  {
    sender: "agent", time: "14:32",
    text: "Good day! I'm calling on behalf of our client Anna Kovács, under power of attorney. Her current NetConnect 1000 plan is €20/month. We'd like your current loyalty offer, given that Telekom offers similar speeds for €14/month.",
  },
  {
    sender: "vodafone", time: "14:33",
    text: "One moment, let me check available offers... We can reduce the current plan to €16/month with a 12-month commitment.",
  },
  {
    sender: "agent", time: "14:34",
    text: "Thank you for the offer. For our client, Telekom's €14 offer remains more attractive. Is there room for further discount?",
  },
  {
    sender: "vodafone", time: "14:36",
    text: "Our best offer is €15/month with a 24-month commitment, and we'll upgrade speed to 1 Gbps free of charge.",
  },
  {
    sender: "agent", time: "14:37",
    text: "I accept this on behalf of our client. Please send the contract amendment confirmation by email. Thank you!",
  },
];

const NegotiationDemo = () => {
  const [replayMode, setReplayMode] = useState<"idle" | "playing" | "done">("idle");
  const [visibleCount, setVisibleCount] = useState(messages.length);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const startReplay = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setReplayMode("playing");
    setVisibleCount(0);
    messages.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === messages.length - 1) setReplayMode("done");
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
            AI Negotiation Engine — Demo
          </h3>
          <p className="text-xs text-secondary-foreground/70">
            The agent can negotiate with providers on your behalf — by phone, chat, or email.
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
              ▶ Replay
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
              Reset
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
                    {msg.sender === "agent" ? "Netrisk AI Agent" : "Vodafone Support"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
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
            ✅ Successful negotiation
          </span>
          <span className="text-xs text-muted-foreground">—</span>
          <span className="text-sm font-bold text-foreground">
            Monthly €20 → €15 (−25%)
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          The full negotiation recording and Letter of Authority are available in the client's profile.
        </p>
      </div>
    </div>
  );
};

export default NegotiationDemo;
