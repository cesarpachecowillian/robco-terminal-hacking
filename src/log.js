// Serialized log queue: lines type out one after another in #history-log.
import { LOG_MAX_LINES, TYPE_LOG_MS } from './config.js';
import { $, announce } from './dom.js';
import { GEN, LQ, setSkip } from './state.js';
import { typeEl } from './anim.js';

// items: string (log line) or async function (sequenced step)
/** @param {string} text  line to append to the log */
export function logLine(text) {
  LQ.q.push(text);
  pump();
}

/** Drains the queue sequentially; stops silently if a reset bumped the generation. */
export async function pump() {
  if (LQ.running) return;
  LQ.running = true;
  const gen = GEN;
  const alive = () => GEN === gen;
  while (LQ.q.length) {
    const item = LQ.q.shift();
    if (typeof item === 'function') await item(alive);
    else await emitLine(item, alive);
    if (!alive()) return;   // reset already cleared the queue
  }
  LQ.running = false;
  setSkip(false);
}

/** Finishes everything pending instantly (before a new action). */
export function flushLog() {
  if (LQ.running) { setSkip(true); LQ.q.push(() => { setSkip(false); }); }   // reset after pending items
}

async function emitLine(text, alive) {
  const log = $('history-log');
  const el = document.createElement('div');
  el.className = 'log-line';
  log.appendChild(el);
  while (log.children.length > LOG_MAX_LINES) log.removeChild(log.firstChild);
  await typeEl(el, text, TYPE_LOG_MS, alive);
  if (!alive()) return;
  announce(text);
}
