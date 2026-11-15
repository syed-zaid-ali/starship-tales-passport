import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Chapter, Mission } from "@/data/missions";
import { useExplorer } from "@/lib/explorer-store";
import { HiddenStar } from "./HiddenStar";
import { MissionCard } from "./MissionCard";
import { QuizCard } from "./QuizCard";
import { TONE, type STAR_IDS } from "./tones";

type StarId = (typeof STAR_IDS)[number];
const STARS: Record<Chapter["id"], { id: StarId; className: string }[]> = {
  moon: [{ id: "moon-a", className: "left-[6%] top-[38%]" }, { id: "moon-b", className: "right-[8%] bottom-[18%]" }],
  mars: [{ id: "mars-a", className: "right-[10%] top-[30%]" }, { id: "mars-b", className: "left-[4%] bottom-[30%]" }],
  "deep-space": [{ id: "deep-a", className: "right-[14%] top-[55%]" }],
};

function ChapterHeader({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 1, 1.15]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const stickers = useExplorer().stickers;
  const got = chapter.missions.filter((mission) => stickers.includes(mission.id)).length;
  const tone = TONE[chapter.tone];

  return (
    <div ref={ref} className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
      <motion.div style={{ scale, rotate, y }} className="relative shrink-0">
        <div className={`absolute inset-6 rounded-full ${tone.bg} opacity-40 blur-3xl`} />
        <img src={chapter.planet} alt={`${chapter.planetName} as a smiling cartoon character`} width={816} height={816} loading="lazy" className="feather-mask relative w-64 md:w-80" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
        <span className={`inline-block rounded-full ${tone.bg} px-4 py-1 font-display text-sm font-bold uppercase tracking-widest text-ink`}>Chapter {chapter.number} · {chapter.years}</span>
        <h2 className="mt-3 font-display text-5xl font-bold leading-none md:text-7xl">{chapter.title}</h2>
        <p className="mt-4 max-w-lg text-lg font-semibold text-muted-foreground">{chapter.tagline}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-border bg-card/80 px-4 py-2 font-display text-sm font-semibold">
          {chapter.missions.map((mission) => <span key={mission.id} aria-hidden="true" className={`size-3 rounded-full ${stickers.includes(mission.id) ? "bg-success" : "bg-muted"}`} />)}
          <span className="ml-1">{got === chapter.missions.length ? "All mission stickers collected!" : `${got} of ${chapter.missions.length} stickers found`}</span>
        </div>
      </motion.div>
    </div>
  );
}

export function ChapterSection({ chapter, onOpen }: { chapter: Chapter; onOpen: (mission: Mission) => void }) {
  const line = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: line, offset: ["start 75%", "end 55%"] });

  return (
    <section id={chapter.id} className="relative overflow-hidden px-5 py-24 md:py-32">
      {STARS[chapter.id].map((star) => <HiddenStar key={star.id} id={star.id} className={star.className} />)}
      <ChapterHeader chapter={chapter} />
      <div ref={line} className="relative mx-auto mt-20 max-w-5xl">
        <div className="absolute bottom-0 left-5 top-0 w-2 -translate-x-1/2 rounded-full bg-muted md:left-1/2">
          <motion.div style={{ scaleY: scrollYProgress }} className="absolute inset-0 origin-top rounded-full bg-fuel" />
        </div>
        <ol className="space-y-16 md:space-y-24">
          {chapter.missions.map((mission, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            return <li key={mission.id} id={`mission-${mission.id}`} className="relative grid scroll-mt-28 md:grid-cols-2 md:gap-20">
              <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }} className={`absolute left-5 top-8 z-10 grid size-12 -translate-x-1/2 place-items-center rounded-full border-4 border-background ${TONE[mission.tone].bg} px-1 text-center font-display text-[10px] font-bold text-ink shadow-card-pop md:left-1/2`}>
                {mission.year}
              </motion.span>
              <div className={`pl-14 md:pl-0 ${side === "right" ? "md:col-start-2" : ""}`}><MissionCard mission={mission} side={side} onOpen={() => onOpen(mission)} /></div>
            </li>;
          })}
        </ol>
      </div>
      <QuizCard chapter={chapter} />
    </section>
  );
}
