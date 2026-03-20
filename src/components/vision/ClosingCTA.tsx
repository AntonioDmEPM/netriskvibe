import ScrollReveal from "@/components/homepage/ScrollReveal";

const ClosingCTA = () => (
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
      <ScrollReveal delay={300}>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Built by <span className="text-gray-300 font-semibold">EPAM Applied AI</span></p>
          <p className="text-sm text-gray-600">Contact: applied-ai@epam.com</p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ClosingCTA;
