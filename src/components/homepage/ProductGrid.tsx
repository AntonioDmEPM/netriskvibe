import { useState } from "react";
import { Car, Shield, Home, Plane, Banknote, HeartPulse } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface ProductGridProps {
  onStartFlow: (flowId: string) => void;
}

const products = [
  { icon: Car, name: "Kötelező biztosítás (KGFB)", desc: "Kötelező gépjármű felelősségbiztosítás összehasonlítás", color: "text-blue-500 bg-blue-50", flowId: "new", isMain: true },
  { icon: Shield, name: "Casco", desc: "Teljes körű gépjármű biztosítás", color: "text-indigo-500 bg-indigo-50", flowId: "", isMain: false },
  { icon: Home, name: "Lakásbiztosítás", desc: "Otthona védelme, személyre szabva", color: "text-orange-500 bg-orange-50", flowId: "", isMain: false },
  { icon: Plane, name: "Utasbiztosítás", desc: "Utazási biztosítás bárhová a világon", color: "text-teal-500 bg-teal-50", flowId: "", isMain: false },
  { icon: Banknote, name: "Személyi kölcsön", desc: "A legjobb hitelajánlatok egy helyen", color: "text-amber-500 bg-amber-50", flowId: "", isMain: false },
  { icon: HeartPulse, name: "Egészségpénztár", desc: "Spóroljon az egészségügyi kiadásain", color: "text-rose-500 bg-rose-50", flowId: "", isMain: false },
];

const ProductGrid = ({ onStartFlow }: ProductGridProps) => {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-section-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-12">
            Miben segíthetünk?
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <ScrollReveal key={p.name} delay={i * 80}>
              <div
                className={`relative bg-card border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${
                  p.isMain ? "border-primary/40 animate-kgfb-pulse" : "border-border"
                }`}
                onClick={() => {
                  if (p.flowId) {
                    onStartFlow(p.flowId);
                  } else {
                    setTooltip(p.name);
                    setTimeout(() => setTooltip(null), 2000);
                  }
                }}
              >
                <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                <span className="text-sm font-semibold text-primary group-hover:underline">
                  Tanácsadó indítása →
                </span>

                {tooltip === p.name && !p.flowId && (
                  <div className="absolute top-2 right-2 bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg animate-fade-in-up">
                    Hamarosan!
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
