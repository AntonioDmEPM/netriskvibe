import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">
            netrisk<span className="text-primary">.ai</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#" className="hover:text-foreground transition-colors">Insurance</a>
          <a href="#" className="hover:text-foreground transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-orange-hover transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
