// Web Audio engine: user samples (sounds/manifest.json) with synthesized fallbacks.
import { SLOTS, normalizeEntries, entryParams } from './audio-manifest.js';

// Each slot plays a user-provided sample (sounds/manifest.json) when one is loaded,
// otherwise a synthesized fallback. Audio never touches rnd() (keeps ?seed= reproducible).

const JITTER  = { type: 1, hover: 1, key: 1 };   // slots with ±4% playbackRate variation
const MIN_GAP = { type: 45, hover: 30, key: 30 };   // per-slot throttle (ms)
const VOICE1  = { type: 1, hover: 1, key: 1 };   // one sample voice at a time
const FADE    = 0.004;                           // sample fade in/out (s), avoids clicks

let ctx      = null;
let master   = null;
let comp     = null;      // limiter, shared; master -> comp -> destination
let noiseBuf = null;      // shared 1s white noise
const bufs    = {};       // slot -> [{ buf, start, dur, vol }]
const files   = new Map();   // file -> Promise<AudioBuffer> (each file fetched+decoded once)
const voices  = {};       // slot -> { src, g } currently playing sample
const lastAt  = {};       // slot -> last play time (ms)
const warned  = new Set();

const rr = (a, b) => a + Math.random() * (b - a);
const warnOnce = what => {
  if (warned.has(what)) return;
  warned.add(what);
  console.warn('[SOUND] ' + what + ' — usando som sintetizado');
};

function newMaster() {
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(comp);
}

/**
 * Creates the AudioContext if needed, or resumes a suspended one. Created at load (runs at once if
 * the browser already allows autoplay for this site); otherwise it stays suspended until the first gesture.
 */
export function ensureAudio() {
  if (ctx) {
    if (ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => {});   // incl. iOS 'interrupted'
    return;
  }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    comp = ctx.createDynamicsCompressor();
    comp.connect(ctx.destination);
    newMaster();
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (_) { ctx = null; master = null; comp = null; noiseBuf = null; }
}

/** Drops everything scheduled on the old master (used on reset). */
export function silence() {
  if (!ctx) return;
  try { master.disconnect(); } catch (_) {}
  for (const k in voices) delete voices[k];
  newMaster();
}

// fetch + decode a file once (shared by every slot/slice that uses it)
function getBuf(file) {
  if (!files.has(file)) {
    files.set(file, (async () => {
      const r = await fetch('sounds/' + file);
      if (!r.ok) throw new Error('http ' + r.status);
      const ab = await r.arrayBuffer();
      return new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej));   // callback form: old Safari
    })());
  }
  return files.get(file);
}

/**
 * Loads optional sounds/manifest.json: { slot: entry | [entry, ...] }, entry = "file" |
 * { "file": "all.ogg", "start": 1.2, "dur": 0.08, "vol": 0.5 } (slice of a longer recording, per-entry gain).
 * Any failure -> synth only.
 * @returns {Promise<void>}
 */
export async function loadSamples() {
  if (!ctx) return;
  let man;
  try {
    const r = await fetch('sounds/manifest.json', { cache: 'no-cache' });
    if (!r.ok) return;
    man = await r.json();
  } catch (_) { return; }
  if (!man || typeof man !== 'object') return;
  await Promise.all(Object.entries(man).flatMap(([slot, v]) => {
    if (!SLOTS.includes(slot)) { warnOnce('slot desconhecido "' + slot + '"'); return []; }
    return normalizeEntries(v).map(async e => {
      try {
        const buf = await getBuf(e.file);
        const { start, dur, vol } = entryParams(e);
        if (start >= buf.duration) throw new Error('start fora do arquivo');
        (bufs[slot] = bufs[slot] || []).push({ buf, start, dur, vol });
      } catch (_) { warnOnce(e.file); }
    });
  }));
}

// oscillator; opts: to = end freq (exp sweep), lp = lowpass cutoff, atk = fade-in seconds
function tone(freq, dur, type = 'square', vol = 0.07, at = 0, opts = {}) {
  if (!ctx || !master || ctx.state === 'closed') return;
  try {
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
    if (opts.lp) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = opts.lp;
      o.connect(f); f.connect(g);
    } else o.connect(g);
    g.connect(master);
    if (opts.atk) {
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol, t + opts.atk);
    } else g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  } catch (_) {}
}

