import { useState, useCallback, useRef, useEffect } from "react";
import { X, Send, ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage, { type Message, type MessagePart } from "@/components/advisor/ChatMessage";
import TypingIndicator from "@/components/advisor/TypingIndicator";
import ConfettiEffect from "@/components/advisor/ConfettiEffect";
import { getScenarioConfig, type ScenarioConfig } from "@/lib/scenarioContext";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import type { QuoteData } from "@/lib/mockData";

const SCROLL_THRESHOLD = 150;
let _id = 0;
function genId() { return `msg-${++_id}-${Date.now()}`; }

interface ConversationOverlayProps {
  flowId: string;
  initialMessage?: string;
  onClose: () => void;
  onTurnChange?: (turnIndex: number) => void;
}

/**
 * Call the AI edge function and return structured parts.
 */
async function callAI(
  conversationHistory: { role: string; content: string }[],
  scenarioContext: Record<string, any>,
  lang: string,
): Promise<{ parts: any[] }> {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages: conversationHistory, scenarioContext, lang },
  });

  if (error) {
    console.error("AI chat error:", error);
    const fallbackText = lang === "en"
      ? "I'm having trouble connecting right now. Let me try again..."
      : "Jelenleg kapcsolódási problémám van. Próbálom újra...";
    return { parts: [{ type: "text", content: fallbackText }] };
  }

  // The edge function now returns { parts: [...] }
  if (data?.parts) {
    return { parts: data.parts };
  }

  // Legacy fallback: { content: string }
  if (data?.content) {
    return { parts: [{ type: "text", content: data.content }] };
  }

  return { parts: [{ type: "text", content: "..." }] };
}

/**
 * Map AI response parts to MessageParts, resolving insurer names to full QuoteData.
 */
function mapResponseParts(rawParts: any[], allQuotes: QuoteData[]): MessagePart[] {
  return rawParts.map((part: any) => {
    if (part.type === "text") {
      return { type: "text" as const, content: part.content || "" };
    }

    if (part.type === "comparison" && part.insurers) {
      const quotes: QuoteData[] = part.insurers
        .map((ins: any) => {
          const found = allQuotes.find(q => q.insurerName === ins.name);
          if (!found) return null;
          return {
            ...found,
            badge: ins.badge_text
              ? { text: ins.badge_text, variant: ins.badge_variant || "recommended" }
              : undefined,
            assessment: ins.assessment || "",
          };
        })
        .filter(Boolean);

      if (quotes.length === 0) return null;
      return {
        type: "comparison" as const,
        quotes,
        recommended: part.recommended,
      };
    }

    if (part.type === "switching") {
      return {
        type: "switching" as const,
        from: part.from,
        to: part.to,
      };
    }

    if (part.type === "timeline") {
      return {
        type: "timeline" as const,
        currentStep: part.currentStep,
        steps: part.steps,
        footnote: part.footnote,
      };
    }

    if (part.type === "savings") {
      return {
        type: "savings" as const,
        oldPrice: part.oldPrice,
        newPrice: part.newPrice,
      };
    }

    return null;
  }).filter(Boolean) as MessagePart[];
}

