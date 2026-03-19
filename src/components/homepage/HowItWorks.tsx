import { MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    icon: MessageCircle,
    title: "Meséljen az igényeiről",
    desc: "Nem kell űrlapokat kitöltenie. Egyszerűen írja le, mire van szüksége — a rendszámát, a helyzetét, vagy csak egy kérdést.",
  },
  {
    icon: Sparkles,
    title: "Az AI összehasonlít",
    desc: "A tanácsadó valós időben összehasonlítja mind a 22 biztosító ajánlatát, és kiválasztja az Ön helyzetére legjobbat.",
  },
  {
    icon: ShieldCheck,
    title: "Egy kattintás, kész",
    desc: "Válassza ki az ajánlatot, és a Netrisk intézi a váltást — felmondás, új szerződés, minden papírmunka.",
  },
];

const HowItWorks = () => (
  <section className="py-16 sm:py-24 bg-background">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-12">
          Hogyan működik a Netrisk AI tanácsadó?
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <ScrollReveal key={step.title} delay={i * 100}>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
