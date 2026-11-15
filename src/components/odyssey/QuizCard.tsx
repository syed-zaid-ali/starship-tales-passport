import { motion } from "framer-motion";
import { Check, CircleHelp, Medal as MedalIcon, RotateCcw, Rocket, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import bleep from "@/assets/bleep-mascot.jpg";
import { Button } from "@/components/ui/button";
import type { Chapter, ChapterGame, SortItem } from "@/data/missions";
import { gameRecord, medalFor, recordAttempt } from "@/lib/explorer";
import { celebrate, getExplorer, updateExplorer, useExplorer } from "@/lib/explorer-store";
import { startLander, stepLander, type Lander, type LanderStatus } from "@/lib/lander";
import { MedalBadge } from "./MedalBadge";

function GameShell({ chapter, children }: { chapter: Chapter; children: React.ReactNode }) {
  const record = gameRecord(useExplorer(), chapter.game.id);
  return (
    <motion.section
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      aria-labelledby={`game-${chapter.game.id}`}
      className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-[2rem] border-4 border-primary/40 bg-card/95 p-5 shadow-card-pop backdrop-blur md:p-8"
    >
      <div className="absolute -right-10 -top-14 size-40 rounded-full bg-tone-pink/50 blur-3xl" />
      <div className="relative">
        <p className="inline-flex items-center gap-2 rounded-full bg-tone-sky px-4 py-1.5 font-display text-sm font-bold text-ink">
          <Sparkles className="size-4" /> Chapter challenge
        </p>
        <h3 id={`game-${chapter.game.id}`} className="mt-3 font-display text-3xl font-bold md:text-4xl">{chapter.game.title}</h3>
        <p className="mt-2 max-w-2xl font-semibold leading-relaxed text-muted-foreground">{chapter.game.intro}</p>
        <div className="mt-5">{children}</div>
        <p className="mt-5 flex items-center gap-2 text-sm font-bold text-muted-foreground" aria-live="polite">
          <MedalIcon className="size-4 text-primary" />
          {record.done ? `Challenge complete · ${record.attempts} ${record.attempts === 1 ? "try" : "tries"}` : `Attempts: ${record.attempts} · ${record.attempts < 3 ? `Gold is still possible on try ${record.attempts + 1}` : "Keep going — every explorer learns by trying"}`}
        </p>
      </div>
    </motion.section>
  );
}

function Result({ game, won, attempts, retry }: { game: ChapterGame; won: boolean; attempts: number; retry: () => void }) {
  const medal = won ? medalFor(attempts) : null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} className="mt-5 flex flex-wrap items-center gap-4 rounded-3xl border-2 border-primary/20 bg-muted p-4">
      <MedalBadge medal={medal} size="md" finished />
      <div className="min-w-0 flex-1">
        <p className="font-display text-xl font-bold">{won ? medal ? `${medal.charAt(0).toUpperCase()}${medal.slice(1)} medal earned!` : "Challenge complete!" : "A bumpy landing — try again!"}</p>
        <p className="font-semibold text-muted-foreground">{won ? medal ? `You did it on try ${attempts}. Your medal is saved in your explorer record.` : `You finished in ${attempts} tries. Medals are earned in the first three tries.` : `Try ${attempts + 1} is a fresh start. You can do it!`}</p>
      </div>
      {!won && <Button variant="chunky" onClick={retry}><RotateCcw /> Try again</Button>}
    </motion.div>
  );
}

