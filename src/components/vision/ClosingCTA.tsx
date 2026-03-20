import ScrollReveal from "@/components/homepage/ScrollReveal";
import { Button } from "@/components/ui/button";
import { type DemoTab } from "@/components/TopNavBar";

interface ClosingCTAProps {
  onSwitchTab?: (tab: DemoTab) => void;
}

const ClosingCTA = ({ onSwitchTab }: ClosingCTAProps) => (
  <section
    className="py-24 sm:py-32 px-6"
    style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)" }}
  >
    <div className="max-w-3xl mx-auto text-center">
      <ScrollReveal>
        <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug mb-6" style={{ textWrap: "balance" as any }}>
          The first company to build a trusted financial agent will own the consumer relationship.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <p className="text-lg text-gray-400 mb-16">
          The comparison sites become the plumbing underneath.
        </p>
      </ScrollReveal>

      {onSwitchTab && (
        <ScrollReveal delay={250}>
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

      <ScrollReveal delay={350}>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Built by <span className="text-gray-300 font-semibold">EPAM Applied AI</span></p>
          <p className="text-sm text-gray-600">Contact: applied-ai@epam.com</p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ClosingCTA;
