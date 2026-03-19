import { useI18n } from "@/lib/i18n";

interface TimelineCardProps {
  currentStep: number;
  steps?: { label: string; sublabel?: string }[];
  footnote?: string;
}

const TimelineCard = ({ currentStep, steps, footnote }: TimelineCardProps) => {
  const { t } = useI18n();

  const defaultSteps = [
    { label: t("timeline.today"), sublabel: t("timeline.calc") },
    { label: t("timeline.offer"), sublabel: t("timeline.compare") },
    { label: t("timeline.deadline"), sublabel: t("timeline.cancel") },
    { label: t("timeline.newstart"), sublabel: t("timeline.contract") },
  ];

  const displaySteps = steps ?? defaultSteps;

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-foreground mb-4">{t("timeline.title")}</h4>
      <div className="flex items-center">
        {displaySteps.map((step, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                  i <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i <= currentStep ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
              {step.sublabel && (
                <span className="text-[10px] text-muted-foreground">{step.sublabel}</span>
              )}
            </div>
            {i < displaySteps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 relative overflow-hidden rounded-full">
                <div className={`absolute inset-0 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
                {i === currentStep && (
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-primary animate-timeline-progress rounded-full" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {footnote && (
        <p className="text-xs text-muted-foreground mt-3 text-center">{footnote}</p>
      )}
    </div>
  );
};

export default TimelineCard;
