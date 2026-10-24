// Input handling: keyboard, pointer, grid mouse/touch, end-screen buttons.
import { DIFF } from './config.js';
import { $ } from './dom.js';
import { G, setSkip } from './state.js';
import { ensureAudio, play } from './audio.js';
import { setCursor, moveCursor } from './cursor.js';
import { submit } from './actions.js';
import { menuIdx, setMenuIdx, chooseDiff, startGame, showDifficultyScreen } from './flow.js';

const MOD_KEYS = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock', 'AltGraph', 'OS'];

let lastPtr = 'mouse';
let suppressNextClick = false;   // set by a skipping pointerdown, cleared by the next click

// is a skippable animation running that should swallow the next input?
const skipping = () => G.state === 'BOOT' || G.ending === true;

/** @param {KeyboardEvent} e */
function onKeyDown(e) {
  ensureAudio();
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const k = e.key;
  if (MOD_KEYS.includes(k) || /^F\d+$/.test(k)) return;

  if (k === 'Escape' && !e.repeat && (G.state === 'BOOT' || G.state === 'PLAYING')) {
    e.preventDefault(); showDifficultyScreen(); return;   // resetUI bumps GEN + silences audio
  }

  if (skipping()) {   // consume: complete the animation, don't also act
    if (!e.repeat) setSkip(true);
    e.preventDefault();
    return;
  }

  const onBtn = e.target && e.target.tagName === 'BUTTON';

  if (G.state === 'MENU') {
    if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); setMenuIdx(menuIdx + 1, true); play('key'); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); setMenuIdx(menuIdx - 1, true); play('key'); }
    else if (e.repeat) return;
    else if (k >= '1' && k <= '5') chooseDiff(Object.values(DIFF)[+k - 1]);
    else if (k === 'Enter' && !onBtn) { e.preventDefault(); chooseDiff(Object.values(DIFF)[menuIdx]); }
    return;
  }

  if (G.state === 'PLAYING') {
    const dir = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[k];
    if (dir) { e.preventDefault(); G.tapKey = null; moveCursor(dir); }
    else if (k === 'Enter' && !e.repeat) { e.preventDefault(); submit(); }
    return;
  }

  if ((G.state === 'WON' || G.state === 'LOST') && !e.repeat && !onBtn) {
    if (k === 'r' || k === 'R') { startGame(G.diff); play('enter'); }
    else if (k === 'd' || k === 'D') { showDifficultyScreen(); play('enter'); }
  }
}

/** @param {PointerEvent} e */
function onPointerDown(e) {
  ensureAudio();
  lastPtr = e.pointerType || 'mouse';
  if (skipping()) {
    setSkip(true);
    suppressNextClick = true;
    e.preventDefault();
  }
}

/** Hover sound on the end-screen buttons. */
export function bindEndHover() {
  document.querySelectorAll('#end-btns button').forEach(b =>
    b.addEventListener('mouseenter', () => play('hover')));
}

/** Document-level listeners (all capture phase, order matters). */
export function bindDocumentInput() {
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointerup', ensureAudio, true);   // touch/iOS unlock
  document.addEventListener('click', ensureAudio, true);
  document.addEventListener('click', e => {   // swallow the click that follows a skipping pointerdown
    if (suppressNextClick) { suppressNextClick = false; e.stopPropagation(); e.preventDefault(); }
  }, true);
}

/** Grid: ONE delegated handler set resolves the token under the pointer. */
export function bindGridInput() {
  const grid = $('grid-area');
  let mx = -1, my = -1;
  grid.addEventListener('mousemove', e => {
    if (e.clientX === mx && e.clientY === my) return;   // ignore re-render-induced events
    mx = e.clientX; my = e.clientY;
    if (G.state !== 'PLAYING') return;
    const sp = e.target.closest && e.target.closest('.cell');
    if (sp) setCursor(+sp.dataset.c, +sp.dataset.i);
  });
  grid.addEventListener('click', e => {
    if (G.state !== 'PLAYING') return;
    const sp = e.target.closest && e.target.closest('.cell');
    if (!sp) return;
    setCursor(+sp.dataset.c, +sp.dataset.i);
    if (lastPtr === 'touch') {   // first tap selects, second tap on same token submits
      if (G.tapKey !== G.tok.key) { G.tapKey = G.tok.key; return; }
      G.tapKey = null;
    }
    submit();
  });
}

/** Click handlers of the end-screen buttons. */
export function bindEndButtons() {
  $('restart-btn').addEventListener('click', () => { if (G.diff && !G.ending) { startGame(G.diff); play('enter'); } });
  $('diff-btn').addEventListener('click', () => { if (!G.ending) { showDifficultyScreen(); play('enter'); } });
}