// filtered burst from the shared noise buffer (dur < 0.9)
function noise(dur, freq, q, vol, at = 0, ftype = 'bandpass') {
  if (!ctx || !master || !noiseBuf || ctx.state === 'closed') return;
  try {
    const t = ctx.currentTime + at;
    const s = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = ftype; f.frequency.value = freq; f.Q.value = q;
    s.connect(f); f.connect(g); g.connect(master);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.start(t, Math.random() * (noiseBuf.duration - dur - 0.05));
    s.stop(t + dur + 0.01);
  } catch (_) {}
}

const SYNTH = {
  poweron:   () => { tone(55, 0.35, 'sine', 0.09, 0, { atk: 0.25 }); tone(110, 0.35, 'triangle', 0.04, 0, { atk: 0.25, lp: 400 }); noise(0.03, 1200, 1, 0.08, 0.02); },
  type:      () => { noise(rr(0.008, 0.015), rr(2000, 4000), 2, 0.05); tone(rr(130, 190), 0.012, 'sine', 0.02); },
  hover:     () => { tone(rr(800, 950), 0.04, Math.random() < 0.5 ? 'square' : 'triangle', 0.035); noise(0.02, 3000, 1, 0.012); },
  key:       () => { noise(0.025, rr(1500, 2200), 1.2, 0.05); tone(120, 0.04, 'sine', 0.06); },
  enter:     () => { noise(0.035, 1400, 1, 0.07); tone(100, 0.06, 'sine', 0.08); noise(0.012, 4000, 3, 0.06, 0.025); },
  denied:    () => { const f = rr(110, 140); tone(f, 0.25, 'sawtooth', 0.09, 0, { lp: 600 }); tone(f * 1.02, 0.25, 'sawtooth', 0.05, 0, { lp: 600 }); },
  dud:       () => { tone(660, 0.05, 'square', 0.05, 0, { lp: 2500 }); tone(440, 0.09, 'square', 0.05, 0.07, { lp: 2500 }); },
  replenish: () => [523, 659, 880].forEach((f, i) => tone(f, i < 2 ? 0.06 : 0.12, 'square', 0.05, i * 0.07, { lp: 2500 })),
  granted:   () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i < 3 ? 0.14 : 0.2, 'square', 0.07, i * 0.1, { lp: 2200 })),
  locked:    () => { tone(220, 0.35, 'sawtooth', 0.09, 0, { to: 110, lp: 700 }); tone(110, 0.35, 'sawtooth', 0.08, 0.35, { to: 38, lp: 400 }); noise(0.6, 300, 0.7, 0.05, 0.1, 'lowpass'); }
};

/**
 * Plays a slot (sample if loaded, else synth). No-op unless the context is running.
 * @param {string} slot one of SLOTS
 */
export function play(slot) {
  if (!ctx || !master || ctx.state !== 'running') return;   // never queue on a suspended context
  if (MIN_GAP[slot]) {
    const now = performance.now();
    if (now - (lastAt[slot] || 0) < MIN_GAP[slot]) return;
    lastAt[slot] = now;
  }
  try {
    const list = (bufs[slot] && bufs[slot].length) ? bufs[slot]
               : (slot === 'key' && bufs.hover && bufs.hover.length) ? bufs.hover : null;
    if (!list) { SYNTH[slot](); return; }
    const e = list[Math.floor(Math.random() * list.length)];
    const rate = JITTER[slot] ? 1 + rr(-0.04, 0.04) : 1;
    const len = e.dur ? Math.min(e.dur, e.buf.duration - e.start) : e.buf.duration - e.start;
    if (!(len > 0)) return;
    const t = ctx.currentTime, end = t + len / rate, f = Math.min(FADE, len / rate / 2);
    const old = voices[slot];
    if (old) {   // cap voices: fade out + stop the previous one
      try { old.g.gain.cancelScheduledValues(t); old.g.gain.setValueAtTime(old.g.gain.value, t); old.g.gain.linearRampToValueAtTime(0, t + f); old.src.stop(t + f + 0.001); } catch (_) {}
    }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = e.buf;
    src.playbackRate.value = rate;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(e.vol, t + f);
    g.gain.setValueAtTime(e.vol, end - f);
    g.gain.linearRampToValueAtTime(0, end);
    src.connect(g); g.connect(master);
    src.start(t, e.start, len);
    if (VOICE1[slot]) {
      voices[slot] = { src, g };
      src.onended = () => { if (voices[slot] && voices[slot].src === src) delete voices[slot]; };
    }
  } catch (_) {}
}
