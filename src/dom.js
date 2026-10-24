// DOM helpers (browser only).
import { SR_MAX_LINES } from './config.js';

/** @param {string} id @returns {HTMLElement} */
export const $ = id => document.getElementById(id);

/**
 * Appends a line to the polite screen-reader live region (keeps the last SR_MAX_LINES).
 * @param {string} text
 */
export function announce(text) {
  const live = $('sr-live');
  if (!live) return;
  const d = document.createElement('div');
  d.textContent = text;
  live.appendChild(d);
  while (live.children.length > SR_MAX_LINES) live.removeChild(live.firstChild);
}

/** @returns {boolean} user prefers reduced motion */
export const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
