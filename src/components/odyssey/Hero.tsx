import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Hand, Rocket, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import bleep from "@/assets/bleep-mascot.jpg";
import earth from "@/assets/char-earth.jpg";
import rocket from "@/assets/rocket.png";
import { Button } from "@/components/ui/button";
import { celebrate, updateExplorer, useExplorer } from "@/lib/explorer-store";
import { sfx } from "@/lib/sfx";
import { Cloud } from "./Cloud";
import { HiddenStar } from "./HiddenStar";
import { scrollToId } from "./use-active-section";

function BouncyWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  return (
    <span className={`inline-flex ${className ?? ""}`} aria-hidden>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: 80, opacity: 0, rotate: -12 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: delay + i * 0.05 }}
          whileHover={{ y: -14, rotate: i % 2 ? 8 : -8, transition: { type: "spring", stiffness: 500 } }}
          className="inline-block cursor-default"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

const STEPS = ["3", "2", "1", "go"] as const;
const STEP_MS = 1000;

/** Shows 3, then 2, then 1 (one full second each), then BLAST OFF. */
function Countdown({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  useEffect(() => {
    if (current === "go") sfx.launch();
    else sfx.beep();
    const t = setTimeout(() => {
      if (step >= STEPS.length - 1) onDone();
      else setStep(step + 1);
    }, current === "go" ? 1100 : STEP_MS);
    return () => clearTimeout(t);
  }, [step, current, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[80] grid place-items-center bg-night/80 backdrop-blur-md"
    >
      <div className="grid place-items-center">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="text-center [grid-area:1/1]"
          >
            {current !== "go" ? (
              <span className="font-display text-[10rem] font-bold leading-none text-title-gradient md:text-[14rem]">{current}</span>
            ) : (
              <span className="flex flex-col items-center gap-4">
                <img src={rocket} alt="" width={768} height={1024} className="w-28 md:w-36" />
                <span className="font-display text-6xl font-bold text-title-gradient md:text-8xl">BLAST OFF!</span>
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Pinned lift-off scene: as you scroll, the title flies toward you, the clouds part like curtains,
 * Earth drops away and the rocket blasts up through the sky.
 */
export function Hero() {
  const { name } = useExplorer();
  const [draft, setDraft] = useState("");
  const [counting, setCounting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const titleScale = useTransform(p, [0, 0.4], [1, 1.9]);
  const titleOpacity = useTransform(p, [0, 0.28], [1, 0]);
  const titleY = useTransform(p, [0, 0.4], [0, -140]);
  const earthY = useTransform(p, [0, 0.7], ["0%", "75%"]);
  const earthScale = useTransform(p, [0, 0.7], [1, 0.45]);
  const earthRotate = useTransform(p, [0, 1], [0, -40]);
  const leftClouds = useTransform(p, [0, 0.5], ["0%", "-90%"]);
  const rightClouds = useTransform(p, [0, 0.5], ["0%", "90%"]);
  const floorClouds = useTransform(p, [0, 0.6], ["0%", "120%"]);
  const cloudScale = useTransform(p, [0, 0.5], [1, 1.5]);
  const rocketY = useTransform(p, [0.08, 0.95], ["70vh", "-120vh"]);
  const rocketScale = useTransform(p, [0.08, 0.5], [0.55, 1.1]);
  const rocketRotate = useTransform(p, [0.1, 0.3, 0.5, 0.7, 0.9], [0, -4, 3, -3, 0]);
  const captionOpacity = useTransform(p, [0.32, 0.45, 0.78, 0.92], [0, 1, 1, 0]);
  const captionScale = useTransform(p, [0.32, 0.5], [0.7, 1]);
  const dusk = useTransform(p, [0.2, 1], [0, 1]);
  const speedLines = useTransform(p, [0.25, 0.45, 0.9, 1], [0, 1, 1, 0]);
  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const bleepY = useTransform(p, [0, 0.4], ["0vh", "-70vh"]);
  const bleepRotate = useTransform(p, [0, 0.4], [0, 25]);

  const m = reduce ? undefined : true;

  const finishCountdown = useCallback(() => {
    setCounting(false);
    scrollToId("moon");
  }, []);

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = draft.replace(/[^\p{L}\p{N} '-]/gu, "").trim().slice(0, 16);
    if (!clean) return;
    updateExplorer((s) => ({ ...s, name: clean }));
    sfx.win();
    celebrate({ icon: "welcome", title: `Welcome, Cadet ${clean}!`, subtitle: "Your first sticker is in your Space Passport", big: true });
  };

  return (
    <section id="earth" ref={ref} className={`relative ${reduce ? "" : "h-[260svh]"}`}>
      <div className="sticky top-0 h-svh min-h-[40rem] overflow-hidden">
        {/* Sky slowly turns from candy-pink morning to dreamy space lilac */}
        <motion.div aria-hidden style={!m ? {} : { opacity: dusk }} className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.82_0.07_285),oklch(0.86_0.06_260)_60%,transparent)]" />

        {/* Speed lines once we're flying */}
        <motion.div aria-hidden style={!m ? {} : { opacity: speedLines }} className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="absolute top-0 w-1 rounded-full bg-card/80"
              style={{
                left: `${(i * 37) % 100}%`,
                height: `${12 + ((i * 13) % 18)}vh`,
                animation: `speed-line ${0.6 + ((i * 7) % 5) / 10}s ${(i % 5) / 10}s linear infinite`,
              }}
            />
          ))}
        </motion.div>

        <motion.img
          src={earth}
          alt="A smiling cartoon planet Earth waving hello"
          width={816}
          height={816}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={!m ? {} : { y: earthY, scale: earthScale, rotate: earthRotate }}
          className="feather-mask pointer-events-none absolute -bottom-44 -right-36 w-[34rem] max-w-none md:-right-24 md:w-[46rem]"
        />

        {/* Cloud curtains */}
        <motion.div style={!m ? {} : { x: leftClouds, scale: cloudScale }} className="pointer-events-none absolute -left-24 top-[18%] w-[26rem] md:w-[34rem]">
          <Cloud className="w-full animate-drift" />
          <Cloud className="-mt-10 ml-40 w-2/3" tint="bg-tone-pink" />
        </motion.div>
        <motion.div style={!m ? {} : { x: rightClouds, scale: cloudScale }} className="pointer-events-none absolute -right-28 top-[8%] w-[22rem] md:w-[30rem]">
          <Cloud className="w-full" tint="bg-tone-sky" />
          <Cloud className="-mt-8 w-1/2 animate-drift" />
        </motion.div>
        <motion.div style={!m ? {} : { y: floorClouds }} className="pointer-events-none absolute inset-x-0 -bottom-16 z-20 flex justify-center gap-0">
          <Cloud className="-mr-16 w-[22rem]" />
          <Cloud className="-mr-16 w-[28rem]" tint="bg-tone-moon" />
          <Cloud className="w-[24rem]" />
        </motion.div>

        {/* The rocket blasting off through the middle */}
        <motion.div
          aria-hidden
          style={!m ? {} : { y: rocketY, scale: rocketScale, rotate: rocketRotate }}
          className="pointer-events-none absolute left-1/2 top-0 z-10 -ml-14 w-28 md:-ml-20 md:w-40"
          initial={false}
        >
          <img src={rocket} alt="" width={768} height={1024} className="relative z-10 w-full" />
          <span className="absolute left-1/2 top-[86%] -ml-[18%] h-[60%] w-[36%] origin-top animate-flame rounded-b-full bg-[linear-gradient(180deg,var(--tone-sun),var(--tone-orange),var(--tone-pink),transparent)] blur-[2px]" />
          <span className="absolute left-1/2 top-[95%] -ml-[30%] h-[120%] w-[60%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--card)_90%,transparent),transparent)]" />
        </motion.div>

        <HiddenStar id="hero" className="right-[12%] top-[22%]" />

        {/* Mid-flight caption */}
        <motion.div style={!m ? {} : { opacity: captionOpacity, scale: captionScale }} className="pointer-events-none absolute inset-x-0 top-[16%] z-30 px-5 text-center" initial={{ opacity: 0 }}>
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold uppercase tracking-widest text-primary shadow-card-pop">
            <Sparkles className="size-4" /> Time machine on
          </p>
          <p className="mt-4 font-display text-5xl font-bold leading-none text-title-gradient md:text-8xl">Next stop: 1967</p>
          <p className="mx-auto mt-3 max-w-md font-display text-lg font-semibold text-foreground/80">
            {name ? `Hold on tight, Cadet ${name}!` : "Hold on tight, explorer!"} We're flying back in time to meet the very first Moon robot.
          </p>
        </motion.div>

        {/* Title + name form */}
        <motion.div style={!m ? {} : { scale: titleScale, opacity: titleOpacity, y: titleY }} className="relative z-30 flex h-full items-center px-5 pb-24 pt-36 md:pt-24">
          <div className="mx-auto grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border-2 border-primary/30 bg-card/80 px-4 py-1.5 font-display text-sm font-semibold text-primary backdrop-blur"
              >
                <Sparkles className="size-4" /> Forgotten Tales · a space adventure for ages 7–11
              </motion.p>
              <h1 className="font-display text-5xl font-bold leading-[0.9] tracking-tight min-[400px]:text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-[7.5rem]">
                <span className="sr-only">Explore the unknown</span>
                <BouncyWord word="EXPLORE" delay={0.1} className="text-title-gradient" />
                <br />
                <BouncyWord word="THE UNKNOWN" delay={0.5} className="text-primary-deep text-sticker" />
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-6 max-w-xl text-lg font-bold text-muted-foreground md:text-xl"
              >
                Meet the robots, rovers and rockets that explored space — and hear their stories in their <em className="text-primary">own</em> words!
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mt-8">
                {name ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="flex items-center gap-2 font-display text-2xl font-bold">
                      Ready, Cadet <span className="text-primary">{name}</span>?
                    </p>
                    <Button variant="chunky" size="xl" onClick={() => setCounting(true)}>
                      <Rocket /> Launch!
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={saveName} className="max-w-md rounded-4xl border-4 border-card bg-card/85 p-4 shadow-card-pop backdrop-blur">
                    <label htmlFor="explorer-name" className="mb-2 block font-display text-lg font-semibold">
                      First things first… what's your explorer name?
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="explorer-name"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        maxLength={16}
                        autoComplete="off"
                        placeholder="Your first name"
                        className="h-14 min-w-0 flex-1 rounded-full border-2 border-input bg-muted px-5 font-display text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                      <Button type="submit" variant="chunky" size="xl" disabled={!draft.trim()}>
                        Join!
                      </Button>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                      <Sparkles className="size-4 text-primary" /> You'll get your first sticker straight away
                    </p>
                  </form>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ x: 120, opacity: 0, rotate: 20 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.8 }}
              style={!m ? {} : { y: bleepY, rotate: bleepRotate }}
              className="relative hidden self-start md:block md:pt-24"
            >
              <div className="relative animate-float">
                <img src={bleep} alt="Bleep the friendly robot guide waving" width={816} height={816} className="feather-mask w-56 lg:w-72" />
                <div className="absolute -left-10 -top-2 flex items-center gap-1.5 rounded-3xl rounded-br-md chat-surface px-4 py-2 font-display text-base font-semibold shadow-[0_5px_0_var(--border)]">
                  Hi! I'm Bleep! <Hand className="size-4 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.button
          type="button"
          style={!m ? {} : { opacity: cueOpacity }}
          onClick={() => scrollToId("moon")}
          className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 font-display text-sm font-bold uppercase tracking-widest text-primary-deep"
        >
          Scroll to Launch
          <span className="grid size-12 animate-bounce-soft place-items-center rounded-full border-2 border-primary bg-card shadow-[0_4px_0_var(--border)]">
            <ChevronDown className="size-6" />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>{counting && <Countdown onDone={finishCountdown} />}</AnimatePresence>
    </section>
  );
}
