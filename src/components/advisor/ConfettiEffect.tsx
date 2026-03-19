import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const ConfettiEffect = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const pts: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40, // center area (30-70%)
      y: 60 + Math.random() * 30,  // start from middle-bottom
      size: 4 + Math.random() * 6,
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.6,
      opacity: 0.5 + Math.random() * 0.5,
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${p.x}%`,
            bottom: `${100 - p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `confetti-float ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
