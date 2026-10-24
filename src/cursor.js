// Cell cursor: highlight, input line echo, keyboard navigation.
import { ROWS, COLS, TOTAL } from './config.js';
import { $ } from './dom.js';
import { tokenAt } from './tokens.js';
import { G } from './state.js';
import { play } from './audio.js';

/**
 * Toggles the highlight class on all cells of a token.
 * @param {import('./tokens.js').Token|null} tok
 * @param {boolean} on
 */
function hl(tok, on) {
  if (tok) tok.cells.forEach(i => G.cells[tok.c][i].classList.toggle('hl', on));
}

/** @param {string} txt  text shown after the prompt char */
function setInput(txt) {
  $('input-line').firstChild.nodeValue = '>' + txt;
}

/**
 * Moves the cell cursor; reacts only when the token under it changes (or force).
 * @param {number} c
 * @param {number} i
 * @param {{force?: boolean, quiet?: boolean, snd?: string}} [opt]
 */
export function setCursor(c, i, opt = {}) {
  const tok = tokenAt(G, c, i);
  G.cur = { c, i };
  if (!opt.force && G.tok && G.tok.key === tok.key) return;
  hl(G.tok, false);
  G.tok = tok;
  hl(tok, true);
  setInput(tok.text);
  syncTouchUI();
  if (!opt.quiet) play(opt.snd || 'hover');
}

/** Touch bar + tap hint follow the selection (all lookups are null-safe). */
export function syncTouchUI() {
  const send = $('send-btn');
  const t = G.tok;
  const live = G.state === 'PLAYING' && !!t && (t.kind === 'word' || t.kind === 'bracket');
  const armed = live && G.tapKey === t.key;   // first tap done, second confirms
  if (send) {
    send.disabled = !live;
    if (send.classList) send.classList.toggle('ready', armed);
  }
  const hint = document.querySelector('.tap-hint');
  if (hint) {
    hint.textContent = armed ? 'TOQUE DE NOVO' : '';
    hint.hidden = !armed;
  }
}

/** Clears the current highlight and token (call before mutating cells). */
export const unhl = () => { hl(G.tok, false); G.tok = null; };
/** Re-resolves the token under the cursor (after cells changed). */
export const refreshCursor = () => setCursor(G.cur.c, G.cur.i, { force: true, quiet: true });

/**
 * Keyboard navigation; each move repeats until the token changes.
 * @param {'left'|'right'|'up'|'down'} dir
 */
export function moveCursor(dir) {
  const { c, i } = G.cur;
  const row = Math.floor(i / COLS), off = i % COLS;
  const key = G.tok ? G.tok.key : tokenAt(G, c, i).key;
  let v = row * 2 * COLS + c * COLS + off;   // visual linear index
  let cc = c, ii = i;
  for (;;) {
    if (dir === 'left' || dir === 'right') {
      v += dir === 'left' ? -1 : 1;
      if (v < 0 || v >= ROWS * 2 * COLS) return;
      const r = Math.floor(v / (2 * COLS)), m = v % (2 * COLS);
      cc = Math.floor(m / COLS); ii = r * COLS + (m % COLS);
    } else {
      ii += dir === 'up' ? -COLS : COLS;
      if (ii < 0 || ii >= TOTAL) return;
    }
    if (tokenAt(G, cc, ii).key !== key) break;
  }
  setCursor(cc, ii, { snd: 'key' });
}
