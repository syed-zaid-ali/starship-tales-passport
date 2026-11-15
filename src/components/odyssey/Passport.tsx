import { motion } from "framer-motion";
import { Lock, Printer, RotateCcw, Star, Trophy } from "lucide-react";
import { useState } from "react";
import bleep from "@/assets/bleep-mascot.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ALL_MISSIONS, CHAPTERS } from "@/data/missions";
import { DEFAULT_STATE, isCertified, passportProgress, rankFor } from "@/lib/explorer";
import { updateExplorer, useExplorer } from "@/lib/explorer-store";
import { sfx } from "@/lib/sfx";
import { STAR_IDS, TONE } from "./tones";
import { scrollToId } from "./use-active-section";

const MISSION_IDS = ALL_MISSIONS.map((m) => m.id);

export function RankCard() {
  const s = useExplorer();
  const r = rankFor(s);
  return (
    <div className="rounded-3xl border-2 border-border bg-muted p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-14 place-items-center rounded-2xl bg-launch text-3xl">{r.emoji}</span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your rank</p>
          <p className="font-display text-2xl font-bold leading-tight">{r.title}</p>
        </div>
        <p className="text-right font-display text-2xl font-bold text-primary">
          {r.points}
          <span className="block text-xs text-muted-foreground">points</span>
        </p>
      </div>
      <div className="mt-3 h-4 overflow-hidden rounded-full bg-night/60">
        <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ type: "spring", stiffness: 60 }} className="h-full rounded-full bg-launch" />
      </div>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">
        {r.next ? `${r.toNext} more points to become a ${r.next.title} ${r.next.emoji}` : "Top rank reached — you're a legend! 🌟"}
      </p>
    </div>
  );
}

export function Passport({ open, onOpenChange, onCertificate }: { open: boolean; onOpenChange: (o: boolean) => void; onCertificate: () => void }) {
  const s = useExplorer();
  const { collected, total } = passportProgress(s, ALL_MISSIONS.length);
  const certified = isCertified(s, MISSION_IDS);
  const left = MISSION_IDS.length - s.stickers.length;

  const find = (id: string) => {
    onOpenChange(false);
    setTimeout(() => scrollToId(`mission-${id}`), 250);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-l-4 border-primary bg-card p-5 sm:max-w-md">
        <SheetTitle className="font-display text-3xl font-bold">Space Passport</SheetTitle>
        <SheetDescription className="font-semibold text-muted-foreground">
          {s.name ? `Explorer ${s.name}` : "Unnamed explorer"} · {collected} of {total} stickers
        </SheetDescription>

        <div className="mt-5">
          <RankCard />
        </div>

        <h3 className="mt-6 font-display text-lg font-bold">Mission stickers</h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center ${s.name ? "border-primary bg-muted" : "border-dashed border-border"}`}>
            <img src={bleep} alt="" width={816} height={816} className={`aspect-square w-full rounded-xl object-cover ${s.name ? "" : "opacity-30 grayscale"}`} />
            <span className="font-display text-xs font-bold">Cadet</span>
          </div>
          {ALL_MISSIONS.map((m) => {
            const got = s.stickers.includes(m.id);
            return (
              <motion.button
                key={m.id}
                type="button"
                whileHover={{ rotate: got ? -4 : 0, scale: 1.05 }}
                onClick={() => (got ? sfx.pop() : find(m.id))}
                className={`relative flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center ${got ? `${TONE[m.tone].border} bg-muted` : "border-dashed border-border"}`}
                aria-label={got ? `${m.name} sticker` : `Locked: find the ${m.year} mission`}
              >
                <img src={m.image} alt="" width={816} height={816} loading="lazy" className={`aspect-square w-full rounded-xl object-cover ${got ? "" : "opacity-25 blur-[3px] grayscale"}`} />
                {!got && (
                  <span className="absolute inset-x-2 top-2 grid aspect-square place-items-center">
                    <Lock className="size-6 text-muted-foreground" />
                  </span>
                )}
                <span className="font-display text-xs font-bold leading-tight">{got ? m.name : `${m.year} · Find it!`}</span>
              </motion.button>
            );
          })}
        </div>

        <h3 className="mt-6 font-display text-lg font-bold">Secret stars</h3>
        <div className="mt-2 flex gap-1.5">
          {STAR_IDS.map((id) => (
            <Star key={id} className={`size-7 ${s.stars.includes(id) ? "fill-primary text-primary" : "text-border"}`} />
          ))}
        </div>

        <h3 className="mt-6 font-display text-lg font-bold">Pop quizzes</h3>
        <ul className="mt-2 space-y-1.5">
          {CHAPTERS.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm font-bold">
              {c.title}
              <span>{s.quizzes.includes(c.id) ? "✅ Solved" : "❔ Not yet"}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-3xl border-2 border-dashed border-primary p-4 text-center">
          {certified ? (
            <>
              <p className="font-display text-lg font-bold">Every sticker collected! 🎉</p>
              <Button variant="chunky" size="xl" className="mt-3 w-full" onClick={onCertificate}>
                <Trophy /> Get my certificate
              </Button>
            </>
          ) : (
            <p className="font-display text-base font-semibold">
              Collect <span className="text-primary">{left} more</span> mission sticker{left === 1 ? "" : "s"} to earn your Official Explorer Certificate 🏆
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm("Start over? This clears your stickers, stars and name.")) updateExplorer(() => ({ ...DEFAULT_STATE }));
          }}
          className="mx-auto mt-6 flex cursor-pointer items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" /> Start over (for grown-ups)
        </button>
      </SheetContent>
    </Sheet>
  );
}

export function Certificate({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const s = useExplorer();
  const [date] = useState(() => new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }));
  const r = rankFor(s);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl rounded-4xl border-0 bg-transparent p-0 shadow-none sm:rounded-4xl">
        <div className="print-area chat-surface rounded-4xl border-8 border-double border-tone-sun-deep p-8 text-center md:p-12">
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-tone-sun-deep">Odyssey Space Academy</p>
          <DialogTitle className="mt-3 font-display text-4xl font-bold md:text-5xl">Official Explorer Certificate</DialogTitle>
          <DialogDescription className="mt-4 text-base font-semibold text-ink/70">This certifies that</DialogDescription>
          <p className="mt-2 font-display text-5xl font-bold text-tone-pink-deep md:text-6xl">{s.name || "Explorer"}</p>
          <p className="mx-auto mt-4 max-w-md text-lg font-semibold">
            travelled to the Moon, Mars and Deep Space, met {ALL_MISSIONS.length} amazing spacecraft, and earned the rank of
          </p>
          <p className="mt-2 font-display text-3xl font-bold">
            {r.emoji} {r.title}
          </p>
          <div className="mt-8 flex items-end justify-between gap-4 text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">Date</p>
              <p className="font-display font-bold">{date}</p>
            </div>
            <img src={bleep} alt="Bleep's seal of approval" width={816} height={816} className="size-20 rounded-full border-4 border-tone-sun object-cover" />
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">Signed</p>
              <p className="font-display font-bold">Bleep, Robot Guide</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <Button variant="chunky" size="xl" onClick={() => window.print()}>
            <Printer /> Print it & stick it on the wall!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
