import { test, expect } from 'bun:test';
import { likeness, hexAddr, range } from '../src/util.js';

test('likeness counts same-position letters', () => {
  expect(likeness('HELLO', 'HELLO')).toBe(5);
  expect(likeness('HELLO', 'WORLD')).toBe(1);
  expect(likeness('ABC', 'XYZ')).toBe(0);
  expect(likeness('ABC', 'AB')).toBe(2);
});

test('hexAddr pads and upper-cases', () => {
  expect(hexAddr(0)).toBe('0x0000');
  expect(hexAddr(0xf0a4)).toBe('0xF0A4');
  expect(hexAddr(0xFFFF)).toBe('0xFFFF');
  expect(hexAddr(0x1234)).toBe('0x1234');
});

test('range', () => {
  expect(range(5, 3)).toEqual([5, 6, 7]);
  expect(range(0, 0)).toEqual([]);
});
