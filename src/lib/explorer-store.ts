import { useSyncExternalStore } from "react";
import { DEFAULT_STATE, type ExplorerState } from "./explorer";

const KEY = "odyssey-explorer-v1";

export type RewardIcon = "welcome" | "sticker" | "star" | "gold" | "silver" | "bronze" | "finish";
export type Reward = { id: number; icon: RewardIcon; title: string; subtitle?: string; big?: boolean };

type Snapshot = { state: ExplorerState; reward: Reward | null };

let snapshot: Snapshot = { state: DEFAULT_STATE, reward: null };
let loaded = false;
const listeners = new Set<() => void>();
let rewardId = 0;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      snapshot = { ...snapshot, state: { ...DEFAULT_STATE, ...saved, games: saved.games ?? {} } };
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function updateExplorer(fn: (s: ExplorerState) => ExplorerState) {
  load();
  const next = fn(snapshot.state);
  if (next === snapshot.state) return false;
  snapshot = { ...snapshot, state: next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable */
  }
  emit();
  return true;
}

export function celebrate(reward: Omit<Reward, "id">) {
  snapshot = { ...snapshot, reward: { ...reward, id: ++rewardId } };
  emit();
}

export function clearReward() {
  snapshot = { ...snapshot, reward: null };
  emit();
}

export function getExplorer() {
  load();
  return snapshot.state;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const serverSnapshot: Snapshot = { state: DEFAULT_STATE, reward: null };

function useSnapshot() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return snapshot;
    },
    () => serverSnapshot,
  );
}

export const useExplorer = () => useSnapshot().state;
export const useReward = () => useSnapshot().reward;
