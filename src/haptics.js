// Haptic feedback (Android Chrome etc.). Never touches the RNG; every failure is swallowed.
import { reduced } from './dom.js';

/** Vibration patterns (ms) per game event. */
const PATTERNS = {
  denied: 30,
  dud: 15,
  locked: [80, 60, 160],
  granted: [20, 40, 20],
  replenish: [15, 30, 15],
  select: 8
};

let touched = false;   // last pointer was a finger (set by input.js)

/** @param {string} type  PointerEvent.pointerType of the latest pointerdown */
export function notePointer(type) {
  touched = type === 'touch';
}

/** @returns {boolean} the last pointer was a finger */
export const touching = () => touched;

/**
 * Vibrates for a game event; no-op without support, with reduced motion, or for mouse/pen play.
 * @param {'denied'|'dud'|'locked'|'granted'|'replenish'|'select'} kind
 */
export function buzz(kind) {
  try {
    if (!touched || reduced()) return;
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    navigator.vibrate(PATTERNS[kind]);
  } catch { /* haptics are optional */ }
}
