import { motion } from "framer-motion";
import { Bot, Shield } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-secondary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            BiztosítóAgent
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-body text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Hogyan működik</a>
          <a href="#" className="hover:text-foreground transition-colors">Biztosítások</a>
          <a href="#" className="hover:text-foreground transition-colors">Rólunk</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-savings/10 text-savings text-xs font-medium">
            <Bot className="w-3.5 h-3.5" />
            AI Ügynök
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
