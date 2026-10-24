// Small pure helpers.

/**
 * Number of positions where both words have the same letter.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function likeness(a, b) {
  return [...a].reduce((n, c, i) => n + (c === b[i] ? 1 : 0), 0);
}

/**
 * @param {number} n
 * @returns {string} e.g. 0xF0A4
 */
export function hexAddr(n) {
  return '0x' + n.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * @param {number} s  first value
 * @param {number} n  count
 * @returns {number[]} s, s+1, ... s+n-1
 */
export const range = (s, n) => Array.from({ length: n }, (_, k) => s + k);
