import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface AdvisorFABProps {
  onClick: () => void;
}

const AdvisorFAB = ({ onClick }: AdvisorFABProps) => (
  <motion.button
    onClick={onClick}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center animate-fab-pulse hover:scale-110 transition-transform"
    aria-label="AI Tanácsadó"
    title="AI Tanácsadó"
  >
    <MessageCircle className="w-6 h-6" />
  </motion.button>
);

export default AdvisorFAB;
