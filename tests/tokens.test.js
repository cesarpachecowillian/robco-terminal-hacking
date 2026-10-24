import { test, expect } from 'bun:test';
import { DIFF } from '../src/config.js';
import { createRound } from '../src/grid.js';
import { tokenAt, cellChar, cellClass } from '../src/tokens.js';

const g = createRound(DIFF.FACIL, 42).game;

test('word token', () => {
  const w = g.words[1];
  const t = tokenAt(g, w.col, w.start + 1);
  expect(t.key).toBe('w' + w.id);
  expect(t.kind).toBe('word');
  expect(t.ref).toBe(w);
  expect(t.text).toBe(w.text);
  expect(t.cells).toEqual([...Array(w.text.length).keys()].map(k => w.start + k));
  expect(t.c).toBe(w.col);
});

test('bracket token', () => {
  const b = g.brackets[0];
  const t = tokenAt(g, b.col, b.start);
  expect(t.key).toBe('b' + b.id);
  expect(t.kind).toBe('bracket');
  expect(t.text).toBe(b.str);
  expect(t.cells.length).toBe(b.len);
});

test('junk token key is j<c>_<i>', () => {
  const i = g.cols[0].findIndex(x => x.type === 'junk');
  const t = tokenAt(g, 0, i);
  expect(t.key).toBe(`j0_${i}`);
  expect(t.kind).toBe('junk');
  expect(t.cells).toEqual([i]);
  expect(t.text).toBe(g.cols[0][i].ch);
});

test('dud cell text is "."', () => {
  const copy = { ...g, cols: [[{ type: 'dud', ch: '.' }], []] };
  const t = tokenAt(copy, 0, 0);
  expect(t.kind).toBe('dud');
  expect(t.text).toBe('.');
  expect(cellChar({ type: 'dud', ch: 'X' })).toBe('.');
  expect(cellClass({ type: 'dud' })).toBe('cell dud');
});
