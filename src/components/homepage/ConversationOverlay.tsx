import { useState, useCallback, useRef, useEffect } from "react";
import { X, Send, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage, { type Message, type MessagePart } from "@/components/advisor/ChatMessage";
import TypingIndicator from "@/components/advisor/TypingIndicator";
import ConfettiEffect from "@/components/advisor/ConfettiEffect";
import { genId } from "@/lib/flows";
import VoiceButton from "@/components/advisor/VoiceButton";
import { getScenarioConfig, type ScenarioConfig } from "@/lib/scenarioContext";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SCROLL_THRESHOLD = 150;

interface ConversationOverlayProps {
  flowId: string;
  initialMessage?: string;
  onClose: () => void;
  onTurnChange?: (turnIndex: number) => void;
}

async function callAI(
  conversationHistory: { role: string; content: string }[],
  scenarioContext: Record<string, any>,
  stageHint: string,
  lang: string,
): Promise<string> {
  const messages = [
    ...conversationHistory,
    { role: "user", content: `[STAGE HINT — not a user message, this is internal context]: ${stageHint}` },
  ];

  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages, scenarioContext, lang },
  });

  if (error) {
    console.error("AI chat error:", error);
    return lang === "en"
      ? "I'm having trouble connecting right now. Let me try again..."
      : "Jelenleg kapcsolódási problémám van. Próbálom újra...";
  }

  return data?.content ?? "...";
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

  const scenarioRef = useRef<ScenarioConfig | null>(null);
  const stageRef = useRef(0);
  const versionRef = useRef(0);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const processStage = useCallback(async (stageIndex: number, version: number) => {
    const scenario = scenarioRef.current;
    if (!scenario || stageIndex >= scenario.stages.length) return;

    const stage = scenario.stages[stageIndex];
    setInputEnabled(false);
    setIsTyping(true);

    try {
      // Generate AI text for this stage
      let aiText = "";
      if (stage.aiGenerate) {
        aiText = await callAI(
          conversationRef.current,
          scenario.context,
          stage.aiHint,
          lang,
        );
      }

      if (versionRef.current !== version) return;
      setIsTyping(false);

      // Build message parts: structured elements first, then AI text
      const parts: MessagePart[] = [];

      if (stage.structuredParts) {
        for (const sp of stage.structuredParts) {
          parts.push(sp as MessagePart);
        }
      }

      if (aiText) {
        parts.push({ type: "text", content: aiText });
      }

      if (parts.length > 0) {
        const id = genId();
        setLastMsgId(id);
        setMessages((prev) => [...prev, { id, role: "agent", parts }]);
        conversationRef.current.push({ role: "assistant", content: aiText });
      }
    } catch (err) {
      console.error("Stage processing error:", err);
      setIsTyping(false);

      // Fallback text
      const fallbackText = lang === "en"
        ? "Let me help you with your insurance comparison."
        : "Segítek az összehasonlításban.";
      const parts: MessagePart[] = [];
      if (stage.structuredParts) {
        for (const sp of stage.structuredParts) {
          parts.push(sp as MessagePart);
        }
      }
      parts.push({ type: "text", content: fallbackText });
      const id = genId();
      setLastMsgId(id);
      setMessages((prev) => [...prev, { id, role: "agent", parts }]);
    }

    if (versionRef.current === version) setInputEnabled(true);
  }, [lang]);

  const advanceStage = useCallback(() => {
    const scenario = scenarioRef.current;
    if (!scenario) return;
    const next = stageRef.current + 1;
    if (next >= scenario.stages.length) return;
    stageRef.current = next;
    onTurnChange?.(next);
    processStage(next, versionRef.current);
  }, [processStage, onTurnChange]);

  const handleSend = useCallback((text: string) => {
    if (!scenarioRef.current || !text.trim()) return;
    const id = genId();
    setMessages((prev) => [...prev, { id, role: "user", parts: [{ type: "text", content: text.trim() }] }]);
    conversationRef.current.push({ role: "user", content: text.trim() });
    advanceStage();
  }, [advanceStage]);

  const handleQuoteSelect = useCallback((insurerName: string) => {
    const id = genId();
    const msg = lang === "en" ? `I'll pick: ${insurerName}` : `Ezt választom: ${insurerName}`;
    setMessages((prev) => [...prev, { id, role: "user", parts: [{ type: "text", content: msg }] }]);
    conversationRef.current.push({ role: "user", content: msg });
    advanceStage();
  }, [advanceStage, lang]);

  const handleSwitchConfirm = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const version = versionRef.current;
    setTimeout(() => {
      if (versionRef.current !== version) return;
      const id = genId();
      setLastMsgId(id);
      setMessages((prev) => [...prev, {
        id,
        role: "agent",
        parts: [{ type: "text", content: t("switch.thankyou") }],
      }]);
    }, 1500);

    advanceStage();
  }, [advanceStage, t]);

  // Start scenario on mount (and when language changes)
  useEffect(() => {
    const version = ++versionRef.current;
    const scenario = getScenarioConfig(flowId, lang);
    scenarioRef.current = scenario;
    stageRef.current = 0;
    conversationRef.current = [];
    setMessages([]);

    if (initialMessage && scenario.stages.length > 1) {
      const id = genId();
      setMessages([{ id, role: "user", parts: [{ type: "text", content: initialMessage }] }]);
      conversationRef.current.push({ role: "user", content: initialMessage });
      stageRef.current = 1;
      processStage(1, version);
    } else {
      processStage(0, version);
    }
  }, [flowId, initialMessage, processStage, lang]);

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
            className="relative w-full sm:max-w-3xl h-[92vh] sm:h-[85vh] bg-background sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
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
              <button
                onClick={handleClose}
                className="ml-auto p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
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
