// Shared mutable game state. Importers read the live bindings; rebinding goes through the setters
// (object properties, e.g. G.attempts or LQ.q, are mutated directly).
import { parseSeed, randomSeed } from './rng.js';

const parsed = parseSeed(typeof location !== 'undefined' ? location.search : '');
/** Seed of the first game (?seed=N or random). */
export const SEED = parsed !== null ? parsed : randomSeed();

// state: 'MENU' | 'BOOT' | 'PLAYING' | 'WON' | 'LOST'
/** @type {import('./grid.js').Game} current game */
export let G = { state: 'MENU', seed: SEED };
/** Generation counter: bumping it cancels every async sequence. */
export let GEN = 0;
/** Current animation should complete instantly. */
export let skip = false;
/** Serialized log queue. */
export const LQ = { q: [], running: false };
if (typeof window !== 'undefined') window.dbg = G;

/**
 * Replaces the current game (also exposed as window.dbg for DevTools).
 * @param {import('./grid.js').Game} g
 */
export function setG(g) {
  G = g;
  if (typeof window !== 'undefined') window.dbg = G;   // DevTools: dbg.secret reveals the answer, dbg.seed the RNG seed
}

/** Cancels every async sequence started under the old generation. @returns {number} new generation */
export function bumpGen() {
  return ++GEN;
}

/** @param {boolean} v */
export function setSkip(v) {
  skip = v;
}
