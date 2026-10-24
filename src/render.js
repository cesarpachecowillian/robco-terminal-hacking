// Grid / header rendering.
import { ROWS, COLS, MSG_PROMPT, MSG_ALERT, FLICKER_MS } from './config.js';
import { $ } from './dom.js';
import { hexAddr } from './util.js';
import { cellClass, cellChar } from './tokens.js';
import { G, GEN } from './state.js';

/**
 * Repaints one cell span from the model.
 * @param {number} c  column
 * @param {number} i  cell index in the column
 */
export function paintCell(c, i) {
  const cell = G.cols[c][i];
  const sp = G.cells[c][i];
  sp.className = cellClass(cell);
  sp.textContent = cellChar(cell);
}

/** Builds the whole grid DOM (rows hidden until boot reveals them). */
export function buildDOM() {
  const rows = [];
  [0, 1].forEach(c => {
    const colEl = $(c === 0 ? 'column-a' : 'column-b');
    colEl.textContent = '';
    for (let r = 0; r < ROWS; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';
      rowEl.style.visibility = 'hidden';

      const addr = document.createElement('span');
      addr.className = 'hex-addr';
      addr.textContent = hexAddr(G.hexBase + (c * ROWS + r) * COLS);
      rowEl.appendChild(addr);

      const content = document.createElement('span');
      content.className = 'grid-content';
      for (let k = 0; k < COLS; k++) {
        const i = r * COLS + k;
        const sp = document.createElement('span');
        sp.dataset.c = c; sp.dataset.i = i;
        G.cells[c][i] = sp;
        content.appendChild(sp);
        paintCell(c, i);
      }
      rowEl.appendChild(content);
      colEl.appendChild(rowEl);
      (rows[r] = rows[r] || []).push(rowEl);
    }
  });
  G.rowEls = rows;
}

/** Redraws the attempts counter and blocks. */
export function renderAttempts() {
  const el = $('attempts-line');
  el.textContent = `${G.attempts} TENTATIVA(S) RESTANTE(S): `;
  for (let k = 0; k < G.attempts; k++) {
    const b = document.createElement('span');
    b.className = 'att-block';
    el.appendChild(b);
  }
}

/** Shows the last-attempt alert or the normal prompt in the header. */
export function renderAlert() {
  const sub = $('header-sub');
  const alert = G.attempts === 1 && G.state !== 'BOOT';
  sub.classList.toggle('alert', alert);
  sub.textContent = alert ? MSG_ALERT : MSG_PROMPT;
}

/**
 * Brief 1-frame-ish dip of the attempts line; ignored if the generation changed.
 * @param {number} gen
 */
export function flickerAttempts(gen) {
  const el = $('attempts-line');
  el.style.opacity = '0.25';
  setTimeout(() => { if (GEN === gen) el.style.opacity = ''; }, FLICKER_MS);
}
