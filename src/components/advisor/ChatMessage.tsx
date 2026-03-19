import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ComparisonPanel from "./ComparisonPanel";
import SwitchingCard from "./SwitchingCard";
import TimelineCard from "./TimelineCard";
import SavingsBanner from "./SavingsBanner";
import type { QuoteData } from "@/lib/mockData";

export type MessagePart =
  | { type: 'text'; content: string }
  | { type: 'comparison'; quotes: QuoteData[]; recommended?: number }
  | { type: 'switching'; from?: { name: string; price: number }; to: { name: string; price: number } }
  | { type: 'timeline'; currentStep: number; steps?: { label: string; sublabel?: string }[]; footnote?: string }
  | { type: 'savings'; oldPrice: number; newPrice: number };

export interface Message {
  id: string;
  role: 'agent' | 'user';
  parts: MessagePart[];
}

interface ChatMessageProps {
  message: Message;
  animate?: boolean;
  onQuoteSelect?: (insurerName: string) => void;
  onSwitchConfirm?: () => void;
}

function useTypewriter(text: string, enabled: boolean) {
  const speed = Math.max(4, Math.min(25, 1500 / text.length));
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) { setCount(text.length); return; }
    setCount(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      if (i >= text.length) { setCount(text.length); clearInterval(iv); }
      else setCount(i);
    }, speed);
    return () => clearInterval(iv);
  }, [text, enabled, speed]);

  return text.slice(0, count);
}

const ChatMessage = ({ message, animate, onQuoteSelect, onSwitchConfirm }: ChatMessageProps) => {
  const isAgent = message.role === 'agent';
  const isTextOnly = message.parts.every(p => p.type === 'text');
  const fullText = message.parts.filter(p => p.type === 'text').map(p => p.content).join('\n\n');
  const shouldTypewrite = animate && isAgent && isTextOnly && fullText.length > 80;
  const displayedText = useTypewriter(fullText, shouldTypewrite);

  if (!isAgent) {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed">
          {message.parts.map((p, i) => p.type === 'text' ? <span key={i}>{p.content}</span> : null)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground text-xs font-bold">
        N
      </div>
      <div className="max-w-[85%] space-y-3">
        {isTextOnly ? (
          <div className="bg-agent-bubble rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {shouldTypewrite ? displayedText : fullText}
          </div>
        ) : (
          message.parts.map((part, i) => {
            if (part.type === 'text') {
              return (
                <div key={i} className="bg-agent-bubble rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {part.content}
                </div>
              );
            }
            if (part.type === 'comparison') {
              return (
                <ComparisonPanel
                  key={i}
                  quotes={part.quotes}
                  recommended={part.recommended}
                  onSelect={onQuoteSelect}
                />
              );
            }
            if (part.type === 'switching') {
              return (
                <SwitchingCard
                  key={i}
                  from={part.from}
                  to={part.to}
                  onConfirm={onSwitchConfirm}
                />
              );
            }
            if (part.type === 'timeline') {
              return <TimelineCard key={i} currentStep={part.currentStep} steps={part.steps} footnote={part.footnote} />;
            }
            if (part.type === 'savings') {
              return <SavingsBanner key={i} oldPrice={part.oldPrice} newPrice={part.newPrice} />;
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
