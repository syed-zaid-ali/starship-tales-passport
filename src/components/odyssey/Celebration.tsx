import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { clearReward, useReward } from "@/lib/explorer-store";
import { REWARD_ICON } from "./icons";

const COLORS = ["bg-tone-sun", "bg-tone-pink", "bg-tone-sky", "bg-tone-lime", "bg-tone-orange", "bg-tone-teal"];

function Confetti({ seed, count }: { seed: number; count: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (seed % 7) * 0.1;
        const dist = 160 + ((i * 53 + seed * 17) % 220);
        return {
          i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 60,
          rotate: (i * 47) % 360,
          color: COLORS[i % COLORS.length],
          round: i % 3 === 0,
        };
      }),
    [seed, count],
  );
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/3 z-[70]">
      {bits.map((b) => (
        <motion.span
          key={b.i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
          animate={{ x: b.x, y: b.y + 260, opacity: 0, scale: 1, rotate: b.rotate + 360 }}
          transition={{ duration: 1.6, ease: [0.15, 0.6, 0.4, 1] }}
          className={`absolute ${b.color} ${b.round ? "size-3 rounded-full" : "h-4 w-2 rounded-sm"}`}
        />
      ))}
    </div>
  );
}

const ICON_BG: Record<string, string> = {
  gold: "bg-medal-gold",
  silver: "bg-medal-silver",
  bronze: "bg-medal-bronze",
  star: "bg-tone-sun",
  sticker: "bg-tone-pink",
  welcome: "bg-tone-sky",
  finish: "bg-tone-lime",
};

export function Celebration() {
  const reward = useReward();
  const Icon = reward ? REWARD_ICON[reward.icon] : REWARD_ICON.star;
  useEffect(() => {
    if (!reward) return;
    const t = setTimeout(clearReward, reward.big ? 3400 : 2400);
    return () => clearTimeout(t);
  }, [reward]);

  return (
    <AnimatePresence>
      {reward && (
        <motion.div key={reward.id} className="pointer-events-none fixed inset-0 z-[70]" exit={{ opacity: 0 }}>
          <Confetti seed={reward.id} count={reward.big ? 48 : 22} />
          <motion.div
            role="status"
            initial={{ y: -40, scale: 0.6, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="absolute left-1/2 top-24 flex w-[min(92vw,26rem)] -translate-x-1/2 items-center gap-4 rounded-3xl border-4 border-primary chat-surface p-4 shadow-[0_8px_0_var(--primary-deep)]"
          >
            <motion.span
              animate={{ rotate: [0, -15, 15, -10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8 }}
              className={`grid size-14 shrink-0 place-items-center rounded-2xl ${ICON_BG[reward.icon] ?? "bg-tone-pink"} text-ink`}
            >
              <Icon className="size-8" />
            </motion.span>
            <div>
              <p className="font-display text-xl font-bold leading-tight">{reward.title}</p>
              {reward.subtitle && <p className="text-sm font-bold opacity-70">{reward.subtitle}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
