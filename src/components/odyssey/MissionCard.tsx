import { motion } from "framer-motion";
import { CheckCircle2, CircleHelp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/data/missions";
import { useExplorer } from "@/lib/explorer-store";
import { sfx } from "@/lib/sfx";
import { TONE } from "./tones";

export function MissionCard({ mission, onOpen, side }: { mission: Mission; onOpen: () => void; side: "left" | "right" }) {
  const collected = useExplorer().stickers.includes(mission.id);
  const tone = TONE[mission.tone];
  return (
    <motion.article initial={{ opacity: 0, x: side === "left" ? -90 : 90, rotate: side === "left" ? -5 : 5, scale: 0.9 }} whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 90, damping: 14 }} whileHover={{ y: -6, rotate: side === "left" ? -1 : 1 }} className={`group relative rounded-4xl border-4 ${tone.border} bg-card p-3 shadow-card-pop`}>
      <button type="button" onClick={() => { sfx.pop(); onOpen(); }} aria-label={`Open ${mission.name} story`} className={`relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-3xl ${tone.bg}`}>
        <img src={mission.image} alt={`Cartoon illustration of ${mission.name}`} width={816} height={816} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className={`absolute left-3 top-3 rounded-full bg-chat px-3 py-1 font-display text-lg font-bold text-ink ${tone.pop}`}>{mission.year}</span>
        {collected && <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: -12 }} className="absolute right-3 top-3 flex items-center gap-1 rounded-full border-2 border-success bg-chat px-3 py-1 font-display text-sm font-bold text-ink"><CheckCircle2 className="size-4 text-success" /> Sticker!</motion.span>}
      </button>
      <div className="px-2 pb-2 pt-4">
        <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">{mission.name}</h3>
        <p className="mt-1 flex items-start gap-2 text-base font-semibold text-muted-foreground"><CircleHelp aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />{mission.teaser}</p>
        <Button variant={collected ? "chunky-ghost" : "chunky"} size="xl" className="mt-4 w-full" onClick={() => { sfx.pop(); onOpen(); }}><Sparkles /> Mission Details</Button>
      </div>
    </motion.article>
  );
}
