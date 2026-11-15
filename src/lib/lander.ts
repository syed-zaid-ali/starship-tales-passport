/**
 * Pure physics for the "Land the Eagle" mini-game. Units are metres and seconds.
 * Holding the thruster pushes up against Moon gravity and burns fuel.
 */
export type Lander = { height: number; speed: number; fuel: number };
export type LanderStatus = "flying" | "landed" | "crashed";

export const LANDER = {
  startHeight: 100,
  startSpeed: 5, // downward, m/s
  gravity: 1.62, // the Moon's real gravity
  thrust: 5, // upward push while firing
  burnRate: 12, // fuel per second while firing
  safeSpeed: 3, // touch down at or below this speed to land safely
} as const;

export const startLander = (): Lander => ({ height: LANDER.startHeight, speed: LANDER.startSpeed, fuel: 100 });

/** Advance the lander by dt seconds. Positive speed = falling. */
export function stepLander(l: Lander, firing: boolean, dt: number): { lander: Lander; status: LanderStatus } {
  const burning = firing && l.fuel > 0;
  const accel = LANDER.gravity - (burning ? LANDER.thrust : 0);
  const speed = l.speed + accel * dt;
  const height = l.height - speed * dt;
  const fuel = burning ? Math.max(0, l.fuel - LANDER.burnRate * dt) : l.fuel;
  if (height <= 0) {
    const impact = Math.max(0, speed);
    return { lander: { height: 0, speed: impact, fuel }, status: impact <= LANDER.safeSpeed ? "landed" : "crashed" };
  }
  // Don't let the lander fly away into space forever.
  const capped = height > LANDER.startHeight * 1.2 ? { height: LANDER.startHeight * 1.2, speed: Math.max(0, speed) } : { height, speed };
  return { lander: { ...capped, fuel }, status: "flying" };
}
