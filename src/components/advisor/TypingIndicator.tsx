const TypingIndicator = () => (
  <div className="flex items-start gap-3 animate-fade-in-up">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground text-xs font-bold">
      N
    </div>
    <div className="bg-agent-bubble rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
      <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
      <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
    </div>
  </div>
);

export default TypingIndicator;
