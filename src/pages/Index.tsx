import { useState, useCallback, useRef, useEffect } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import AdvisorSidebar from "@/components/advisor/AdvisorSidebar";
import ChatMessage, { type Message } from "@/components/advisor/ChatMessage";
import ChatInput from "@/components/advisor/ChatInput";
import TypingIndicator from "@/components/advisor/TypingIndicator";
import { getFlow, genId, type Flow } from "@/lib/flows";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastMsgId, setLastMsgId] = useState<string | null>(null);

  const flowRef = useRef<Flow | null>(null);
  const turnRef = useRef(0);
  const versionRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processAgentTurn = useCallback(async (turn: (typeof flowRef.current extends Flow ? Flow[number] : never), version: number) => {
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

  const startDemo = useCallback((id: string) => {
    const version = ++versionRef.current;
    const flow = getFlow(id);
    flowRef.current = flow;
    turnRef.current = 0;
    setMessages([]);
    setIsTyping(false);
    setInputEnabled(false);
    setActiveDemo(id);
    setSidebarOpen(false);
    setLastMsgId(null);
    processAgentTurn(flow[0], version);
  }, [processAgentTurn]);

  const advanceTurn = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const next = turnRef.current + 1;
    if (next >= flow.length) return;
    turnRef.current = next;
    processAgentTurn(flow[next], versionRef.current);
  }, [processAgentTurn]);

  const handleSend = useCallback((text: string) => {
    if (!flowRef.current) return;
    const id = genId();
    setMessages((prev) => [...prev, { id, role: 'user', parts: [{ type: 'text', content: text }] }]);
    advanceTurn();
  }, [advanceTurn]);

  const handleQuoteSelect = useCallback((insurerName: string) => {
    const id = genId();
    setMessages((prev) => [...prev, { id, role: 'user', parts: [{ type: 'text', content: `I choose: ${insurerName}` }] }]);
    advanceTurn();
  }, [advanceTurn]);

  const handleSwitchConfirm = useCallback(() => {
    advanceTurn();
  }, [advanceTurn]);

  const handleNewConversation = useCallback(() => {
    ++versionRef.current;
    flowRef.current = null;
    turnRef.current = 0;
    setMessages([]);
    setIsTyping(false);
    setInputEnabled(false);
    setActiveDemo(null);
    setSidebarOpen(false);
    setLastMsgId(null);
  }, []);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <AdvisorSidebar
          onNewConversation={handleNewConversation}
          onStartDemo={startDemo}
          activeDemo={activeDemo}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[280px] h-full">
            <AdvisorSidebar
              onNewConversation={handleNewConversation}
              onStartDemo={startDemo}
              activeDemo={activeDemo}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-bold text-foreground">MTPL Advisor</h1>
          <span className="ml-2 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-powered
          </span>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isTyping ? (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">
                n
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Netrisk AI Advisor
              </h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md">
                Your personal AI insurance advisor — choose a demo scenario to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  { id: 'returning', label: 'Returning Customer', desc: 'Compare existing KÖBE policy' },
                  { id: 'new', label: 'New Customer', desc: 'Find your first car insurance' },
                  { id: 'advisory', label: 'Advisory', desc: 'Ask about the offers' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => startDemo(d.id)}
                    className="px-5 py-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left max-w-[220px]"
                  >
                    <p className="font-semibold text-foreground text-sm mb-1">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
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
          )}
        </div>

        {/* Input area */}
        <ChatInput onSend={handleSend} disabled={!inputEnabled} />
      </div>
    </div>
  );
};

export default Index;
