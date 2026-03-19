import { useState, useEffect } from "react";

interface StickyNavProps {
  onOpenOverlay: () => void;
  hasAnnouncementBar?: boolean;
  extraTopOffset?: number;
}

const StickyNav = ({ onOpenOverlay, hasAnnouncementBar, extraTopOffset = 0 }: StickyNavProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
      style={{ top: (hasAnnouncementBar ? 36 : 0) + extraTopOffset }}
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-primary">netrisk.hu</span>
          <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">Biztosítás</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Bank</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Tudástár</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Rólunk</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Bejelentkezés
          </span>
          <button
            onClick={onOpenOverlay}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Díjat számolok
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StickyNav;
