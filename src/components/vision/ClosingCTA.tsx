import ScrollReveal from "@/components/homepage/ScrollReveal";
import { Button } from "@/components/ui/button";
import { type DemoTab } from "@/components/TopNavBar";

interface ClosingCTAProps {
  onSwitchTab?: (tab: DemoTab) => void;
}

const taglines = [
  "Az AI pénzügyi tanácsadó minden háztartásnak",
  "From compare-and-click to set-and-forget",
  "Nem megmutatjuk a legjobb ajánlatot. Megszerezzük.",
];

const ClosingCTA = ({ onSwitchTab }: ClosingCTAProps) => (
  <section
    className="py-24 sm:py-32 px-6"
    style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)" }}
  >
    <div className="max-w-3xl mx-auto text-center">
      <ScrollReveal>
        <p
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-300 leading-relaxed mb-8 italic"
          style={{ textWrap: "balance" as any }}
        >
          "Your current model earns 15 000 Ft when a customer clicks. What if you earned 75 000–150 000 Ft/year by managing that customer's financial life?"
        </p>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <p className="text-lg text-gray-400 mb-4 leading-relaxed">
          The first company to build a trusted financial agent will own the consumer relationship.
        </p>
        <p className="text-base text-gray-500 mb-10">
          The comparison sites become the plumbing underneath.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={220}>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {taglines.map((t, i) => (
            <span
              key={i}
              className="inline-block text-xs sm:text-sm font-medium text-white/80 bg-white/8 border border-white/10 rounded-full px-4 py-2"
            >
              {t}
            </span>
          ))}
        </div>
      </ScrollReveal>

      {onSwitchTab && (
        <ScrollReveal delay={300}>
          <div className="mb-16">
            <p className="text-sm text-gray-400 mb-4">Try the demos:</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white"
                onClick={() => onSwitchTab("netrisk")}
              >
                Netrisk AI Tanácsadó →
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white"
                onClick={() => onSwitchTab("dashboard")}
              >
                Personal Finance Dashboard →
              </Button>
            </div>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal delay={400}>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Built by <span className="text-gray-300 font-semibold">EPAM Applied AI</span></p>
          <p className="text-sm text-gray-600">Contact: applied-ai@epam.com</p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ClosingCTA;
