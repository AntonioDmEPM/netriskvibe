import { useState, useCallback, useRef, useEffect } from "react";
import { X, Send, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage, { type Message } from "@/components/advisor/ChatMessage";
import TypingIndicator from "@/components/advisor/TypingIndicator";
import ConfettiEffect from "@/components/advisor/ConfettiEffect";
import { getFlow, genId, type Flow } from "@/lib/flows";
import { useI18n } from "@/lib/i18n";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SCROLL_THRESHOLD = 150;

interface ConversationOverlayProps {
  flowId: string;
  initialMessage?: string;
  onClose: () => void;
  onTurnChange?: (turnIndex: number) => void;
}

const ConversationOverlay = ({ flowId, initialMessage, onClose, onTurnChange }: ConversationOverlayProps) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const flowRef = useRef<Flow | null>(null);
  const turnRef = useRef(0);
  const versionRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const [lastMsgId, setLastMsgId] = useState<string | null>(null);

  const processAgentTurn = useCallback(async (turn: Flow[number], version: number) => {
    if (!turn) return;
    setInputEnabled(false);
    for (let i = 0; i < turn.messages.length; i++) {
      if (versionRef.current !== version) return;
      const msg = turn.messages[i];
      setIsTyping(true);
      await sleep(msg.delay ?? 1200);
      if (versionRef.current !== version) return;
      setIsTyping(false);
      const id = genId();
      setLastMsgId(id);
      setMessages((prev) => [...prev, { id, role: 'agent', parts: msg.parts }]);
      if (i < turn.messages.length - 1) await sleep(400);
    }
    if (versionRef.current === version) setInputEnabled(true);
  }, []);

  const advanceTurn = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const next = turnRef.current + 1;
    if (next >= flow.length) return;
    turnRef.current = next;
    onTurnChange?.(next);
    processAgentTurn(flow[next], versionRef.current);
  }, [processAgentTurn, onTurnChange]);

  const handleSend = useCallback((text: string) => {
    if (!flowRef.current || !text.trim()) return;
    const id = genId();
    setMessages((prev) => [...prev, { id, role: 'user', parts: [{ type: 'text', content: text.trim() }] }]);
    advanceTurn();
  }, [advanceTurn]);

  const handleQuoteSelect = useCallback((insurerName: string) => {
    const id = genId();
    setMessages((prev) => [...prev, { id, role: 'user', parts: [{ type: 'text', content: `Ezt választom: ${insurerName}` }] }]);
    advanceTurn();
  }, [advanceTurn]);

  const handleSwitchConfirm = useCallback(() => {
    // Trigger confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Add final thank-you message after delay
    const version = versionRef.current;
    setTimeout(() => {
      if (versionRef.current !== version) return;
      const id = genId();
      setLastMsgId(id);
      setMessages((prev) => [...prev, {
        id,
        role: 'agent',
        parts: [{ type: 'text', content: t("switch.thankyou") }]
      }]);
    }, 1500);

    advanceTurn();
  }, [advanceTurn]);

  // Start flow on mount
  useEffect(() => {
    const version = ++versionRef.current;
    const flow = getFlow(flowId);
    flowRef.current = flow;
    turnRef.current = 0;

    if (initialMessage && flow.length > 1) {
      const id = genId();
      setMessages([{ id, role: 'user', parts: [{ type: 'text', content: initialMessage }] }]);
      turnRef.current = 1;
      processAgentTurn(flow[1], version);
    } else {
      processAgentTurn(flow[0], version);
    }
  }, [flowId, initialMessage, processAgentTurn]);

  // Focus input
  useEffect(() => {
    if (inputEnabled) inputRef.current?.focus();
  }, [inputEnabled]);

  // Close with animation
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
            className="relative w-full sm:max-w-3xl h-[92vh] sm:h-[85vh] bg-background sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Confetti */}
            {showConfetti && <ConfettiEffect />}

            {/* Top bar */}
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

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto relative" ref={scrollContainerRef}>
              {/* Scroll fade gradient at top */}
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

            {/* Input */}
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
                  placeholder="Írjon üzenetet..."
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
              <p className="text-center text-[10px] text-muted-foreground/50 mt-2">Powered by Netrisk AI</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConversationOverlay;
