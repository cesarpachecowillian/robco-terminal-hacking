// Animation primitives (rAF based, cancellable via a generation check, skippable).
import { reduced } from './dom.js';
import { skip } from './state.js';
import { play } from './audio.js';

/**
 * rAF time-based typing; resolves early on cancel (alive() false) and completes instantly on skip.
 * @param {HTMLElement} el
 * @param {string} text
 * @param {number} msPerChar
 * @param {() => boolean} alive
 * @returns {Promise<void>}
 */
export function typeEl(el, text, msPerChar, alive) {
  return new Promise(res => {
    el.textContent = '';
    if (skip || reduced() || msPerChar <= 0) {
      if (alive()) el.textContent = text;
      return res();
    }
    const t0 = performance.now();
    let shown = 0;
    const step = now => {
      if (!alive()) return res();
      const n = skip ? text.length : Math.min(text.length, Math.max(0, Math.floor((now - t0) / msPerChar) + 1));
      if (n !== shown) {
        shown = n;
        el.textContent = text.slice(0, n);
        if (n < text.length) play('type');
      }
      if (n >= text.length) return res();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/**
 * Skippable, cancellable pause.
 * @param {number} ms
 * @param {() => boolean} alive
 * @returns {Promise<void>}
 */
export function wait(ms, alive) {
  return new Promise(res => {
    const t0 = performance.now();
    const step = now => {
      if (!alive() || skip || reduced() || now - t0 >= ms) return res();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
