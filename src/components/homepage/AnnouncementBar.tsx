import type { CSSProperties } from "react";

interface AnnouncementBarProps {
  isReturning: boolean;
  onToggle: (val: boolean) => void;
  style?: CSSProperties;
}

const AnnouncementBar = ({ isReturning, onToggle, style }: AnnouncementBarProps) => (
  <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-secondary flex items-center justify-center" style={style}>
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-secondary-foreground/50 uppercase tracking-wider font-medium hidden sm:inline">
        Demo mód:
      </span>
      <div className="flex rounded-full bg-secondary-foreground/10 p-0.5">
        <button
          onClick={() => onToggle(false)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            !isReturning
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-secondary-foreground/60 hover:text-secondary-foreground"
          }`}
        >
          Új látogató
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isReturning
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-secondary-foreground/60 hover:text-secondary-foreground"
          }`}
        >
          Visszatérő ügyfél
        </button>
      </div>
    </div>
  </div>
);

export default AnnouncementBar;
