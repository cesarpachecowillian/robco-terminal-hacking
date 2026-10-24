import { test, expect } from 'bun:test';
import { WORD_LISTS, validateWordLists } from '../src/words.js';

test('lists cover lengths 4..15', () => {
  expect(Object.keys(WORD_LISTS).map(Number)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
});

test('every word has the right length, A-Z only, no duplicates', () => {
  expect(validateWordLists(WORD_LISTS)).toEqual([]);
  for (const [len, words] of Object.entries(WORD_LISTS)) {
    expect(words.length).toBeGreaterThanOrEqual(40);
    expect(new Set(words).size).toBe(words.length);
    for (const w of words) expect(w.length).toBe(+len);
  }
});

test('validateWordLists reports exact messages in order', () => {
  expect(validateWordLists({ 3: ['ABCD', 'ab3', 'ABC', 'ABC'] })).toEqual([
    '[WORDLIST] "ABCD" in [3] has length 4',
    '[WORDLIST] "ab3" in [3] has invalid chars',
    '[WORDLIST] duplicate "ABC" in [3]'
  ]);
  expect(validateWordLists({ 2: ['A1'] })).toEqual(['[WORDLIST] "A1" in [2] has invalid chars']);
});
