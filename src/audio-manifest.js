// Pure parsing of sounds/manifest.json entries (the audio engine itself is in audio.js).
// Audio never touches rnd() (keeps ?seed= reproducible).

/** Sound slots the game can play. */
export const SLOTS = ['poweron', 'type', 'hover', 'key', 'enter', 'denied', 'dud', 'replenish', 'granted', 'locked'];

/**
 * Manifest value ("file" | {file,...} | array of those) -> list of entry objects with a file.
 * @param {*} v
 * @returns {{file: string, start?: number, dur?: number, vol?: number}[]}
 */
export function normalizeEntries(v) {
  return [].concat(v).map(e => (typeof e === 'string' ? { file: e } : e))
    .filter(e => e && typeof e.file === 'string' && e.file);
}

/**
 * Slice/gain parameters of an entry, sanitized.
 * @param {{start?: *, dur?: *, vol?: *}} e
 * @returns {{start: number, dur: number, vol: number}} dur 0 = to end of file; vol in (0, 4]
 */
export function entryParams(e) {
  const start = Math.max(0, +e.start || 0);
  const dur = +e.dur > 0 ? +e.dur : 0;
  const vol = +e.vol > 0 ? Math.min(+e.vol, 4) : 1;
  return { start, dur, vol };
}
