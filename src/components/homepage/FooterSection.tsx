import { useI18n } from "@/lib/i18n";

interface FooterSectionProps {
  onActivatePresenter?: () => void;
}

const FooterSection = ({ onActivatePresenter }: FooterSectionProps) => {
  const { t } = useI18n();

  const footerCols = [
    {
      title: t("footer.insurance"),
      links: [t("footer.kgfb"), t("footer.casco"), t("footer.home"), t("footer.travel"), t("footer.accident")],
    },
    {
      title: t("footer.help"),
      links: [t("footer.faq"), t("footer.contact"), t("footer.privacy"), t("footer.terms")],
    },
    {
      title: t("footer.netrisk"),
      links: [t("footer.aboutus"), t("footer.career"), t("footer.blog"), t("footer.app")],
    },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold mb-4 text-secondary-foreground">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-secondary-foreground/60 hover:text-secondary-foreground transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-secondary-foreground/50">{t("footer.copyright")}</p>
          <p
            className="text-xs text-secondary-foreground/30 cursor-default select-none"
            onClick={() => onActivatePresenter?.()}
            title=""
          >
            {t("footer.demo")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
