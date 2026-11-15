import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronRight, Gift, Rocket, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ALL_MISSIONS, SPEAKERS, type ChatLine, type Mission } from "@/data/missions";
import { collectSticker, passportProgress } from "@/lib/explorer";
import { celebrate, getExplorer, updateExplorer, useExplorer } from "@/lib/explorer-store";
import { sfx, speak, stopSpeaking } from "@/lib/sfx";
import { TONE } from "./tones";

/** Shouty words like TWICE or FIRST get a bigger, bouncier font. */
function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(\b[A-Z]{3,}\b!?)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^[A-Z]{3,}!?$/.test(p) ? (
          <span key={i} className="font-display text-[1.15em] font-bold tracking-wide">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function Bubble({ line, right, readAloud }: { line: ChatLine; right: boolean; readAloud: boolean }) {
  const sp = SPEAKERS[line.speaker];
  const t = TONE[sp.tone];
  const [talking, setTalking] = useState(false);
  const say = () => {
    setTalking(true);
    if (!speak(line.text, sp.pitch, sp.rate, () => setTalking(false))) setTalking(false);
  };
  useEffect(() => {
    if (readAloud) say();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className={`flex items-end gap-3 ${right ? "flex-row-reverse" : ""}`}
    >
      <motion.img
        src={sp.avatar}
        alt={sp.name}
        width={816}
        height={816}
        animate={talking ? { y: [0, -6, 0] } : {}}
        transition={{ repeat: talking ? Infinity : 0, duration: 0.4 }}
        className={`size-14 shrink-0 rounded-full border-4 ${t.border} bg-chat object-cover md:size-16`}
      />
      <div className={`flex max-w-[80%] flex-col ${right ? "items-end" : "items-start"}`}>
        <span className="mb-1 px-2 font-display text-xs font-bold uppercase tracking-wider opacity-70">{sp.name}</span>
        <div
          className={`rounded-3xl ${right ? "rounded-br-md" : "rounded-bl-md"} ${t.bg} ${t.pop} px-4 py-3 text-base font-bold leading-snug text-ink md:text-lg`}
        >
          <Emphasis text={line.text} />
        </div>
        <button
          type="button"
          onClick={say}
          className="mt-1.5 flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold opacity-60 hover:bg-ink/10 hover:opacity-100"
        >
          <Volume2 className="size-3.5" /> {talking ? "Talking…" : "Hear it"}
        </button>
      </div>
    </motion.div>
  );
}

function Typing({ right, speaker }: { right: boolean; speaker: ChatLine["speaker"] }) {
  const sp = SPEAKERS[speaker];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex items-end gap-3 ${right ? "flex-row-reverse" : ""}`}>
      <img src={sp.avatar} alt="" width={816} height={816} className={`size-14 rounded-full border-4 ${TONE[sp.tone].border} object-cover opacity-70 md:size-16`} />
      <div className="flex gap-1.5 rounded-3xl bg-ink/10 px-5 py-4">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }} className="size-2.5 rounded-full bg-ink/60" />
        ))}
      </div>
    </motion.div>
  );
}

function FunFact({ mission, dark }: { mission: Mission; dark?: boolean }) {
  const already = useExplorer().stickers.includes(mission.id);
  const [open, setOpen] = useState(false);

  const reveal = () => {
    setOpen(true);
    if (updateExplorer((s) => collectSticker(s, mission.id))) {
      sfx.win();
      const { collected, total } = passportProgress(getExplorer(), ALL_MISSIONS.length);
      celebrate({
        icon: "sticker",
        title: "New sticker unlocked!",
        subtitle: `${mission.name} · ${collected} of ${total} in your passport`,
        big: true,
      });
    } else sfx.sparkle();
  };

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <motion.button
          key="locked"
          type="button"
          onClick={reveal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex w-full cursor-pointer items-center gap-4 rounded-3xl border-4 border-dashed border-tone-sun-deep bg-tone-sun p-4 text-left text-ink animate-glow-pulse"
        >
          <motion.span animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.4, repeatDelay: 1 }} className="grid size-14 shrink-0 place-items-center rounded-2xl bg-chat">
            <Gift className="size-8" />
          </motion.span>
          <span>
            <span className="block font-display text-xl font-bold">Tap to unlock the secret Fun Fact!</span>
            <span className="text-sm font-bold opacity-75">{already ? "You already own this sticker ✓" : "…and win the mission sticker 🏅"}</span>
          </span>
        </motion.button>
      ) : (
        <motion.div
          key="open"
          initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
          className={`relative overflow-hidden rounded-3xl border-4 border-primary p-5 animate-glow-pulse ${dark ? "bg-primary/10 text-foreground" : "bg-chat text-ink"}`}
        >
          <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-tone-sun-deep">
            <Sparkles className="size-5" /> Fun Fact
          </p>
          <p className="mt-2 text-lg font-bold leading-snug">{mission.funFact}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StoryChat({ mission }: { mission: Mission }) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(true);
  const [readAloud, setReadAloud] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const done = shown >= mission.story.length;

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => {
      setTyping(false);
      setShown((n) => n + 1);
      sfx.pop();
    }, shown === 0 ? 700 : 900);
    return () => clearTimeout(t);
  }, [typing, shown]);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [shown, typing]);

  useEffect(() => () => stopSpeaking(), []);

  const nextSpeaker = mission.story[shown]?.speaker;

  return (
    <div className="chat-surface flex max-h-[68vh] flex-col">
      <div ref={box} className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
        {mission.story.slice(0, shown).map((line, i) => (
          <Bubble key={i} line={line} right={line.speaker !== mission.host} readAloud={readAloud} />
        ))}
        <AnimatePresence>{typing && nextSpeaker && <Typing right={nextSpeaker !== mission.host} speaker={nextSpeaker} />}</AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2">
            <FunFact mission={mission} />
          </motion.div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t-2 border-ink/10 bg-chat px-4 py-3">
        <button
          type="button"
          onClick={() => {
            if (readAloud) stopSpeaking();
            setReadAloud(!readAloud);
          }}
          aria-pressed={readAloud}
          className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 px-3 py-2 font-display text-sm font-bold ${readAloud ? "border-tone-teal-deep bg-tone-teal" : "border-ink/20"}`}
        >
          {readAloud ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          Read to me
        </button>
        {!done && (
          <Button variant="chunky" size="lg" className="h-12 text-base" disabled={typing} onClick={() => setTyping(true)}>
            What happens next? <ChevronRight />
          </Button>
        )}
        {done && <span className="font-display text-sm font-bold opacity-60">The end! ✨</span>}
      </div>
    </div>
  );
}

function FactView({ mission }: { mission: Mission }) {
  return (
    <div className="max-h-[68vh] space-y-5 overflow-y-auto bg-card p-5 md:p-7">
      <div className="grid grid-cols-3 gap-2">
        {mission.quickFacts.map((f) => (
          <div key={f.label} className="rounded-2xl border-2 border-border bg-muted p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{f.label}</p>
            <p className="mt-1 font-display text-base font-bold leading-tight md:text-lg">{f.value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3 text-base leading-relaxed text-foreground/90 md:text-lg">
        {mission.history.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <FunFact mission={mission} dark />
    </div>
  );
}

export function MissionModal({ mission, onClose }: { mission: Mission | null; onClose: () => void }) {
  const story = useExplorer().storyMode;
  return (
    <Dialog open={!!mission} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[94vh] w-[calc(100vw-1.5rem)] max-w-2xl gap-0 overflow-hidden rounded-4xl border-4 border-primary bg-card p-0 sm:rounded-4xl [&>button:last-child]:hidden">
        {mission && (
          <>
            <div className="flex items-center gap-3 bg-card p-4 pr-3">
              <img src={mission.image} alt="" width={816} height={816} className={`size-14 rounded-2xl border-4 ${TONE[mission.tone].border} object-cover`} />
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate font-display text-2xl font-bold">{mission.name}</DialogTitle>
                <DialogDescription className="font-display text-sm font-semibold text-primary">
                  Mission year {mission.year} · {story ? "Story Mode" : "Fact Mode"}
                </DialogDescription>
              </div>
              <div className="flex rounded-full border-2 border-border bg-muted p-1" role="group" aria-label="Choose how to read">
                {[
                  { on: true, icon: Rocket, label: "Story" },
                  { on: false, icon: BookOpen, label: "Facts" },
                ].map(({ on, icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={story === on}
                    onClick={() => {
                      sfx.click();
                      updateExplorer((s) => ({ ...s, storyMode: on }));
                    }}
                    className={`flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 font-display text-xs font-bold sm:text-sm ${
                      story === on ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
              <DialogClose className="grid size-10 cursor-pointer place-items-center rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground" aria-label="Close">
                <X className="size-5" />
              </DialogClose>
            </div>
            {story ? <StoryChat key={`s-${mission.id}`} mission={mission} /> : <FactView key={`f-${mission.id}`} mission={mission} />}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
