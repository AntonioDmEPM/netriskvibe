import { useI18n } from "@/lib/i18n";
import { X, Bot, Headphones, Monitor, Play, RotateCcw } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { type ActivityConversation } from "./activityConversations";

interface ActivityDetailPopupProps {
  conversation: ActivityConversation;
  onClose: () => void;
}

const senderIcon = (sender: string) => {
  if (sender === "agent") return <Bot className="w-4 h-4 text-primary" />;
  if (sender === "provider") return <Headphones className="w-4 h-4 text-red-600" />;
  return <Monitor className="w-4 h-4 text-blue-600" />;
};

const senderBg = (sender: string) => {
  if (sender === "agent") return "bg-primary/10";
  if (sender === "provider") return "bg-red-100";
  return "bg-blue-100";
};

const bubbleBg = (sender: string) => {
  if (sender === "agent") return "bg-muted text-foreground";
  if (sender === "provider") return "bg-red-50 text-foreground border border-red-100";
  return "bg-blue-50 text-foreground border border-blue-100";
};

const ActivityDetailPopup = ({ conversation, onClose }: ActivityDetailPopupProps) => {
  const { lang } = useI18n();
  const [replayMode, setReplayMode] = useState<"idle" | "playing" | "done">("idle");
  const [visibleCount, setVisibleCount] = useState(conversation.messages.length);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Auto-scroll during replay
  useEffect(() => {
    if (replayMode === "playing" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount, replayMode]);

  const startReplay = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setReplayMode("playing");
    setVisibleCount(0);
    conversation.messages.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === conversation.messages.length - 1) setReplayMode("done");
      }, 1500 * (i + 1));
      timeoutRefs.current.push(t);
    });
  }, [conversation.messages]);

  const resetReplay = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setReplayMode("idle");
    setVisibleCount(conversation.messages.length);
  }, [conversation.messages.length]);

  // Cleanup on unmount
  useEffect(() => () => timeoutRefs.current.forEach(clearTimeout), []);

  const showAll = replayMode === "idle";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Popup */}
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[560px] sm:max-h-[80vh] z-50 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-right sm:animate-none"
        style={{ animation: "fade-in-up 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="bg-secondary px-5 py-4 flex items-center gap-3 shrink-0">
          <div className={`w-9 h-9 rounded-full ${conversation.providerColor} flex items-center justify-center text-white text-sm font-bold`}>
            {conversation.provider[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">
              {lang === "hu" ? conversation.title_hu : conversation.title_en}
            </h3>
            <p className="text-xs text-secondary-foreground/70 truncate">
              {lang === "hu" ? conversation.outcome_hu : conversation.outcome_en}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {replayMode === "idle" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                onClick={startReplay}
              >
                <Play className="w-3 h-3 mr-1" />
                {lang === "hu" ? "Visszajátszás" : "Replay"}
              </Button>
            )}
            {(replayMode === "playing" || replayMode === "done") && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                onClick={resetReplay}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {lang === "hu" ? "Visszaállítás" : "Reset"}
              </Button>
            )}
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {conversation.messages.map((msg, i) => {
            if (!showAll && i >= visibleCount) return null;
            return (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === "provider" ? "justify-end" : ""}`}
                style={{
                  animation: showAll
                    ? `fade-in-up 0.3s ease-out ${i * 80}ms forwards`
                    : "fade-in-up 0.4s ease-out forwards",
                  opacity: 0,
                }}
              >
                {msg.sender !== "provider" && (
                  <div className={`w-7 h-7 rounded-full ${senderBg(msg.sender)} flex items-center justify-center shrink-0`}>
                    {senderIcon(msg.sender)}
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${bubbleBg(msg.sender)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {lang === "hu" ? msg.senderLabel_hu : msg.senderLabel_en}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{lang === "hu" ? msg.text_hu : msg.text_en}</p>
                </div>
                {msg.sender === "provider" && (
                  <div className={`w-7 h-7 rounded-full ${senderBg(msg.sender)} flex items-center justify-center shrink-0`}>
                    {senderIcon(msg.sender)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator during replay */}
          {replayMode === "playing" && visibleCount < conversation.messages.length && (
            <div className="flex gap-2 items-center pl-9">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 typing-dot-seq" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 typing-dot-seq" style={{ animationDelay: "200ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 typing-dot-seq" style={{ animationDelay: "400ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Result footer */}
        <div className="border-t border-border p-4 bg-primary/5 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary">
              ✅ {lang === "hu" ? conversation.outcome_hu : conversation.outcome_en}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {lang === "hu" ? conversation.result_hu : conversation.result_en}
          </p>
        </div>
      </div>
    </>
  );
};

export default ActivityDetailPopup;
