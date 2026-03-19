interface TimelineCardProps {
  currentStep: number;
}

const steps = [
  { label: "Ma", sublabel: "Összehasonlítás" },
  { label: "Kalkuláció kész", sublabel: "Ajánlatok" },
  { label: "30 napos határidő", sublabel: "Felmondás" },
  { label: "Új biztosítás indul", sublabel: "Szerződés" },
];

const TimelineCard = ({ currentStep }: TimelineCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-foreground mb-4">KGFB váltás ütemterve</h4>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                  i <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
              <span className="text-[10px] text-muted-foreground">{step.sublabel}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 ${
                  i < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineCard;
