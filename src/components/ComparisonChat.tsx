import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ComparisonChatProps {
  query: string;
  recommendations: { provider: string; monthlyPrice: string; coverage: string; reason: string; highlights: string[] }[];
}

const fakeResponses: Record<string, string> = {
  default: `Szívesen segítek összehasonlítani az ajánlatokat! Kérdezzen bármit a biztosításokról, például:
- Melyik biztosító nyújtja a legjobb assistance-t?
- Mi a különbség az alap és prémium csomag között?
- Melyiket ajánlja fiatal sofőröknek?`,
  allianz: `Az **Allianz Hungária** erősségei:
- ✅ **0 Ft önrész** üvegkár esetén — ez ritka a piacon
- ✅ **24 órás assistance** + 5 napos bérautó
- ✅ Kiegészítő balesetbiztosítás a sofőrnek

Hátránya: havi **12 450 Ft**, ami a legmagasabb a három közül. De ha az Ön számára fontos a teljes védelem, ez a legjobb ár-érték arány.`,
  generali: `A **Generali** a legolcsóbb ajánlat (**10 890 Ft/hó**), de kompromisszumokkal:
- ✅ Alap assistance csomag
- ✅ Havi díjfizetés **felár nélkül**
- ⚠️ Nincs bérautó biztosítás
- ⚠️ Alap szintű kárrendezés

Ha az ár a legfontosabb és ritkán vezet, ez jó választás.`,
  különbség: `### Gyors összehasonlítás

| | Allianz | Generali | Magyar Posta |
|---|---|---|---|
| **Havi díj** | 12 450 Ft | 10 890 Ft | 11 200 Ft |
| **Assistance** | Prémium | Alap | Közép |
| **Bérautó** | ✅ 5 nap | ❌ | ❌ |
| **Kárrendezés** | Átlag 7 nap | Átlag 10 nap | Átlag 5 nap |
| **Üvegkár** | 0 Ft önrész | 20% önrész | 10% önrész |

👉 **Ajánlásom:** Ha fontos a gyors kárrendezés → Magyar Posta. Ha teljes védelem kell → Allianz. Ha takarékoskodna → Generali.`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("allianz")) return fakeResponses.allianz;
  if (lower.includes("generali")) return fakeResponses.generali;
  if (lower.includes("különbség") || lower.includes("összehasonl") || lower.includes("hasonlít") || lower.includes("compare"))
    return fakeResponses.különbség;
  return fakeResponses.default;
}

const ComparisonChat = ({ query, recommendations }: ComparisonChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Megtaláltam a legjobb ajánlatokat a kérésére. Kérdezzen bármit az eredményekről — összehasonlítom, elmagyarázom a különbségeket, vagy segítek választani!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim();
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getResponse(userInput);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Mi a különbség a három ajánlat között?",
    "Melyiket ajánlja, ha fontos a gyors kárrendezés?",
    "Meséljen az Allianz csomagról részletesebben",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      className="w-full bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
      style={{ height: "520px" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/50">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">AI Tanácsadó</p>
          <p className="text-xs text-muted-foreground">Kérdezzen az ajánlatokról</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-savings animate-pulse" />
          <span className="text-xs text-savings font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_table]:my-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-foreground [&_th]:text-xs [&_td]:text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary/40 thinking-dot" />
              <div className="w-2 h-2 rounded-full bg-primary/40 thinking-dot" />
              <div className="w-2 h-2 rounded-full bg-primary/40 thinking-dot" />
            </div>
          </motion.div>
        )}

        {/* Quick questions after welcome */}
        {messages.length === 1 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-1.5 pl-9"
          >
            {quickQuestions.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                onClick={() => {
                  setInput(q);
                  inputRef.current?.focus();
                }}
                className="text-left text-sm px-3 py-2 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
              >
                {q}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kérdezzen az ajánlatokról..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isTyping}
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonChat;
