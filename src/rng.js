// Seedable RNG (mulberry32) and helpers. All gameplay randomness goes through rnd().
import { UINT32 } from './config.js';

// ─── SEED ─────────────────────────────────────────────────────────────────────

/**
 * Parses the `seed` query param (`?seed=N`).
 * @param {string} search  location.search
 * @returns {number|null} uint32 seed, or null when missing/empty/non-finite
 */
export function parseSeed(search) {
  let n = NaN;
  try {
    const p = new URLSearchParams(search).get('seed');
    if (p !== null && p !== '') n = Number(p);
  } catch (_) {}
  return Number.isFinite(n) ? n >>> 0 : null;
}

/** @returns {number} a random uint32 (non-reproducible) */
export function randomSeed() {
  return (Math.random() * UINT32) >>> 0;
}

// ─── RNG (seedable: ?seed=N) ──────────────────────────────────────────────────

let _rs = 0;

/**
 * Resets the RNG state; the next rnd() sequence is fully determined by seed.
 * @param {number} seed
 */
export function reseed(seed) {
  _rs = seed;
}

/** @returns {number} float in [0, 1) (mulberry32) */
export function rnd() {
  _rs = (_rs + 0x6D2B79F5) | 0;
  let t = Math.imul(_rs ^ (_rs >>> 15), 1 | _rs);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / UINT32;
}

/**
 * @param {number} a  min (inclusive)
 * @param {number} b  max (inclusive)
 * @returns {number}
 */
export const randInt = (a, b) => Math.floor(rnd() * (b - a + 1)) + a;

/**
 * @template T
 * @param {T[]} arr
 * @returns {T} random element
 */
export const pick = arr => arr[Math.floor(rnd() * arr.length)];

/**
 * Fisher–Yates on a copy.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
