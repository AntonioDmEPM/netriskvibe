import { MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n";

const stepKeys = [
  { icon: MessageCircle, titleKey: "howit.step1.title", descKey: "howit.step1.desc" },
  { icon: Sparkles, titleKey: "howit.step2.title", descKey: "howit.step2.desc" },
  { icon: ShieldCheck, titleKey: "howit.step3.title", descKey: "howit.step3.desc" },
];

const HowItWorks = () => {
  const { t } = useI18n();

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-12">
            {t("howit.title")}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepKeys.map((step, i) => (
            <ScrollReveal key={step.titleKey} delay={i * 100}>
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
