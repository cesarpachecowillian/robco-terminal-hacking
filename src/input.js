// Input handling: keyboard, pointer, grid mouse/touch, end-screen buttons.
import { DIFF, COLS } from './config.js';
import { $ } from './dom.js';
import { G, setSkip } from './state.js';
import { ensureAudio, play } from './audio.js';
import { setCursor, moveCursor, syncTouchUI } from './cursor.js';
import { submit } from './actions.js';
import { notePointer, buzz } from './haptics.js';
import { arm, disarm } from './touchbar.js';
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
  notePointer(lastPtr);
  const onBar = G.state === 'BOOT' && e.target.closest && e.target.closest('#touch-bar');   // MENU must work during boot
  if (skipping() && !onBar) {
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
    disarm();
    const c = +sp.dataset.c;
    const touch = lastPtr === 'touch';
    setCursor(c, touch ? snapCell(c, +sp.dataset.i) : +sp.dataset.i);
    if (touch) {   // first tap selects, second tap on same token submits
      if (G.tapKey !== G.tok.key) {
        G.tapKey = G.tok.key; buzz('select'); syncTouchUI(); return;
      }
      G.tapKey = null;
    }
    submit();
    syncTouchUI();
  });
}

/**
 * Touch only: a tap on junk / a removed dud next to a live word or bracket (same column and
 * visual row, index i-1 / i+1) snaps to it. A word wins over a bracket, then i+1. Applied on every tap, so the
 * second tap lands on the same token as the first.
 * @param {number} c
 * @param {number} i
 * @returns {number} cell index to use
 */
function snapCell(c, i) {
  const col = G.cols[c];
  if (col[i].type !== 'junk' && col[i].type !== 'dud') return i;
  const near = [i + 1, i - 1].filter(k => k >= 0 && k < col.length && Math.floor(k / COLS) === Math.floor(i / COLS));
  const hit = near.find(k => col[k].type === 'word') ?? near.find(k => col[k].type === 'bracket');
  return hit === undefined ? i : hit;
}

/** Touch bar: MENU (tap twice within MENU_ARM_MS to leave the round) and ENVIAR (submit). */
export function bindTouchBar() {
  const menu = $('menu-btn'), send = $('send-btn');
  if (!menu || !send) return;
  menu.addEventListener('click', () => {
    if (G.state !== 'BOOT' && G.state !== 'PLAYING') return;
    if (menu.classList.contains('armed')) {
      disarm();
      showDifficultyScreen();   // same as ESC
      return;
    }
    arm();
    play('hover');
  });
  send.addEventListener('click', () => {
    disarm();
    submit();
    syncTouchUI();
  });
}

/** Click handlers of the end-screen buttons. */
export function bindEndButtons() {
  $('restart-btn').addEventListener('click', () => { if (G.diff && !G.ending) { startGame(G.diff); play('enter'); } });
  $('diff-btn').addEventListener('click', () => { if (!G.ending) { showDifficultyScreen(); play('enter'); } });
}
