import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { collectStar } from "@/lib/explorer";
import { celebrate, getExplorer, updateExplorer, useExplorer } from "@/lib/explorer-store";
import { sfx } from "@/lib/sfx";
import { STAR_IDS } from "./tones";

export function HiddenStar({ id, className = "" }: { id: (typeof STAR_IDS)[number]; className?: string }) {
  const found = useExplorer().stars.includes(id);
  return (
    <AnimatePresence>
      {!found && (
        <motion.button
          type="button"
          aria-label="A secret star! Tap to collect it"
          exit={{ scale: 2.4, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.3, rotate: 20 }}
          onClick={() => {
            if (updateExplorer((s) => collectStar(s, id))) {
              sfx.sparkle();
              const n = getExplorer().stars.length;
              celebrate({
                icon: "star",
                title: n === STAR_IDS.length ? "You found ALL the secret stars!" : "Secret star found!",
                subtitle: `+5 points · ${n} of ${STAR_IDS.length} stars`,
              });
            }
          }}
          className={`absolute z-20 grid size-10 cursor-pointer place-items-center rounded-full ${className}`}
        >
          <Star className="size-7 animate-twinkle fill-tone-sun text-tone-sun-deep drop-shadow-[0_0_10px_var(--tone-sun-deep)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
