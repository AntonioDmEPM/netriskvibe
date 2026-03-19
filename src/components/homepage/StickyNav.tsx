import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface StickyNavProps {
  onOpenOverlay: () => void;
  hasAnnouncementBar?: boolean;
  extraTopOffset?: number;
  isReturning?: boolean;
}

const StickyNav = ({ onOpenOverlay, hasAnnouncementBar, extraTopOffset = 0, isReturning }: StickyNavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();

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
          <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.insurance")}</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.bank")}</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.knowledge")}</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.about")}</span>
        </div>

        <div className="flex items-center gap-3">
          {isReturning ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-foreground leading-tight">Kovács Anna</p>
                <p className="text-[11px] text-muted-foreground leading-tight">Budapest</p>
              </div>
            </div>
          ) : (
            <span className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {t("nav.login")}
            </span>
          )}
          <button
            onClick={onOpenOverlay}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t("nav.cta")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StickyNav;
