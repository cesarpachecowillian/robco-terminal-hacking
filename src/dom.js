// DOM helpers (browser only).

/** @param {string} id @returns {HTMLElement} */
export const $ = id => document.getElementById(id);

/** @returns {boolean} user prefers reduced motion */
export const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