const ConversationOverlay = ({ flowId, initialMessage, onClose, onTurnChange }: ConversationOverlayProps) => {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scenarioRef = useRef<ScenarioConfig | null>(null);
  const turnRef = useRef(0);
  const versionRef = useRef(0);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSendingRef = useRef(false);

  const [lastMsgId, setLastMsgId] = useState<string | null>(null);

  const checkNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMsg(false);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      isNearBottomRef.current = checkNearBottom();
      if (isNearBottomRef.current) setShowNewMsg(false);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [checkNearBottom]);

  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom();
    } else if (messages.length > 0 || isTyping) {
      setShowNewMsg(true);
    }
  }, [messages, isTyping, scrollToBottom]);

  /**
   * Send the current conversation to the AI and add the response as a message.
   */
  const sendToAI = useCallback(async (version: number) => {
    const scenario = scenarioRef.current;
    if (!scenario || isSendingRef.current) return;

    isSendingRef.current = true;
    setInputEnabled(false);
    setIsTyping(true);

    try {
      const response = await callAI(
        conversationRef.current,
        scenario.context,
        lang,
      );

      if (versionRef.current !== version) return;
      setIsTyping(false);

      const mappedParts = mapResponseParts(response.parts, scenario.quotes);

      if (mappedParts.length > 0) {
        const id = genId();
        setLastMsgId(id);
        setMessages((prev) => [...prev, { id, role: "agent", parts: mappedParts }]);

        // Add text content to conversation history for AI context
        const textContent = mappedParts
          .filter((p): p is MessagePart & { type: "text" } => p.type === "text")
          .map((p) => p.content)
          .join("\n");

        // Also note which components were shown
        const componentTypes = mappedParts
          .filter((p) => p.type !== "text")
          .map((p) => p.type);

        let historyEntry = textContent;
        if (componentTypes.length > 0) {
          const uiLabel = lang === "en" ? "Displayed UI elements" : "Megjelenített UI elemek";
          historyEntry += `\n[${uiLabel}: ${componentTypes.join(", ")}]`;
        }

        conversationRef.current.push({ role: "assistant", content: historyEntry });

        turnRef.current++;
        onTurnChange?.(turnRef.current);
      }
    } catch (err) {
      console.error("AI error:", err);
      setIsTyping(false);

      const fallbackText = lang === "en"
        ? "Let me help you with your insurance comparison."
        : "Segítek az összehasonlításban.";
      const id = genId();
      setLastMsgId(id);
      setMessages((prev) => [...prev, {
        id,
        role: "agent",
        parts: [{ type: "text", content: fallbackText }],
      }]);
    }

    isSendingRef.current = false;
    if (versionRef.current === version) setInputEnabled(true);
  }, [lang, onTurnChange]);

  /**
   * Handle user sending a text message.
   */
  const handleSend = useCallback((text: string) => {
    if (!scenarioRef.current || !text.trim() || isSendingRef.current) return;
    const id = genId();
    const trimmed = text.trim();
    setMessages((prev) => [...prev, { id, role: "user", parts: [{ type: "text", content: trimmed }] }]);
    conversationRef.current.push({ role: "user", content: trimmed });
    sendToAI(versionRef.current);
  }, [sendToAI]);

  /**
   * Handle user selecting a quote from the comparison panel.
   */
  const handleQuoteSelect = useCallback((insurerName: string) => {
    const id = genId();
    const msg = lang === "en" ? `I'll pick: ${insurerName}` : `Ezt választom: ${insurerName}`;
    setMessages((prev) => [...prev, { id, role: "user", parts: [{ type: "text", content: msg }] }]);
    conversationRef.current.push({ role: "user", content: msg });
    sendToAI(versionRef.current);
  }, [sendToAI, lang]);

  /**
   * Handle user confirming a switch.
   */
  const handleSwitchConfirm = useCallback(() => {
    // Show confetti immediately
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Send confirmation message to AI
    const id = genId();
    const msg = lang === "en" ? "Yes, let's do it!" : "Igen, megkezdjük a váltást!";
    setMessages((prev) => [...prev, { id, role: "user", parts: [{ type: "text", content: msg }] }]);
    conversationRef.current.push({ role: "user", content: msg });
    sendToAI(versionRef.current);
  }, [sendToAI, lang]);

  // Initialize conversation on mount (and when flowId/language changes)
  useEffect(() => {
    const version = ++versionRef.current;
    const scenario = getScenarioConfig(flowId, lang);
    scenarioRef.current = scenario;
    turnRef.current = 0;
    conversationRef.current = [];
    isSendingRef.current = false;
    setMessages([]);

    if (initialMessage) {
      // User provided an initial message (e.g. from omnibar)
      const id = genId();
      setMessages([{ id, role: "user", parts: [{ type: "text", content: initialMessage }] }]);
      conversationRef.current.push({ role: "user", content: initialMessage });
    } else {
      // Send a hidden trigger to get the AI to greet based on scenario context
      conversationRef.current.push({ role: "user", content: "[CONVERSATION_START]" });
    }

    sendToAI(version);
  }, [flowId, initialMessage, sendToAI, lang]);

  useEffect(() => {
    if (inputEnabled) inputRef.current?.focus();
  }, [inputEnabled]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 350);
  }, [onClose]);

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
            className={`relative w-full bg-background shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isFullscreen
                ? "h-full max-w-none rounded-none"
                : "sm:max-w-3xl h-[92vh] sm:h-[85vh] sm:rounded-2xl"
            }`}
          >
            {showConfetti && <ConfettiEffect />}

            <div className="h-14 bg-primary flex items-center px-4 shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xs font-bold">
                  N
                </div>
                <span className="font-bold text-primary-foreground text-sm">{t("overlay.title")}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-4">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-xs text-primary-foreground/80">{t("overlay.online")}</span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors hidden sm:flex"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-primary-foreground" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto relative" ref={scrollContainerRef}>
              <div className="sticky top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-[5] pointer-events-none" />
              <div className="max-w-2xl mx-auto px-4 pb-6 space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    animate={msg.id === lastMsgId}
                    onQuoteSelect={handleQuoteSelect}
                    onSwitchConfirm={handleSwitchConfirm}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {showNewMsg && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:opacity-90 transition-all animate-fade-in-up z-10"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  {t("overlay.newmsg")}
                </button>
              )}
            </div>

            <div className="border-t border-border bg-card px-4 py-3 shrink-0">
              <div className="max-w-2xl mx-auto flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (inputText.trim() && inputEnabled) {
                        handleSend(inputText);
                        setInputText("");
                      }
                    }
                  }}
                  placeholder={t("overlay.input")}
                  disabled={!inputEnabled}
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => {
                    if (inputText.trim() && inputEnabled) {
                      handleSend(inputText);
                      setInputText("");
                    }
                  }}
                  disabled={!inputText.trim() || !inputEnabled}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground/50 mt-2">{t("overlay.powered")}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConversationOverlay;
