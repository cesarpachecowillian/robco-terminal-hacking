// Cursor tokens: the unit (word, bracket pair or single junk cell) under a cell.
import { range } from './util.js';

/**
 * @typedef {Object} Token
 * @property {string} key    'w<id>' | 'b<id>' | 'j<col>_<i>'
 * @property {string} kind   cell type ('word' | 'bracket' | 'junk' | 'dud')
 * @property {Object} [ref]  the Word or Bracket (not for single cells)
 * @property {number} c      column
 * @property {number[]} cells  cell indexes in the column
 * @property {string} text   text echoed in the input line
 */

/** @param {{type: string}} cell @returns {string} CSS class of a cell */
export const cellClass = cell => 'cell ' + cell.type;

/** @param {{type: string, ch: string}} cell @returns {string} displayed char ('.' for removed cells) */
export const cellChar = cell => cell.type === 'dud' ? '.' : cell.ch;

/**
 * Token under cell (c, i).
 * @param {import('./grid.js').Game} g
 * @param {number} c
 * @param {number} i
 * @returns {Token}
 */
export function tokenAt(g, c, i) {
  const cell = g.cols[c][i];
  if (cell.type === 'word') {
    const w = g.words[cell.id];
    return { key: 'w' + w.id, kind: 'word', ref: w, c, cells: range(w.start, w.text.length), text: w.text };
  }
  if (cell.type === 'bracket') {
    const b = g.brackets[cell.id];
    return { key: 'b' + b.id, kind: 'bracket', ref: b, c, cells: range(b.start, b.len), text: b.str };
  }
  return { key: 'j' + c + '_' + i, kind: cell.type, c, cells: [i], text: cellChar(cell) };
}
