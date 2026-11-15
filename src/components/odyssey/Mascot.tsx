import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import bleep from "@/assets/bleep-mascot.jpg";
import { ALL_MISSIONS } from "@/data/missions";
import { isCertified, passportProgress } from "@/lib/explorer";
import { useExplorer } from "@/lib/explorer-store";
import { STAR_IDS } from "./tones";
import { useActiveSection } from "./use-active-section";

/** Bleep the robot guide: a friendly voice that nudges explorers toward the next goal. */
export function Mascot() {
  const s = useExplorer();
  const active = useActiveSection();
  const [open, setOpen] = useState(true);
  const { collected, total } = passportProgress(s, ALL_MISSIONS.length);
  const left = total - collected;
  const starsLeft = STAR_IDS.length - s.stars.length;
  const who = s.name ? s.name : "explorer";

  const messages: Record<typeof active, string> = {
    earth: s.name ? `Hi ${s.name}! I'm Bleep. Scroll down and I'll fly with you!` : "Hi! I'm Bleep, your robot guide. Type your explorer name up there!",
    moon: "Tap “Mission Details” and the spaceships will TALK to you!",
    mars:
      starsLeft > 0
        ? `Psst, ${who}… ${starsLeft} secret stars are hiding on this page. Can you spot them?`
        : `WOW, you found every secret star! You have super eyes, ${who}!`,
    "deep-space": left > 0 ? `We're SO far from home! Only ${left} more sticker${left === 1 ? "" : "s"} to go!` : "You've got every sticker! Fly to the finish line!",
    finale: isCertified(s, ALL_MISSIONS.map((m) => m.id))
      ? `You did it, ${who}! Grab your certificate!`
      : "So close! Open your passport to find the missing stickers.",
  };

  // Pop up with a fresh tip on every new section, then tuck away so it never blocks reading.
  useEffect(() => {
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 9000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-end gap-2">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide Bleep's tip" : "Show Bleep's tip"}
        whileHover={{ rotate: -8, scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-full border-4 border-primary bg-card glow-sun md:size-20"
      >
        <img src={bleep} alt="" width={816} height={816} className="size-full scale-125 object-cover object-top" />
      </motion.button>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={active + messages[active]}
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative mb-6 max-w-[15rem] rounded-3xl rounded-bl-md chat-surface py-3 pl-4 pr-8 font-display text-sm font-semibold leading-snug shadow-[0_5px_0_var(--tone-sun-deep)] md:max-w-xs md:text-base"
            role="status"
          >
            {messages[active]}
            <button type="button" onClick={() => setOpen(false)} aria-label="Close tip" className="absolute right-2 top-2 cursor-pointer rounded-full p-0.5 opacity-50 hover:opacity-100">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
