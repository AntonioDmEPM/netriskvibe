import ScrollReveal from "./ScrollReveal";

const formFields = [
  "Rendszám",
  "Születési dátum",
  "Lakcím",
  "Bonus-malus",
  "Fizetési mód",
  "Személyes adatok",
];

const chatMessages = [
  { role: "agent", text: "Üdvözlöm! Mi a rendszáma?" },
  { role: "user", text: "ABC-123" },
  { role: "agent", text: "2015-ös Opel Astra, stimmel? Hol lakik?" },
  { role: "user", text: "Szegeden" },
];

const BeforeAfter = () => (
  <section className="py-16 sm:py-24 bg-background">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-4">
          A biztosításkötés új kora
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Hasonlítsa össze a régi és az új módszert
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* OLD WAY */}
        <ScrollReveal>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 h-full">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Hagyományos mód
              </span>
            </div>

            {/* Mock form */}
            <div className="space-y-3 mb-6">
              {formFields.map((field) => (
                <div key={field} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{field}</span>
                  <div className="flex-1 h-8 bg-muted rounded-md" />
                </div>
              ))}
            </div>

            {/* Mock results table */}
            <div className="space-y-2 mb-4 opacity-50">
              {[1, 2, 3].map((r) => (
                <div key={r} className="flex gap-2">
                  <div className="h-6 bg-muted rounded flex-1" />
                  <div className="h-6 bg-muted rounded w-20" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">15-25 mező kitöltése</span>
              <span className="text-sm font-bold text-destructive">~8 perc</span>
            </div>
          </div>
        </ScrollReveal>

        {/* NEW WAY */}
        <ScrollReveal delay={100}>
          <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 sm:p-8 h-full ring-1 ring-primary/10 shadow-lg shadow-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Netrisk AI tanácsadó
              </span>
            </div>

            {/* Mini chat */}
            <div className="space-y-3 mb-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini quote card preview */}
            <div className="border border-primary/20 rounded-lg p-3 bg-emerald-50/50 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">Genertel</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">#1</span>
              </div>
              <span className="text-lg font-bold text-primary">12 800 Ft/év</span>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/20">
              <span className="text-sm text-muted-foreground">3-4 kérdés, beszélgetés formájában</span>
              <span className="text-sm font-bold text-primary">~2 perc</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default BeforeAfter;