function ChallengeGame({ chapter }: { chapter: Chapter }) {
  const game = chapter.game;
  const explorer = useExplorer();
  const record = gameRecord(explorer, game.id);
  const [result, setResult] = useState<"won" | "missed" | null>(record.done ? "won" : null);
  const [attempts, setAttempts] = useState(record.attempts);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [lander, setLander] = useState<Lander>(startLander);
  const [status, setStatus] = useState<LanderStatus>("flying");
  const [running, setRunning] = useState(false);
  const firing = useRef(false);

  const completeTry = (success: boolean) => {
    const next = recordAttempt(getExplorer(), game.id, success);
    updateExplorer(() => next);
    const count = gameRecord(next, game.id).attempts;
    setAttempts(count);
    setResult(success ? "won" : "missed");
    setRunning(false);
    firing.current = false;
    if (success) {
      const medal = gameRecord(next, game.id).medal;
      celebrate({ icon: medal ?? "finish", title: medal ? `${medal.charAt(0).toUpperCase()}${medal.slice(1)} medal!` : "Challenge complete!", subtitle: medal ? `Earned on try ${count}` : `Finished in ${count} tries`, big: true });
    }
  };

  useEffect(() => {
    if (game.type !== "landing" || !running || status !== "flying") return;
    const timer = window.setInterval(() => {
      setLander((current) => {
        const next = stepLander(current, firing.current, 0.06);
        if (next.status !== "flying") {
          setStatus(next.status);
          setRunning(false);
          completeTry(next.status === "landed");
        }
        return next.lander;
      });
    }, 60);
    return () => window.clearInterval(timer);
    // The timer is restarted only when a new flight starts or ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.type, running, status]);

  const reset = () => {
    setResult(null);
    setMessage("");
    setPlaced([]);
    setSelected(null);
    setQuestionIndex(0);
    setLander(startLander());
    setStatus("flying");
    firing.current = false;
  };

  const sort = (item: SortItem, bin: number) => {
    if (result || record.done) return;
    if (item.bin !== bin) {
      setMessage(item.why);
      completeTry(false);
      return;
    }
    const next = placed.includes(item.id) ? placed : [...placed, item.id];
    setPlaced(next);
    setSelected(null);
    setMessage(`That's right! ${item.why}`);
    if (game.type === "sorting" && next.length === game.items.length) completeTry(true);
  };

  const beginFlight = () => {
    reset();
    setLander(startLander());
    setRunning(true);
  };

  if (record.done && result !== "won") setResult("won");

  return (
    <GameShell chapter={chapter}>
      {game.type === "landing" && (
        <div className="rounded-3xl border-2 border-tone-sky-deep/30 bg-gradient-to-b from-tone-sky to-tone-moon p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><img src={game.craft} alt={game.craftName} className="size-14 rounded-2xl border-2 border-white/80 object-cover" /><p className="font-display text-xl font-bold">{game.craftName} landing zone</p></div>
            <span className="rounded-full bg-card/80 px-3 py-1 font-bold">{status === "landed" ? "Safe landing!" : status === "crashed" ? "Bumpy landing" : running ? "Descending" : "Ready"}</span>
          </div>
          <div className="relative mb-4 h-56 overflow-hidden rounded-3xl border-2 border-white/80 bg-gradient-to-b from-tone-sky/70 to-tone-orange/70">
            <div className="absolute inset-x-0 bottom-0 h-8 rounded-t-[50%] bg-tone-orange-deep/50" />
            <motion.img src={game.craft} alt="" className="absolute left-1/2 z-10 size-16 -translate-x-1/2 rounded-2xl object-cover" animate={{ bottom: `${Math.min(78, Math.max(8, lander.height * 0.72))}%`, rotate: running ? [-3, 3, -3] : 0 }} transition={{ rotate: { repeat: running ? Infinity : 0, duration: 0.4 } }} />
            <div className="absolute left-3 top-3 rounded-2xl bg-card/90 px-3 py-2 text-sm font-bold">Height {Math.max(0, Math.round(lander.height))} m<br />Speed {Math.max(0, lander.speed).toFixed(1)} m/s<br />Fuel {Math.round(lander.fuel)}%</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!running ? <Button variant="chunky" size="xl" onClick={beginFlight} disabled={record.done}><Rocket /> {record.attempts ? "Start a new landing" : "Start landing"}</Button> : <button type="button" onPointerDown={(event) => { event.preventDefault(); firing.current = true; }} onPointerUp={() => { firing.current = false; }} onPointerLeave={() => { firing.current = false; }} onPointerCancel={() => { firing.current = false; }} className="min-h-16 touch-none rounded-full border-4 border-tone-pink-deep bg-tone-pink px-8 font-display text-xl font-bold text-ink shadow-[0_6px_0_var(--tone-pink-deep)] active:translate-y-1 active:shadow-none">Hold to fire</button>}
          </div>
          <p className="mt-3 text-center text-sm font-bold text-ink/70">Hold the thruster to slow down. Release to save fuel.</p>
        </div>
      )}

      {game.type === "sorting" && (
        <div>
          <div className="grid gap-3 md:grid-cols-2">
            {game.bins.map((bin, binIndex) => (
              <button key={bin} type="button" onClick={() => { const item = game.items.find((candidate) => candidate.id === selected); if (item) sort(item, binIndex); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const item = game.items.find((candidate) => candidate.id === event.dataTransfer.getData("text/plain")); if (item) sort(item, binIndex); }} className="min-h-28 rounded-3xl border-4 border-dashed border-primary/50 bg-tone-sky/50 p-4 text-left font-display text-lg font-bold transition hover:bg-tone-pink/50 focus-visible:outline-4 focus-visible:outline-primary">
                <span className="block">{bin}</span><span className="mt-2 block text-sm font-semibold text-muted-foreground">Drop or select a traveler, then tap here.</span>
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {game.items.filter((item) => !placed.includes(item.id)).map((item) => (
              <button key={item.id} type="button" draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)} onClick={() => setSelected(selected === item.id ? null : item.id)} aria-pressed={selected === item.id} className={`rounded-2xl border-2 bg-card p-3 text-left font-display text-sm font-bold shadow-sm transition hover:-translate-y-1 ${selected === item.id ? "border-primary ring-4 ring-primary/20" : "border-border"}`}>
                {item.image && <img src={item.image} alt="" className="mb-2 aspect-video w-full rounded-xl object-cover" />}{item.label}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-3 min-h-6 font-semibold text-muted-foreground">{message || `${placed.length} of ${game.items.length} sorted`}</p>
        </div>
      )}

      {game.type === "quiz" && (() => {
        const question = game.questions[questionIndex];
        return question ? <div className="rounded-3xl bg-tone-moon/60 p-5">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-primary">Question {questionIndex + 1} of {game.questions.length}</p>
          <h4 className="mt-2 font-display text-2xl font-bold">{question.question}</h4>
          <div className="mt-4 grid gap-2">
            {question.options.map((option, index) => <button key={option} type="button" disabled={!!result || record.done} onClick={() => {
              if (index !== question.answer) { setMessage(`Not quite. ${question.explain}`); completeTry(false); return; }
              setMessage(question.explain);
              if (questionIndex === game.questions.length - 1) completeTry(true); else setQuestionIndex(questionIndex + 1);
            }} className="flex min-h-12 items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3 text-left font-display font-bold transition hover:border-primary hover:bg-tone-sky/50 disabled:opacity-70"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-tone-pink">{index + 1}</span>{option}</button>)}
          </div>
          <p aria-live="polite" className="mt-3 min-h-6 font-semibold text-muted-foreground">{message}</p>
        </div> : null;
      })()}

      {result && <Result game={game} won={result === "won"} attempts={attempts} retry={reset} />}
      {record.done && !result && <div className="flex items-center gap-2 font-display font-bold"><Check /> Challenge already completed.</div>}
    </GameShell>
  );
}

export function QuizCard({ chapter }: { chapter: Chapter }) {
  return <ChallengeGame chapter={chapter} />;
}
