import ScrollReveal from "@/components/homepage/ScrollReveal";

const layers = [
  {
    color: "bg-primary",
    textColor: "text-primary-foreground",
    label: "User Interface Layer",
    boxes: [
      { title: "Mobile App" },
      { title: "Conversational AI" },
      { title: "Push Notifications" },
    ],
  },
  {
    color: "bg-blue-600",
    textColor: "text-white",
    label: "Agent Orchestration Layer",
    boxes: [
      {
        title: "LLM-Powered Decision Engine",
        subtitle: "When to act, what to negotiate, which provider to switch to",
        wide: true,
      },
    ],
  },
  {
    color: "multi",
    label: "Intelligence & Execution Layer",
    boxes: [
      {
        title: "Contract Intelligence",
        color: "bg-amber-500",
        textColor: "text-white",
        bullets: ["Open Banking (PSD2/PSD3)", "Email scanning", "Bill OCR", "Document parsing"],
      },
      {
        title: "Market Comparison",
        color: "bg-teal-600",
        textColor: "text-white",
        bullets: ["Provider API feeds", "Partner aggregators", "Real-time tariffs", "Insurance quotes"],
      },
      {
        title: "Negotiation Engine",
        color: "bg-violet-600",
        textColor: "text-white",
        bullets: ["Automated calls (Voice AI)", "Chat/email bots", "Letter of Authority", "Regulated switching APIs"],
      },
    ],
  },
  {
    color: "bg-slate-500",
    textColor: "text-white",
    label: "Data & Compliance Layer",
    boxes: [
      { title: "Consumer Consent" },
      { title: "FCA/MNB Compliance" },
      { title: "GDPR" },
      { title: "Audit Trail" },
    ],
  },
];

const ArchitectureSection = () => (
  <section className="py-24 sm:py-32 bg-section-bg">
    <div className="max-w-5xl mx-auto px-6">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-4 tracking-tight">
          Technical Architecture
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          A modular, regulation-ready platform built for autonomous action
        </p>
      </ScrollReveal>

      <div className="space-y-3">
        {layers.map((layer, li) => (
          <ScrollReveal key={li} delay={li * 100}>
            {/* Connector */}
            {li > 0 && (
              <div className="flex justify-center -mt-3 mb-1">
                <div className="w-px h-6 bg-border" />
              </div>
            )}

            {/* Label */}
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2 text-center">
              {layer.label}
            </p>

            {layer.color === "multi" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {layer.boxes.map((box: any, bi: number) => (
                  <div
                    key={bi}
                    className={`${box.color} ${box.textColor} rounded-xl p-5`}
                  >
                    <p className="font-bold text-sm mb-3">{box.title}</p>
                    <ul className="space-y-1.5">
                      {box.bullets?.map((b: string, j: number) => (
                        <li key={j} className="text-xs opacity-90 flex gap-1.5">
                          <span className="opacity-60">›</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid gap-3 ${
                layer.boxes.length === 1 ? "grid-cols-1" :
                layer.boxes.length === 3 ? "grid-cols-1 sm:grid-cols-3" :
                "grid-cols-2 sm:grid-cols-4"
              }`}>
                {layer.boxes.map((box: any, bi: number) => (
                  <div
                    key={bi}
                    className={`${layer.color} ${layer.textColor} rounded-xl px-5 py-4 text-center ${
                      box.wide ? "col-span-full" : ""
                    }`}
                  >
                    <p className="font-bold text-sm">{box.title}</p>
                    {box.subtitle && (
                      <p className="text-xs opacity-80 mt-1">{box.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ArchitectureSection;
