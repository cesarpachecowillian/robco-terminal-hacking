import { test, expect, describe } from 'bun:test';
import { DIFF, JUNK, BRACKET_PAIRS, TOTAL, ROWS, COLS, HEX_BASE_MIN, HEX_BASE_MAX } from '../src/config.js';
import { WORD_LISTS } from '../src/words.js';
import { createRound, chooseWords, isFree, markOcc } from '../src/grid.js';
import { reseed } from '../src/rng.js';

const CLOSE = Object.fromEntries(BRACKET_PAIRS);

describe('grid invariants', () => {
  for (const diff of Object.values(DIFF)) {
    test(diff.key, () => {
      for (let seed = 0; seed < 500; seed++) {
        const { game: g, nextSeed } = createRound(diff, seed);
        const ctx = `${diff.key}/${seed}`;

        // words
        expect(g.words[0].text, ctx).toBe(g.secret);
        expect(g.wLen).toBeGreaterThanOrEqual(diff.lenMin);
        expect(g.wLen).toBeLessThanOrEqual(diff.lenMax);
        const texts = g.words.map(w => w.text);
        expect(new Set(texts).size, ctx).toBe(texts.length);
        for (const w of g.words) {
          expect(w.text.length).toBe(g.wLen);
          expect(WORD_LISTS[g.wLen]).toContain(w.text);
          expect(w.removed).toBe(false);
          expect(w.guessed).toBe(false);
          for (let k = 0; k < w.text.length; k++) {
            expect(g.cols[w.col][w.start + k]).toEqual({ type: 'word', ch: w.text[k], id: w.id });
          }
        }
        expect(g.words.length, ctx).toBeGreaterThanOrEqual(diff.minW);
        expect(g.words.length, ctx).toBeLessThanOrEqual(diff.maxW);

        // brackets
        const perCol = [0, 0];
        for (const b of g.brackets) {
          perCol[b.col]++;
          expect(b.len).toBeGreaterThanOrEqual(3);
          expect(b.len).toBeLessThanOrEqual(6);
          expect(b.str.length).toBe(b.len);
          expect(Math.floor(b.start / COLS)).toBe(Math.floor((b.start + b.len - 1) / COLS));
          expect(CLOSE[b.str[0]], ctx).toBe(b.str[b.len - 1]);
          for (const ch of b.str.slice(1, -1)) expect(JUNK).toContain(ch);
          expect(b.used).toBe(false);
          for (let k = 0; k < b.len; k++) {
            expect(g.cols[b.col][b.start + k]).toEqual({ type: 'bracket', ch: b.str[k], id: b.id });
          }
        }
        for (const n of perCol) expect(n).toBeLessThanOrEqual(diff.bPerCol);

        // gap-aware non-overlap: >=1 free cell between items in a column
        for (let col = 0; col < 2; col++) {
          const items = [
            ...g.words.filter(w => w.col === col).map(w => [w.start, w.text.length]),
            ...g.brackets.filter(b => b.col === col).map(b => [b.start, b.len])
          ].sort((a, b) => a[0] - b[0]);
          for (let k = 1; k < items.length; k++) {
            expect(items[k][0], ctx).toBeGreaterThan(items[k - 1][0] + items[k - 1][1]);
          }
          expect(g.cols[col].length).toBe(TOTAL);
          for (const cell of g.cols[col]) {
            if (cell.type === 'junk') {
              expect(cell.ch.length).toBe(1);
              expect(JUNK).toContain(cell.ch);
            }
          }
        }

        // addresses
        expect(g.hexBase % 4).toBe(0);
        expect(g.hexBase).toBeGreaterThanOrEqual(HEX_BASE_MIN);
        expect(g.hexBase).toBeLessThanOrEqual(HEX_BASE_MAX);
        expect(g.hexBase + (2 * ROWS - 1) * COLS).toBeLessThanOrEqual(0xFFFF);

        // initial state
        expect(g.attempts).toBe(diff.maxAttempts);
        expect(g.max).toBe(diff.maxAttempts);
        expect(g.state).toBe('BOOT');
        expect(g.replUsed).toBe(false);
        expect(g.tok).toBeNull();
        expect(g.seed).toBe(seed);
        expect(Number.isInteger(nextSeed) && nextSeed >= 0 && nextSeed < 2 ** 32).toBe(true);
      }
    });
  }

  test('deterministic for the same seed', () => {
    for (const diff of Object.values(DIFF)) {
      for (const seed of [0, 7, 99999, 4294967295]) {
        expect(createRound(diff, seed)).toEqual(createRound(diff, seed));
      }
    }
  });

  test('different seeds differ', () => {
    const a = createRound(DIFF.MEDIO, 1).game.cols;
    const b = createRound(DIFF.MEDIO, 2).game.cols;
    expect(a).not.toEqual(b);
  });
});

describe('chooseWords', () => {
  test('secret + duds are unique, right length, count in range', () => {
    for (const diff of Object.values(DIFF)) {
      for (let seed = 0; seed < 50; seed++) {
        reseed(seed);
        const { secret, duds } = chooseWords(diff, diff.lenMin);
        const all = [secret, ...duds];
        expect(new Set(all).size).toBe(all.length);
        expect(all.length).toBeGreaterThanOrEqual(Math.min(diff.minW, WORD_LISTS[diff.lenMin].length));
        expect(all.length).toBeLessThanOrEqual(diff.maxW);
        for (const w of all) expect(WORD_LISTS[diff.lenMin]).toContain(w);
      }
    }
  });

  test('unknown length yields no secret', () => {
    reseed(1);
    expect(chooseWords(DIFF.FACIL, 99).secret).toBeUndefined();
  });
});

describe('occupancy helpers', () => {
  test('isFree is gap-aware', () => {
    const occ = new Array(TOTAL).fill(false);
    markOcc(occ, 10, 4);   // 10..13
    expect(isFree(occ, 5, 4)).toBe(true);    // 5..8, gap cell 9 free
    expect(isFree(occ, 6, 4)).toBe(false);   // ends at 9, adjacent
    expect(isFree(occ, 14, 3)).toBe(false);  // adjacent after
    expect(isFree(occ, 15, 3)).toBe(true);
    expect(isFree(occ, 0, 3)).toBe(true);
    expect(isFree(occ, TOTAL - 3, 3)).toBe(true);
  });
});
