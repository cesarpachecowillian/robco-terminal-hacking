import { test, expect } from 'bun:test';
import { SLOTS, normalizeEntries, entryParams } from '../src/audio-manifest.js';

test('SLOTS are the ten documented slots', () => {
  expect(SLOTS).toEqual(['poweron', 'type', 'hover', 'key', 'enter', 'denied', 'dud', 'replenish', 'granted', 'locked']);
});

test('normalizeEntries', () => {
  expect(normalizeEntries('a.ogg')).toEqual([{ file: 'a.ogg' }]);
  expect(normalizeEntries({ file: 'a.ogg', start: 1 })).toEqual([{ file: 'a.ogg', start: 1 }]);
  expect(normalizeEntries(['a.ogg', { file: 'b.ogg' }])).toEqual([{ file: 'a.ogg' }, { file: 'b.ogg' }]);
  expect(normalizeEntries(['', null, 5, { file: '' }, { file: 3 }, {}, undefined])).toEqual([]);
  expect(normalizeEntries(null)).toEqual([]);
  expect(normalizeEntries(undefined)).toEqual([]);
});

test('entryParams', () => {
  expect(entryParams({ file: 'a' })).toEqual({ start: 0, dur: 0, vol: 1 });
  expect(entryParams({ start: -2, dur: -1, vol: 0 })).toEqual({ start: 0, dur: 0, vol: 1 });
  expect(entryParams({ start: '1.5', dur: '0.08', vol: '0.5' })).toEqual({ start: 1.5, dur: 0.08, vol: 0.5 });
  expect(entryParams({ vol: 10 }).vol).toBe(4);
  expect(entryParams({ vol: 'x', start: 'y', dur: NaN })).toEqual({ start: 0, dur: 0, vol: 1 });
});
