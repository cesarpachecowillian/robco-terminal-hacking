// Game flow: difficulty menu, boot sequence, starting a round.
import { DIFF, menuLabel, ROWS, MSG_PROMPT, TYPE_HEADER_MS, BOOT_PAUSE_MS, BOOT_ROW_MS } from './config.js';
import { $ } from './dom.js';
import { createRound } from './grid.js';
import { SEED, G, GEN, setG, setSkip } from './state.js';
import { play } from './audio.js';
import { buildDOM, renderAttempts } from './render.js';
import { setCursor } from './cursor.js';
import { typeEl, wait } from './anim.js';
import { show, powerOn, resetUI } from './screens.js';

// ─── DIFFICULTY SCREEN ────────────────────────────────────────────────────────

/** Highlighted menu option (write only via setMenuIdx). */
export let menuIdx = 0;
let nextSeed = SEED;   // seed for the next game

function updateHint() {
  $('diff-hint').textContent = '> TECLAS [1]–[5], SETAS + ENTER OU MOUSE  ·  [ESC] VOLTA AO MENU';
}

/**
 * Highlights a menu option (wraps around).
 * @param {number} i
 * @param {boolean} focus  also focus the button
 */
export function setMenuIdx(i, focus) {
  const btns = $('diff-list').children;
  menuIdx = (i + btns.length) % btns.length;
  [...btns].forEach((b, k) => b.classList.toggle('hl', k === menuIdx));
  if (focus) btns[menuIdx].focus({ preventScroll: true });
}

/** Resets everything and shows the difficulty menu. */
export function showDifficultyScreen() {
  resetUI();
  setG({ state: 'MENU', seed: nextSeed });

  const list = $('diff-list');
  list.textContent = '';
  Object.values(DIFF).forEach((d, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'diff-option';
    b.textContent = menuLabel(d, idx);
    b.addEventListener('mouseenter', () => { if (G.state === 'MENU') { const nw = idx !== menuIdx; setMenuIdx(idx, true); if (nw) play('hover'); } });
    b.addEventListener('click', () => chooseDiff(d));
    list.appendChild(b);
  });
  updateHint();
  show('diff-screen');
  setMenuIdx(0, false);
}

/** @param {import('./config.js').Difficulty} d */
export function chooseDiff(d) {
  if (G.state !== 'MENU') return;
  startGame(d);
  play('enter');
}

// ─── BOOT SEQUENCE ────────────────────────────────────────────────────────────

async function bootSequence(gen) {
  const alive = () => GEN === gen;

  powerOn();
  play('poweron');
  await wait(BOOT_PAUSE_MS, alive);
  if (!alive()) return;
  await typeEl($('header-title'), 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL', TYPE_HEADER_MS, alive);
  if (!alive()) return;
  await typeEl($('header-sub'), MSG_PROMPT, TYPE_HEADER_MS, alive);
  if (!alive()) return;
  renderAttempts();

  for (let r = 0; r < ROWS; r++) {
    G.rowEls[r].forEach(el => { el.style.visibility = ''; });
    play('type');
    await wait(BOOT_ROW_MS, alive);
    if (!alive()) return;
  }

  setSkip(false);
  G.state = 'PLAYING';
  setCursor(0, 0, { quiet: true });
  $('terminal').focus({ preventScroll: true });
}

// ─── START ────────────────────────────────────────────────────────────────────

/**
 * Starts a new round: generates the grid from the pending seed and runs the boot.
 * @param {import('./config.js').Difficulty} diff
 */
export function startGame(diff) {
  resetUI();
  const r = createRound(diff, nextSeed);
  setG(r.game);
  nextSeed = r.nextSeed;
  buildDOM();
  show('terminal');
  bootSequence(GEN);
}
