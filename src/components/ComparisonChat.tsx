import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  default: `Happy to help you compare these quotes! You can ask me anything, for example:

- Which insurer has the best roadside assistance?
- What's the difference between basic and premium packages?
- Which one do you recommend for young drivers?`,
  allianz: `**Allianz Hungary** strengths:

- ✅ **$0 deductible** on glass damage — rare in the market
- ✅ **24-hour roadside assistance** + 5-day rental car
- ✅ Supplemental accident insurance for the driver

Downside: at **$48/mo**, it's the most expensive of the three. But if full coverage matters to you, this is the best value.`,
  generali: `**Generali** is the cheapest option (**$42/mo**), but with trade-offs:

- ✅ Basic roadside assistance
- ✅ Monthly payments with **no surcharge**
- ⚠️ No rental car coverage
- ⚠️ Basic-level claims processing

If price is your top priority and you drive infrequently, this is a good pick.`,
  compare: `### Quick Comparison

| | Allianz | Generali | PostaInsurance |
|---|---|---|---|
| **Monthly** | $48 | $42 | $43 |
| **Assistance** | Premium | Basic | Mid-tier |
| **Rental Car** | ✅ 5 days | ❌ | ❌ |
| **Claims** | Avg 7 days | Avg 10 days | Avg 5 days |
| **Glass Damage** | $0 deductible | 20% deductible | 10% deductible |

👉 **My recommendation:** Fast claims processing → PostaInsurance. Full protection → Allianz. Budget-friendly → Generali.`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("allianz")) return fakeResponses.allianz;
  if (lower.includes("generali")) return fakeResponses.generali;
  if (lower.includes("difference") || lower.includes("compare") || lower.includes("comparison") || lower.includes("between"))
    return fakeResponses.compare;
  return fakeResponses.default;
}

const ComparisonChat = ({ query, recommendations }: ComparisonChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `I've found the best quotes for your request. Ask me anything about the results — I can compare them, explain differences, or help you choose!`,
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
    "What's the difference between the three quotes?",
    "Which one is best for fast claims processing?",
    "Tell me more about the Allianz package",
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
          <p className="text-sm font-semibold text-foreground">AI Advisor</p>
          <p className="text-xs text-muted-foreground">Ask about the quotes</p>
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
                  <div className="prose prose-sm max-w-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_strong]:text-foreground [&_table]:my-3 [&_table]:w-full [&_table]:text-xs [&_table]:border-collapse [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_th]:border-b [&_th]:border-border [&_td]:px-2 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-border/50 [&_tr:last-child_td]:border-b-0 [&_thead]:bg-card/50">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
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
            placeholder="Ask about the quotes..."
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
