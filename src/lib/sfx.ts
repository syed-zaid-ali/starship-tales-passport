import { getExplorer } from "./explorer-store";

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined" || !getExplorer().sound) return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.12, slideTo?: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  pop: () => tone(520, 0, 0.12, "sine", 0.12, 880),
  click: () => tone(660, 0, 0.06, "triangle", 0.08),
  sparkle: () => [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, i * 0.06, 0.18, "triangle", 0.07)),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.1, 0.28, "square", 0.05)),
  oops: () => tone(330, 0, 0.25, "sine", 0.1, 220),
  beep: () => tone(880, 0, 0.18, "square", 0.05),
  launch: () => tone(90, 0, 1.4, "sawtooth", 0.06, 900),
};

/** "Read to me": kid-friendly text to speech, with a different voice per character. */
export function speak(text: string, pitch = 1, rate = 1, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.pitch = pitch;
  u.rate = rate * 0.95;
  u.lang = "en-US";
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
