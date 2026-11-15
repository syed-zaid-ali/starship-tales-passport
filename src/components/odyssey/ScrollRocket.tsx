import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { Earth, Moon, Orbit, Rocket, Telescope, Trophy } from "lucide-react";
import { useState } from "react";
import { scrollToId, useActiveSection } from "./use-active-section";

const STOPS = [
  { id: "earth", label: "Earth", at: 0, Icon: Earth },
  { id: "moon", label: "Moon", at: 0.25, Icon: Moon },
  { id: "deep-space", label: "Deep Space", at: 0.5, Icon: Telescope },
  { id: "mars", label: "Mars", at: 0.75, Icon: Orbit },
  { id: "finale", label: "Finish", at: 1, Icon: Trophy },
] as const;

/** A pastel mission guide whose rocket follows the reader through every chapter. */
export function ScrollRocket() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const top = useTransform(progress, [0, 1], ["0%", "100%"]);
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => setPercent(Math.round(value * 100)));
  const active = useActiveSection();

  return <>
    <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[55] h-1.5 origin-left bg-launch lg:hidden" />
    <aside aria-label="Journey progress" className="fixed right-5 top-1/2 z-40 hidden h-[62vh] -translate-y-1/2 lg:block">
      <div className="relative h-full w-3 rounded-full bg-muted">
        <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top rounded-full bg-fuel" />
        {STOPS.map(({ id, label, at, Icon }) => <button key={id} type="button" onClick={() => scrollToId(id)} aria-label={`Fly to ${label}`} style={{ top: `${at * 100}%` }} className={`group absolute left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 transition-transform hover:scale-110 ${active === id ? "border-primary bg-card glow-sun" : "border-border bg-card"}`}>
          <Icon className="size-4 text-primary" />
          <span className="pointer-events-none absolute right-11 whitespace-nowrap rounded-full bg-card px-2 py-0.5 font-display text-xs font-semibold opacity-0 shadow-card-pop transition-opacity group-hover:opacity-100">{label}</span>
        </button>)}
        <motion.div style={{ top }} className="pointer-events-none absolute -left-9 -translate-y-1/2"><div className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-card-pop"><Rocket className="size-4 rotate-[135deg]" /></div></motion.div>
      </div>
      <p className="mt-4 -translate-x-1/3 text-center font-display text-xs font-bold text-primary">{percent}%</p>
    </aside>
  </>;
}
