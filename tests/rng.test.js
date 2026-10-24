import { test, expect, describe } from 'bun:test';
import { parseSeed, randomSeed, reseed, rnd, randInt, shuffle, pick } from '../src/rng.js';

// verbatim copy of the original mulberry32 implementation
function original(seed) {
  let _rs = seed;
  return () => {
    _rs = (_rs + 0x6D2B79F5) | 0;
    let t = Math.imul(_rs ^ (_rs >>> 15), 1 | _rs);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('parseSeed', () => {
  const table = [
    ['', null], ['?foo=1', null], ['?seed=abc', null], ['?seed=', null], ['?seed=%20', 0],
    ['?seed=1e3', 1000], ['?seed=-1', 4294967295], ['?seed=0x10', 16], ['?seed=1.9', 1],
    ['?seed=4294967296', 0], ['?seed=Infinity', null], ['?seed=42', 42], ['?a=1&seed=7', 7]
  ];
  for (const [search, exp] of table) test(JSON.stringify(search), () => expect(parseSeed(search)).toBe(exp));
});

test('randomSeed is a uint32', () => {
  for (let i = 0; i < 100; i++) {
    const s = randomSeed();
    expect(Number.isInteger(s) && s >= 0 && s < 2 ** 32).toBe(true);
  }
});

test('rnd matches the original mulberry32', () => {
  for (const seed of [0, 123, 2 ** 32 - 1]) {
    const ref = original(seed);
    reseed(seed);
    for (let i = 0; i < 1000; i++) expect(rnd()).toBe(ref());
  }
});

test('reseed restarts the sequence', () => {
  reseed(5); const a = [rnd(), rnd()];
  reseed(5); expect([rnd(), rnd()]).toEqual(a);
});

test('randInt stays within inclusive bounds and hits both ends', () => {
  reseed(1);
  const seen = new Set();
  for (let i = 0; i < 500; i++) {
    const v = randInt(3, 6);
    expect(v).toBeGreaterThanOrEqual(3);
    expect(v).toBeLessThanOrEqual(6);
    seen.add(v);
  }
  expect([...seen].sort()).toEqual([3, 4, 5, 6]);
  expect(randInt(4, 4)).toBe(4);
});

test('shuffle is a non-mutating permutation', () => {
  reseed(9);
  const src = [1, 2, 3, 4, 5, 6, 7, 8];
  const copy = [...src];
  const out = shuffle(src);
  expect(src).toEqual(copy);
  expect(out).not.toBe(src);
  expect([...out].sort((a, b) => a - b)).toEqual(copy);
});

test('pick returns a member', () => {
  reseed(2);
  const arr = ['a', 'b', 'c'];
  for (let i = 0; i < 50; i++) expect(arr).toContain(pick(arr));
});
