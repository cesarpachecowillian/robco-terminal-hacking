// Grid generation (pure, seed-deterministic). RNG draw order is part of the contract:
// the same seed must always produce the same grid (see tests/equivalence.test.js).
import {
  TOTAL, ROWS, COLS, JUNK, BRACKET_PAIRS, UINT32, GRID_RELAX_AFTER, BRACKET_ATTEMPTS,
  BRACKET_INNER_MIN, BRACKET_INNER_MAX, HEX_BASE_MIN, HEX_BASE_MAX
} from './config.js';
import { WORD_LISTS } from './words.js';
import { reseed, rnd, randInt, pick, shuffle } from './rng.js';
import { likeness } from './util.js';

/**
 * @typedef {Object} Word
 * @property {number} id
 * @property {string} text
 * @property {number} col
 * @property {number} start
 * @property {boolean} removed
 * @property {boolean} guessed
 */

/**
 * @typedef {Object} Bracket
 * @property {number} id
 * @property {number} col
 * @property {number} start
 * @property {number} len
 * @property {string} str
 * @property {boolean} used
 */

/**
 * @typedef {Object} Cell
 * @property {'junk'|'word'|'bracket'|'dud'} type
 * @property {string} ch
 * @property {number} [id]  index into words/brackets
 */

/**
 * @typedef {Object} Game
 * @property {'MENU'|'BOOT'|'PLAYING'|'WON'|'LOST'} state
 * @property {number} seed
 * @property {import('./config.js').Difficulty} [diff]
 * @property {string} [secret]
 * @property {number} [wLen]
 * @property {Word[]} [words]
 * @property {Bracket[]} [brackets]
 * @property {Cell[][]} [cols]
 * @property {HTMLElement[][]} [cells]  cell spans, filled by buildDOM
 * @property {HTMLElement[][]} [rowEls]
 * @property {number} [attempts]
 * @property {number} [max]
 * @property {boolean} [replUsed]
 * @property {import('./tokens.js').Token|null} [tok]
 * @property {{c: number, i: number}} [cur]
 * @property {string|null} [tapKey]
 * @property {boolean} [ending]
 * @property {number} [hexBase]
 */

/**
 * @param {number} [n]
 * @returns {string} n random junk chars
 */
function randJunk(n = 1) {
  let s = '';
  for (let i = 0; i < n; i++) s += JUNK[Math.floor(rnd() * JUNK.length)];
  return s;
}

/**
 * Gap-aware occupancy test: cells [s-1, s+len] must be free.
 * @param {boolean[]} occ
 * @param {number} s
 * @param {number} len
 * @returns {boolean}
 */
export function isFree(occ, s, len) {
  for (let k = Math.max(0, s - 1); k <= Math.min(TOTAL - 1, s + len); k++) if (occ[k]) return false;
  return true;
}

/**
 * @param {boolean[]} occ
 * @param {number} s
 * @param {number} len
 */
export function markOcc(occ, s, len) {
  for (let k = s; k < s + len; k++) occ[k] = true;
}

/**
 * Words for the round: secret + duds, preferring positional overlap with the secret.
 * @param {import('./config.js').Difficulty} diff
 * @param {number} wLen
 * @returns {{secret: string, duds: string[]}}
 */
export function chooseWords(diff, wLen) {
  const pool   = shuffle(WORD_LISTS[wLen] || []);
  const count  = randInt(Math.min(diff.minW, pool.length), Math.min(diff.maxW, pool.length));
  const secret = pool[0];
  const others = pool.slice(1);
  const l2 = others.filter(w => likeness(w, secret) >= 2);
  const l1 = others.filter(w => likeness(w, secret) === 1);
  const l0 = others.filter(w => likeness(w, secret) === 0);
  const head = l2.slice(0, 2);
  const rest = shuffle([...l2.slice(2), ...l1]).concat(l0);
  return { secret, duds: [...head, ...rest].slice(0, count - 1) };
}

/**
 * One generation attempt.
 * @param {import('./config.js').Difficulty} diff
 * @param {boolean} relax  accept fewer than minW words
 * @returns {Game|null} null when the attempt failed
 */
function tryGrid(diff, relax) {
  const wLen = randInt(diff.lenMin, diff.lenMax);
  const { secret, duds } = chooseWords(diff, wLen);
  if (!secret) return null;

  const cols = [0, 1].map(() => Array.from({ length: TOTAL }, () => ({ type: 'junk', ch: randJunk() })));
  const occ  = [new Array(TOTAL).fill(false), new Array(TOTAL).fill(false)];

  const words = [];
  let c = randInt(0, 1);
  const order = [secret, ...shuffle(duds)];
  for (const text of order) {
    let placed = false;
    for (const col of [c, 1 - c]) {
      const starts = [];
      for (let s = 0; s + text.length <= TOTAL; s++) if (isFree(occ[col], s, text.length)) starts.push(s);
      if (!starts.length) continue;
      const start = pick(starts);
      const id = words.length;
      words.push({ id, text, col, start, removed: false, guessed: false });
      markOcc(occ[col], start, text.length);
      for (let k = 0; k < text.length; k++) cols[col][start + k] = { type: 'word', ch: text[k], id };
      placed = true;
      break;
    }
    if (!placed && text === secret) return null;
    c = 1 - c;   // alternate columns
  }
  if (!relax && words.length < Math.min(diff.minW, order.length)) return null;

  const brackets = [];
  for (let col = 0; col < 2; col++) {
    let n = 0;
    for (let attempt = 0; attempt < BRACKET_ATTEMPTS && n < diff.bPerCol; attempt++) {
      const inner = randInt(BRACKET_INNER_MIN, BRACKET_INNER_MAX);
      const len   = inner + 2;
      const row   = randInt(0, ROWS - 1);
      const pos   = row * COLS + randInt(0, COLS - len);   // same row by construction
      if (!isFree(occ[col], pos, len)) continue;
      const [op, cl] = pick(BRACKET_PAIRS);
      const id = brackets.length;
      const chars = [op, ...randJunk(inner), cl];
      chars.forEach((ch, k) => { cols[col][pos + k] = { type: 'bracket', ch, id }; });
      markOcc(occ[col], pos, len);
      brackets.push({ id, col, start: pos, len, str: chars.join(''), used: false });
      n++;
    }
  }

  const hexBase = randInt(HEX_BASE_MIN, HEX_BASE_MAX) & ~3;
  return {
    state: 'BOOT', seed: 0, diff, secret, wLen, words, brackets, cols, cells: [[], []],
    attempts: diff.maxAttempts, max: diff.maxAttempts, replUsed: false,
    tok: null, cur: { c: 0, i: 0 }, tapKey: null, ending: false, hexBase
  };
}

/**
 * Retries tryGrid until one succeeds (relaxing the min-word rule after GRID_RELAX_AFTER failures).
 * @param {import('./config.js').Difficulty} diff
 * @returns {Game}
 */
function buildGrid(diff) {
  for (let t = 0; ; t++) {
    const g = tryGrid(diff, t >= GRID_RELAX_AFTER);
    if (g) return g;
  }
}

/**
 * Builds a reproducible round and derives the seed of the next one.
 * @param {import('./config.js').Difficulty} diff
 * @param {number} seed
 * @returns {{game: Game, nextSeed: number}}
 */
export function createRound(diff, seed) {
  reseed(seed);   // each game reproducible from its own seed
  const game = buildGrid(diff);
  game.seed = seed;
  const nextSeed = (rnd() * UINT32) >>> 0;
  return { game, nextSeed };
}
