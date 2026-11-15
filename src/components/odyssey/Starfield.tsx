import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo } from "react";

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useStars(count: number, seed: number) {
  return useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      i,
      top: r() * 100,
      left: r() * 100,
      size: r(),
      delay: r() * 3,
    }));
  }, [count, seed]);
}

function Layer({ count, seed, sizeBase, travel, twinkle }: { count: number; seed: number; sizeBase: number; travel: string; twinkle?: boolean }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", travel]);
  const stars = useStars(count, seed);
  return (
    <motion.div style={{ y }} className="absolute inset-x-0 top-0 h-[260vh]">
      {stars.map((s) => (
        <span
          key={s.i}
          className={`absolute rounded-full bg-foreground ${twinkle ? "animate-twinkle" : "opacity-60"}`}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: sizeBase + s.size * sizeBase,
            height: sizeBase + s.size * sizeBase,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </motion.div>
  );
}

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night">
      <div className="absolute inset-0 bg-nebula" />
      <Layer count={140} seed={7} sizeBase={1} travel="-20%" />
      <Layer count={70} seed={21} sizeBase={1.8} travel="-40%" twinkle />
      <Layer count={24} seed={99} sizeBase={3} travel="-60%" twinkle />
      {[0, 6, 13].map((d, i) => (
        <span
          key={d}
          className="absolute h-0.5 w-40 rounded-full bg-gradient-to-l from-foreground to-transparent"
          style={{ top: `${8 + i * 22}%`, right: `${-10 + i * 15}%`, animation: `shooting 14s ${d}s linear infinite`, opacity: 0 }}
        />
      ))}
    </div>
  );
}
