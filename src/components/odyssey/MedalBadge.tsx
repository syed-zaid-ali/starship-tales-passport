import { motion } from "framer-motion";
import { Rocket, Star } from "lucide-react";
import type { Medal } from "@/lib/explorer";
import { MEDAL_STYLE } from "./icons";

const SIZES = {
  sm: { box: "w-10", disc: "size-10 border-[3px]", star: "size-4", ribbon: "h-4 w-2.5" },
  md: { box: "w-16", disc: "size-16 border-4", star: "size-7", ribbon: "h-6 w-4" },
  lg: { box: "w-32", disc: "size-32 border-[6px]", star: "size-14", ribbon: "h-12 w-8" },
} as const;

/** A cartoon medal on a ribbon. `medal = null` with `finished` shows a "Mission done" badge (no medal). */
export function MedalBadge({ medal, size = "md", finished = false, animate = false }: { medal: Medal | null; size?: keyof typeof SIZES; finished?: boolean; animate?: boolean }) {
  const z = SIZES[size];
  if (!medal) {
    return (
      <span className={`inline-flex flex-col items-center ${z.box}`} aria-label={finished ? "Finished, no medal" : "No medal yet"}>
        <span className={`grid place-items-center rounded-full border-dashed ${z.disc} ${finished ? "border-primary bg-muted text-primary" : "border-border bg-muted text-border"}`}>
          {finished ? <Rocket className={z.star} /> : <Star className={z.star} />}
        </span>
      </span>
    );
  }
  const m = MEDAL_STYLE[medal];
  return (
    <motion.span
      initial={animate ? { scale: 0, rotate: -180, y: -60 } : false}
      animate={{ scale: 1, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 11, delay: animate ? 0.15 : 0 }}
      className={`relative inline-flex flex-col items-center ${z.box}`}
      aria-label={m.label}
    >
      <span className="flex -space-x-0.5">
        <span className={`${z.ribbon} origin-bottom -rotate-12 rounded-b-sm bg-tone-sky-deep`} />
        <span className={`${z.ribbon} origin-bottom rotate-12 rounded-b-sm bg-tone-pink-deep`} />
      </span>
      <span className={`-mt-1 grid place-items-center rounded-full ${z.disc} ${m.face} ${m.ring} shadow-[inset_0_-6px_0_rgb(0_0_0/0.08)]`}>
        <Star className={`${z.star} ${m.text} fill-current`} />
      </span>
      {animate && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0.9, scale: 0.6 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
          className={`pointer-events-none absolute bottom-0 rounded-full border-4 ${m.ring} ${z.disc}`}
        />
      )}
    </motion.span>
  );
}
