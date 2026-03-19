import { motion } from "framer-motion";
import { Users, TrendingDown, Clock, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "150,000+", label: "Elégedett ügyfél" },
  { icon: TrendingDown, value: "35%", label: "Átlagos megtakarítás" },
  { icon: Clock, value: "90 mp", label: "Átlagos keresési idő" },
  { icon: Shield, value: "12+", label: "Biztosító partner" },
];

const StatsBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.1 }}
          className="flex flex-col items-center text-center gap-1"
        >
          <stat.icon className="w-5 h-5 text-primary mb-1" />
          <span className="text-xl sm:text-2xl font-bold text-foreground">
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsBar;
