const footerCols = [
  {
    title: "Biztosítás",
    links: ["Kötelező", "Casco", "Lakás", "Utas", "Baleset"],
  },
  {
    title: "Segítség",
    links: ["GYIK", "Kapcsolat", "Adatvédelem", "Felhasználási feltételek"],
  },
  {
    title: "Netrisk",
    links: ["Rólunk", "Karrier", "Blog", "Mobilapp"],
  },
];

interface FooterSectionProps {
  onActivatePresenter?: () => void;
}

const FooterSection = ({ onActivatePresenter }: FooterSectionProps) => (
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
        <p className="text-xs text-secondary-foreground/50">
          © 1994-2026 Netrisk Magyarország Kft. Minden jog fenntartva.
        </p>
        <p
          className="text-xs text-secondary-foreground/30 cursor-default select-none"
          onClick={() => onActivatePresenter?.()}
          title=""
        >
          AI Tanácsadó — Prototype Demo
        </p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
