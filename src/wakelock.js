// Screen wake lock while a round is being played (touch only). Never throws, never touches the RNG.
import { touching } from './haptics.js';

let sentinel = null;     // active WakeLockSentinel
let wanted = false;      // a round is in progress
let busy = false;        // a request is in flight
let listening = false;

async function acquire() {
  if (!wanted || sentinel || busy) return;
  try {
    if (!touching() || typeof navigator === 'undefined' || !navigator.wakeLock) return;
    busy = true;
    const s = await navigator.wakeLock.request('screen');
    if (!wanted) { s.release().catch(() => {}); return; }   // round ended while requesting
    sentinel = s;
    s.addEventListener('release', () => { if (sentinel === s) sentinel = null; });
  } catch { /* denied / unsupported / low battery */ } finally { busy = false; }
}

/** Requests a screen wake lock (touch play only); re-acquired when the tab becomes visible again. */
export function keepAwake() {
  try {
    wanted = true;
    if (!listening && typeof document !== 'undefined' && document.addEventListener) {
      listening = true;
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') acquire(); });
    }
    acquire();
  } catch { /* optional */ }
}

/** Releases the wake lock (round over or reset). */
export function releaseAwake() {
  wanted = false;
  const s = sentinel;
  sentinel = null;
  try { if (s) s.release().catch(() => {}); } catch { /* optional */ }
}
