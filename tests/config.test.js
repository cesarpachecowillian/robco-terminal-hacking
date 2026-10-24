import { test, expect } from 'bun:test';
import {
  DIFF, JUNK, BRACKET_PAIRS, ROWS, COLS, TOTAL, UINT32, REPLENISH_CHANCE, GRID_RELAX_AFTER,
  BRACKET_ATTEMPTS, BRACKET_INNER_MIN, BRACKET_INNER_MAX, HEX_BASE_MIN, HEX_BASE_MAX,
  LOG_MAX_LINES, SR_MAX_LINES, LORE, menuLabel, menuParts, MSG_PROMPT, MSG_ALERT
} from '../src/config.js';
import { createHash } from 'node:crypto';
import fixture from './fixtures/grids-baseline.json';
import { WORD_LISTS } from '../src/words.js';

test('named constants keep their baseline values', () => {
  expect([ROWS, COLS, TOTAL, UINT32]).toEqual([17, 12, 204, 4294967296]);
  expect([REPLENISH_CHANCE, GRID_RELAX_AFTER, BRACKET_ATTEMPTS]).toEqual([0.2, 20, 300]);
  expect([BRACKET_INNER_MIN, BRACKET_INNER_MAX, HEX_BASE_MIN, HEX_BASE_MAX]).toEqual([1, 4, 0xF000, 0xFE64]);
  expect([LOG_MAX_LINES, SR_MAX_LINES]).toEqual([40, 6]);
  expect(MSG_PROMPT).toBe('INSIRA A SENHA AGORA');
  expect(MSG_ALERT).toBe('!!! ATENÇÃO: ÚLTIMA TENTATIVA !!!');
});

test('difficulty tiers are ordered, consistent and covered by word lists', () => {
  expect(Object.keys(DIFF)).toEqual(['MUITO_FACIL', 'FACIL', 'MEDIO', 'DIFICIL', 'MUITO_DIFICIL']);
  let prevMax = 0;
  for (const d of Object.values(DIFF)) {
    expect(DIFF[d.key]).toBe(d);
    expect(d.lenMin).toBeLessThanOrEqual(d.lenMax);
    expect(d.lenMin).toBeGreaterThan(prevMax);
    prevMax = d.lenMax;
    expect(d.minW).toBeLessThanOrEqual(d.maxW);
    expect(d.maxAttempts).toBe(4);
    for (let l = d.lenMin; l <= d.lenMax; l++) expect(WORD_LISTS[l].length).toBeGreaterThanOrEqual(d.maxW);
    expect(d.label.length).toBeLessThanOrEqual(14);
  }
});

test('junk has no brackets or dots; pairs are matched', () => {
  for (const ch of '[](){}<>.') expect(JUNK.includes(ch)).toBe(false);
  expect(BRACKET_PAIRS).toEqual([['[', ']'], ['(', ')'], ['{', '}'], ['<', '>']]);
});

test('LORE text equals the baseline', () => {
  expect(LORE.length).toBe(8);
  expect(createHash('sha256').update(JSON.stringify(LORE)).digest('hex')).toBe(fixture.loreHash);
});

test('menuParts recompose exactly into menuLabel', () => {
  Object.values(DIFF).forEach((d, i) => {
    const p = menuParts(d, i);
    expect(`${p.key} ${p.name}${p.pad} ${p.desc}`).toBe(menuLabel(d, i));
  });
});

test('menuLabel pads with NBSP, exactly as the baseline', () => {
  const nb = '\u00A0';
  const expected = [
    `[1] MUITO FÁCIL${nb.repeat(3)} 4–5 letras  ·  4 tentativas`,
    `[2] FÁCIL${nb.repeat(9)} 6–8 letras  ·  4 tentativas`,
    `[3] MÉDIO${nb.repeat(9)} 9–10 letras  ·  4 tentativas`,
    `[4] DIFÍCIL${nb.repeat(7)} 11–12 letras  ·  4 tentativas`,
    `[5] MUITO DIFÍCIL${nb} 13–15 letras  ·  4 tentativas`
  ];
  expect(Object.values(DIFF).map(menuLabel)).toEqual(expected);
  expect(Object.values(DIFF).map(menuLabel)).toEqual(fixture.menuLabels);
});
