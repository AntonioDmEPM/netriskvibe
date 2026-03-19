import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n";

const formFieldKeys = [
  "ba.form.rendszam", "ba.form.birth", "ba.form.address",
  "ba.form.bm", "ba.form.payment", "ba.form.personal",
];

const chatMessageKeys = [
  { role: "agent", key: "ba.chat.1" },
  { role: "user", key: "ba.chat.2" },
  { role: "agent", key: "ba.chat.3" },
  { role: "user", key: "ba.chat.4" },
];

const StaggeredFields = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3 mb-6">
      {formFieldKeys.map((key, i) => (
        <div
          key={key}
          className="flex items-center gap-3 transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: visible ? `${i * 300}ms` : "0ms",
          }}
        >
          <span className="text-xs text-muted-foreground w-28 shrink-0">{t(key)}</span>
          <div className="flex-1 h-8 bg-muted rounded-md" />
        </div>
      ))}
    </div>
  );
};

const StaggeredChat = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3 mb-4">
      {chatMessageKeys.map((msg, i) => (
        <div
          key={i}
          className={`flex transition-all duration-400 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: visible ? `${i * 150}ms` : "0ms",
          }}
        >
          <div
            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            }`}
          >
            {t(msg.key)}
          </div>
        </div>
      ))}
    </div>
  );
};

const BeforeAfter = () => {
  const { t } = useI18n();

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-4">
            {t("ba.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            {t("ba.subtitle")}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 h-full">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {t("ba.old.label")}
                </span>
              </div>
              <StaggeredFields />
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
                <span className="text-sm text-muted-foreground">{t("ba.old.fields")}</span>
                <span className="text-sm font-bold text-destructive">{t("ba.old.time")}</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 sm:p-8 h-full ring-1 ring-primary/10 shadow-lg shadow-primary/5">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {t("ba.new.label")}
                </span>
              </div>
              <StaggeredChat />
              <div className="border border-primary/20 rounded-lg p-3 bg-emerald-50/50 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">Genertel</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">#1</span>
                </div>
                <span className="text-lg font-bold text-primary">12 800 Ft/{t("ba.old.time") === "~8 min" ? "yr" : "év"}</span>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/20">
                <span className="text-sm text-muted-foreground">{t("ba.new.fields")}</span>
                <span className="text-sm font-bold text-primary">{t("ba.new.time")}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
