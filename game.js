'use strict';

// ─── DIFFICULTY CONFIG ────────────────────────────────────────────────────────

const DIFF = {
  MUITO_FACIL:   { key: 'MUITO_FACIL',   label: 'MUITO FÁCIL',   desc: '4–5 letras  ·  4 tentativas',   lenMin: 4,  lenMax: 5,  minW: 14, maxW: 17, maxAttempts: 4, bPerCol: 5 },
  FACIL:         { key: 'FACIL',         label: 'FÁCIL',         desc: '6–8 letras  ·  4 tentativas',   lenMin: 6,  lenMax: 8,  minW: 12, maxW: 15, maxAttempts: 4, bPerCol: 5 },
  MEDIO:         { key: 'MEDIO',         label: 'MÉDIO',         desc: '9–10 letras  ·  4 tentativas',  lenMin: 9,  lenMax: 10, minW: 10, maxW: 13, maxAttempts: 4, bPerCol: 4 },
  DIFICIL:       { key: 'DIFICIL',       label: 'DIFÍCIL',       desc: '11–12 letras  ·  4 tentativas', lenMin: 11, lenMax: 12, minW: 9,  maxW: 11, maxAttempts: 4, bPerCol: 4 },
  MUITO_DIFICIL: { key: 'MUITO_DIFICIL', label: 'MUITO DIFÍCIL', desc: '13–15 letras  ·  4 tentativas', lenMin: 13, lenMax: 15, minW: 8,  maxW: 10, maxAttempts: 4, bPerCol: 3 }
};

// ─── WORD LISTS ───────────────────────────────────────────────────────────────

const WORD_LISTS = {
  4: [
    'RUST','BOMB','DUST','RAID','WAVE','ARMY','GUNS',
    'TANK','SCAN','DOOR','WIRE','LOCK','CODE','DATA',
    'BYTE','FUEL','ROAD','WOLF','CAMP','TRAP','FIRE',
    'IRON','HEAT','COLD','DARK','SEED','FOOD','SHOT',
    'MAZE','GATE','HACK','PORT','BOLT','SILO','WALL',
    'KEEP','HOLE','DRUM','MINE','CELL','GRID','JUNK',
    'LAMP','NODE','PIPE','RUIN','SAFE','WORM','BLUE',
    'SAND','ROCK','TOWN','ZONE','ECHO','FORT'
  ],
  5: [
    'LASER','RADIO','ROBOT','SCRAP','STEEL','ALARM','BLAST',
    'CRATE','FORGE','GHOST','IGLOO','JUICE','KNIFE','LEVER',
    'MAGMA','NERVE','OZONE','PLANT','RAVEN','SHELL','TOXIC',
    'UNITY','VALVE','CABLE','DRAIN','EMBER','FLOOR','GRAIN',
    'INGOT','LARVA','MOTOR','NYLON','OXIDE','PANEL','QUEST',
    'RELAY','SIREN','TRUCK','WATER','WHEAT','YIELD','ORBIT',
    'PILOT','BRINE','ALLOY','SHARD','TRAIL','STONE','HOUSE',
    'ROUTE','SOLAR','SPARK','CHAIN'
  ],
  6: [
    'BUNKER','SHIELD','ENGINE','SIGNAL','FOREST','CANNON','BATTLE',
    'ROCKET','TANKER','SENSOR','MUTANT','BARREN','RUBBLE','HUNGER',
    'CANDLE','TUNNEL','SCREEN','DESERT','ORACLE','PATROL','RADIUS',
    'STORMY','THRUST','SHADOW','COLONY','DEFEND','SILENT','FROZEN',
    'HARBOR','INFECT','JACKET','KERNEL','MARKET','QUARRY','RIFLES',
    'BORDER','DANGER','EFFECT','FUTURE','GUNNER','HAMMER','IGNITE',
    'MANUAL','NOTICE','OXYGEN','PISTOL','RESCUE','SEALED','VICTIM',
    'WINTER','YELLOW'
  ],
  7: [
    'SURVIVE','MACHINE','CONTROL','RADIANT','STATION','MISSION','BULLETS',
    'CAPTAIN','DISEASE','HARVEST','SCANNER','SETTLER','TERRAIN','SILICON',
    'OUTPOST','BATTERY','SHELTER','RADIATE','MUTATED','WARNING','DESTROY',
    'PROTECT','MORTARS','WEAPONS','DEFENSE','STORAGE','HOSTILE','MONITOR',
    'CIRCUIT','PROCESS','CAVERNS','BUNKERS','THUNDER','WARRIOR','DROUGHT',
    'NEUTRON','REMNANT','FIGHTER','ENGINES','ROBOTIC','GENERAL','HORIZON',
    'HELMETS','CHAMBER','BLASTER','FREIGHT','MACHETE','NUCLEAR','ANTENNA',
    'CRUSHER','HYDRANT','RAIDERS'
  ],
  8: [
    'SHELTERS','CHEMICAL','SURVIVOR','ENGINEER','HIGHWAYS','MAINTAIN','STRANGER',
    'PRESSURE','DIRECTOR','CRUSADER','WARHEADS','COMPUTER','DISTANCE','ELECTRIC',
    'GASOLINE','INDUSTRY','JUNKYARD','KEYBOARD','LOCKDOWN','MECHANIC','NEGATIVE',
    'OPERATOR','PLATFORM','QUESTION','RESOURCE','SCRAPPER','TRANSMIT','UNIVERSE',
    'SHIPMENT','CRITICAL','DIAGNOSE','EXPOSURE','FIREWALL','GRENADES','HARDWARE',
    'INVASION','MOLECULE','NETWORKS','PARALLEL','QUANTITY','RESERVES','SETTLERS',
    'TERMINAL','UNLOCKED','WORKSHOP','SHUTDOWN','BULLDOZE','CHARCOAL','DETECTOR',
    'FORMULAS','MILITARY','ANTIDOTE','HOSPITAL','BOUNDARY','BUILDING','ORDINARY'
  ],
  9: [
    'RADIATION','WASTELAND','TERMINATE','MAINFRAME','PROCESSOR','SATELLITE','EMERGENCY',
    'FORTIFIED','GENERATOR','HYDRAULIC','INFECTION','MUNITIONS','PERIMETER','RECLAIMED',
    'SCAVENGER','SURVIVING','TECHNICAL','TRANSPORT','VOLUNTEER','ARMAMENTS','BATTALION',
    'CONTAINER','DEVASTATE','ELECTRODE','HOMESTEAD','INCIDENTS','FREQUENCY','ALGORITHM',
    'CATACLYSM','DETECTION','ENCRYPTED','FORMATION','INTERFACE','MAGNETISM','PLUTONIUM',
    'RADIOLOGY','STOCKPILE','TELESCOPE','VACCINATE','WAREHOUSE','ABANDONED','BIOSPHERE',
    'COMMANDER','DOCUMENTS','EQUIPMENT','PRECISION','PROTOTYPE','SALVAGING','SURVEYING',
    'UTILITIES','WEATHERED','CHEMISTRY','SANITIZED'
  ],
  10: [
    'CALIBRATED','COMMANDERS','COMPONENTS','CONTROLLED','CONVERSION','DEPARTMENT','DIRECTIONS',
    'ELECTRICAL','ELECTRONIC','ENGINEERED','EVACUATION','FORTIFYING','GOVERNMENT','HOMESTEADS',
    'IDENTIFIED','INSTRUMENT','INSULATION','LABORATORY','MAINTAINED','MECHANISMS','MICROCHIPS',
    'MONITORING','NAVIGATION','OPERATIONS','PERMISSION','PHOTOGRAPH','PRECAUTION','PROTECTION',
    'QUARANTINE','RECOVERING','REINFORCED','RESPONDERS','HYDROPONIC','SEPARATION','TECHNOLOGY',
    'UNDERSTAND','VENTILATED','VULNERABLE','WAREHOUSED','EXPLOSIVES','MECHANICAL','POLLUTANTS',
    'SCIENTIFIC','SHELTERING','SUBSTITUTE','SUPERVISOR','STOCKPILED','PROTECTIVE'
  ],
  11: [
    'ACCELERATOR','BULLETPROOF','CATACLYSMIC','COMMUNICATE','CRYSTALLINE','DEMOLITIONS','DISTRIBUTED',
    'ELECTRICITY','EMERGENCIES','ENVIRONMENT','FLUORESCENT','CONSTRUCTED','GENERATIONS','HYDROPONICS',
    'IMPLEMENTED','INSTRUCTION','INTERRUPTED','INVESTIGATE','MAINTAINING','MAINTENANCE','MANUFACTURE',
    'MEDICATIONS','MOTHERBOARD','NEUTRALIZED','PARTICULATE','PERFORMANCE','PROGRAMMING','QUARANTINED',
    'RADIOACTIVE','RESERVATION','EXPLORATION','SUBSTANTIAL','UNDERGROUND','VENTILATION','CONTAMINATE',
    'CALIBRATION','CONCENTRATE','ELECTRONICS','ENGINEERING','EXTERMINATE','FIREFIGHTER','INCINERATOR',
    'OPERATIONAL','PRESSURIZED','RECONSTRUCT','TEMPERATURE','TRANSFORMER','VOLUNTARILY'
  ],
  12: [
    'APPLICATIONS','COMPARTMENTS','CONVENTIONAL','DEVELOPMENTS','DISCONNECTED','GOVERNMENTAL','INDEPENDENCE',
    'INSTRUCTIONS','MANUFACTURER','OCCUPATIONAL','PROFESSIONAL','MICROBIOLOGY','UNIDENTIFIED','AGRICULTURAL',
    'ANNOUNCEMENT','BREAKTHROUGH','HOUSEKEEPING','IMMUNIZATION','INTERSECTION','MALFUNCTIONS','MEASUREMENTS',
    'UNEXPECTEDLY','ACKNOWLEDGED','DISAPPOINTED','ENCYCLOPEDIA','INCOMPATIBLE','SURVEILLANCE','TRANSMISSION',
    'SPECIFICALLY','CONTAMINATED','DECOMMISSION','ELECTRICIANS','ENVIRONMENTS','INSUFFICIENT','NOTIFICATION',
    'OBSERVATIONS','TECHNOLOGIES','TRANSFORMERS','DETERIORATED','EXPERIMENTAL','RECONNECTION','INSTRUMENTAL',
    'COMMUNICATED','UNCONTROLLED','RECOGNIZABLE','TRANSMITTERS'
  ],
  13: [
    'CONTAMINATION','ENVIRONMENTAL','MANUFACTURING','CONVERSATIONS','CONTRIBUTIONS','COUNTERATTACK','INVESTIGATION',
    'ORGANIZATIONS','SIGNIFICANTLY','SUBSTANTIALLY','UNDERSTANDING','INSTALLATIONS','UNPREDICTABLE','VULNERABILITY',
    'RECONSTRUCTED','EXTRAORDINARY','HYDROELECTRIC','COMMUNICATION','REINFORCEMENT','RADIOACTIVITY','INTERVENTIONS',
    'COMPLICATIONS','COLLABORATION','DEMONSTRATION','DETERMINATION','DIFFERENTIATE','FUNDAMENTALLY','INDEPENDENTLY',
    'MAGNIFICATION','MALFUNCTIONED','MODIFICATIONS','PRESERVATIVES','SPECIFICATION','KNOWLEDGEABLE','REFRIGERATION',
    'TECHNOLOGICAL','VISUALIZATION','ACCOMMODATION','CONSIDERATION','UNCOMFORTABLE','DECONTAMINATE','APPROXIMATELY',
    'ASTROPHYSICAL','PROFESSIONALS','INDISPENSABLE','INSTITUTIONAL','ADMINISTRATOR','COMMISSIONERS','CONSTRUCTIONS',
    'INVESTIGATORS','DISTRIBUTIONS','OPERATIONALLY','STERILIZATION'
  ],
  14: [
    'ADMINISTRATION','ACKNOWLEDGMENT','ACCOUNTABILITY','CHROMATOGRAPHY','CONFIGURATIONS','IDENTIFICATION','IMPLEMENTATION',
    'INFRASTRUCTURE','INTERCONNECTED','INTERPRETATION','NEUTRALIZATION','RESPONSIBILITY','TRANSFORMATION','UNCONVENTIONAL',
    'ELECTRONICALLY','FORTIFICATIONS','DECONTAMINATED','TRANSPORTATION','ORGANIZATIONAL','RECONNAISSANCE','ELECTROMAGNETS',
    'COMMUNICATIONS','EXPERIMENTALLY','DEMOBILIZATION','INDUSTRIALIZED','REINFORCEMENTS','SPECIFICATIONS','SUPERINTENDENT',
    'UNRECOGNIZABLE','CHARACTERISTIC','SUSTAINABILITY','AUTHENTICATION','PRESSURIZATION','DISCONNECTIONS','DETERMINATIONS',
    'QUALIFICATIONS','PHOTOSYNTHESIS','OCCUPATIONALLY','PROFESSIONALLY','UNDERSTANDABLY','SCIENTIFICALLY','RECONSTRUCTION',
    'SIMULTANEOUSLY','SUBSTANTIATION','CONTAMINATIONS','IRRECONCILABLE','UNDERSTATEMENT'
  ],
  15: [
    'TRANSFORMATIONS','ELECTROMAGNETIC','INDIVIDUALISTIC','INSTRUMENTATION','COUNTERMEASURES','RADIOACTIVITIES','CONSERVATIONIST',
    'DISTINGUISHABLE','INCOMPATIBILITY','EXTRAORDINARILY','INTERCHANGEABLE','TECHNOLOGICALLY','ENVIRONMENTALLY','VULNERABILITIES',
    'ELECTROCHEMICAL','DECONTAMINATION','INTERNATIONALLY','CHARACTERISTICS','INSTITUTIONALLY','CONGRATULATIONS','PROFESSIONALISM',
    'REPRESENTATIONS','ACCOMPLISHMENTS','MAINTAINABILITY','RECONFIGURATION','INFRASTRUCTURES','PERSONALIZATION','STANDARDIZATION',
    'DIFFERENTIATION','EXPERIMENTATION','RECOMMENDATIONS','PHILOSOPHICALLY','INCONSISTENCIES','INVESTIGATIONAL','COMPUTATIONALLY',
    'INSTANTANEOUSLY','SUPERCONDUCTIVE','MICROBIOLOGICAL','UNCONDITIONALLY','PHYSIOLOGICALLY','DISCONTINUATION','SYNCHRONIZATION',
    'INTERCONNECTION','PHARMACEUTICALS','AERODYNAMICALLY','MICROCONTROLLER'
  ]
};

// Runtime check: wrong-length words or duplicates log errors to console
(function validateWordLists() {
  Object.entries(WORD_LISTS).forEach(([len, words]) => {
    const seen = new Set();
    words.forEach(w => {
      if (w.length !== +len)
        console.error(`[WORDLIST] "${w}" in [${len}] has length ${w.length}`);
      if (!/^[A-Z]+$/.test(w))
        console.error(`[WORDLIST] "${w}" in [${len}] has invalid chars`);
      if (seen.has(w))
        console.error(`[WORDLIST] duplicate "${w}" in [${len}]`);
      seen.add(w);
    });
  });
})();

// no bracket chars and no '.' (reserved for removed cells)
const JUNK = '!@#$%^&*-_=+:;\'",?|~/\\`';
const BRACKET_PAIRS = [['[', ']'], ['(', ')'], ['{', '}'], ['<', '>']];

const ROWS  = 17;
const COLS  = 12;
const TOTAL = ROWS * COLS;   // chars per column stream

const MSG_PROMPT = 'INSIRA A SENHA AGORA';
const MSG_ALERT  = '!!! ATENÇÃO: ÚLTIMA TENTATIVA !!!';

const LORE = [
  'ARQUIVOS CLASSIFICADOS: O Vault 101 nunca foi projetado para abrir. Seus habitantes são sujeitos do Experimento 17-C da Vault-Tec. Nenhum deles sabe disso.',
  'REGISTRO INTERCEPTADO: Em 23 de outubro de 2077, às 9h47 EST, o primeiro ICBM foi detectado. O mundo acabou em duas horas.',
  'DIÁRIO DO SR. HOUSE: O Lucky 38 possui reservas de Nuka-Cola Quantum para 847 anos. Essa informação é CLASSIFICADA NÍVEL PLATINUM.',
  'RELATÓRIO ENCLAVE: A Operação Pureza Total foi aprovada. O Project Purity foi adulterado com FEV modificado. A "purificação" procede conforme planejado.',
  'TRANSMISSÃO BROTHERHOOD: Paladin Danse reporta infiltração Synth em todos os assentamentos do Commonwealth. Não se pode confiar em ninguém.',
  'MEMÓRIA SYNTH RECUPERADA: Eu não sabia que era um Synth. Vivi minha vida inteira acreditando ser humano. O Instituto pode ter substituído qualquer pessoa.',
  'GRAVAÇÃO VAULT-TEC: Os experimentos dos Vaults nunca foram sobre sobrevivência. Eram coleta de dados comportamentais para controle pós-guerra.',
  'ARQUIVO NCR: A República da Nova Califórnia se expande além de Hoover Dam. Com a expansão vem a corrupção. O sonho pode ser apenas uma nova opressão.'
];

// ─── RNG (seedable: ?seed=N) ──────────────────────────────────────────────────

const SEED = (() => {
  let n = NaN;
  try {
    const p = new URLSearchParams(location.search).get('seed');
    if (p !== null && p !== '') n = Number(p);
  } catch (_) {}
  return Number.isFinite(n) ? n >>> 0 : (Math.random() * 4294967296) >>> 0;
})();

let _rs = SEED;
function rnd() {   // mulberry32
  _rs = (_rs + 0x6D2B79F5) | 0;
  let t = Math.imul(_rs ^ (_rs >>> 15), 1 | _rs);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

const $       = id => document.getElementById(id);
const randInt = (a, b) => Math.floor(rnd() * (b - a + 1)) + a;
const pick    = arr => arr[Math.floor(rnd() * arr.length)];
const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randJunk(n = 1) {
  let s = '';
  for (let i = 0; i < n; i++) s += JUNK[Math.floor(rnd() * JUNK.length)];
  return s;
}

function likeness(a, b) {
  return [...a].reduce((n, c, i) => n + (c === b[i] ? 1 : 0), 0);
}

function hexAddr(n) {
  return '0x' + n.toString(16).toUpperCase().padStart(4, '0');
}

// ─── AUDIO ────────────────────────────────────────────────────────────────────

// Each slot plays a user-provided sample (sounds/manifest.json) when one is loaded,
// otherwise a synthesized fallback. Audio never touches rnd() (keeps ?seed= reproducible).

const SLOTS   = ['poweron', 'type', 'hover', 'key', 'enter', 'denied', 'dud', 'replenish', 'granted', 'locked'];
const JITTER  = { type: 1, hover: 1, key: 1 };   // slots with ±4% playbackRate variation
const MIN_GAP = { type: 45, hover: 30, key: 30 };   // per-slot throttle (ms)
const VOICE1  = { type: 1, hover: 1, key: 1 };   // one sample voice at a time
const FADE    = 0.004;                           // sample fade in/out (s), avoids clicks

let ctx      = null;
let master   = null;
let comp     = null;      // limiter, shared; master -> comp -> destination
let noiseBuf = null;      // shared 1s white noise
const bufs    = {};       // slot -> [{ buf, start, dur }]
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

// Created at load (runs at once if the browser already allows autoplay for this site);
// otherwise it stays suspended until the first gesture resumes it.
function ensureAudio() {
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

function silence() {   // drop everything scheduled on the old master
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

// optional sounds/manifest.json: { slot: entry | [entry, ...] }, entry = "file" |
// { "file": "all.ogg", "start": 1.2, "dur": 0.08, "vol": 0.5 } (slice of a longer recording, per-entry gain); any failure -> synth only
async function loadSamples() {
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
    return [].concat(v).map(e => (typeof e === 'string' ? { file: e } : e))
      .filter(e => e && typeof e.file === 'string' && e.file).map(async e => {
        try {
          const buf = await getBuf(e.file);
          const start = Math.max(0, +e.start || 0);
          const dur = +e.dur > 0 ? +e.dur : 0;
          if (start >= buf.duration) throw new Error('start fora do arquivo');
          (bufs[slot] = bufs[slot] || []).push({ buf, start, dur, vol: +e.vol > 0 ? Math.min(+e.vol, 4) : 1 });
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

function play(slot) {
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

// ─── GAME STATE ───────────────────────────────────────────────────────────────

// state: 'MENU' | 'BOOT' | 'PLAYING' | 'WON' | 'LOST'
let G    = { state: 'MENU', seed: SEED };
let GEN  = 0;           // generation counter: bumping it cancels every async sequence
let skip = false;       // current animation should complete instantly
let menuIdx = 0;
let lastPtr = 'mouse';
let suppressNextClick = false;   // set by a skipping pointerdown, cleared by the next click
let nextSeed = SEED;             // seed for the next game
const LQ = { q: [], running: false };   // serialized log queue
window.dbg = G;

// ─── GRID GENERATION ─────────────────────────────────────────────────────────

// gap-aware occupancy test: cells [s-1, s+len] must be free
function isFree(occ, s, len) {
  for (let k = Math.max(0, s - 1); k <= Math.min(TOTAL - 1, s + len); k++) if (occ[k]) return false;
  return true;
}

function markOcc(occ, s, len) {
  for (let k = s; k < s + len; k++) occ[k] = true;
}

// words for the round: secret + duds, preferring positional overlap with the secret
function chooseWords(diff, wLen) {
  const pool   = shuffle(WORD_LISTS[wLen] || []);
  const count  = randInt(Math.min(diff.minW, pool.length), Math.min(diff.maxW, pool.length));
  const secret = pool[0];
  const others = pool.slice(1);
  const l2 = others.filter(w => likeness(w, secret) >= 2);
  const l1 = others.filter(w => likeness(w, secret) === 1);
  const l0 = others.filter(w => likeness(w, secret) === 0);
  const head = l2.slice(0, 2);
  const rest = shuffle([...l2.slice(2), ...l1]).concat(l0);
  return { secret, duds: [...head, ...rest].slice(0, count - 1) };
}

function tryGrid(diff, relax) {
  const wLen = randInt(diff.lenMin, diff.lenMax);
  const { secret, duds } = chooseWords(diff, wLen);
  if (!secret) return null;

  const cols = [0, 1].map(() => Array.from({ length: TOTAL }, () => ({ type: 'junk', ch: randJunk() })));
  const occ  = [new Array(TOTAL).fill(false), new Array(TOTAL).fill(false)];

  const words = [];
  let c = randInt(0, 1);
  const order = [secret, ...shuffle(duds)];
  for (const text of order) {
    let placed = false;
    for (const col of [c, 1 - c]) {
      const starts = [];
      for (let s = 0; s + text.length <= TOTAL; s++) if (isFree(occ[col], s, text.length)) starts.push(s);
      if (!starts.length) continue;
      const start = pick(starts);
      const id = words.length;
      words.push({ id, text, col, start, removed: false, guessed: false });
      markOcc(occ[col], start, text.length);
      for (let k = 0; k < text.length; k++) cols[col][start + k] = { type: 'word', ch: text[k], id };
      placed = true;
      break;
    }
    if (!placed && text === secret) return null;
    c = 1 - c;   // alternate columns
  }
  if (!relax && words.length < Math.min(diff.minW, order.length)) return null;

  const brackets = [];
  for (let col = 0; col < 2; col++) {
    let n = 0;
    for (let attempt = 0; attempt < 300 && n < diff.bPerCol; attempt++) {
      const inner = randInt(1, 4);
      const len   = inner + 2;
      const row   = randInt(0, ROWS - 1);
      const pos   = row * COLS + randInt(0, COLS - len);   // same row by construction
      if (!isFree(occ[col], pos, len)) continue;
      const [op, cl] = pick(BRACKET_PAIRS);
      const id = brackets.length;
      const chars = [op, ...randJunk(inner), cl];
      chars.forEach((ch, k) => { cols[col][pos + k] = { type: 'bracket', ch, id }; });
      markOcc(occ[col], pos, len);
      brackets.push({ id, col, start: pos, len, str: chars.join(''), used: false });
      n++;
    }
  }

  const hexBase = randInt(0xF000, 0xFE64) & ~3;
  return {
    state: 'BOOT', seed: 0, diff, secret, wLen, words, brackets, cols, cells: [[], []],
    attempts: diff.maxAttempts, max: diff.maxAttempts, replUsed: false,
    tok: null, cur: { c: 0, i: 0 }, tapKey: null, ending: false, hexBase
  };
}

function buildGrid(diff) {
  for (let t = 0; ; t++) {
    const g = tryGrid(diff, t >= 20);
    if (g) return g;
  }
}

// ─── RENDER ───────────────────────────────────────────────────────────────────

const cellClass = cell => 'cell ' + cell.type;
const cellChar  = cell => cell.type === 'dud' ? '.' : cell.ch;

function paintCell(c, i) {
  const cell = G.cols[c][i];
  const sp = G.cells[c][i];
  sp.className = cellClass(cell);
  sp.textContent = cellChar(cell);
}

// build whole grid DOM (rows hidden until boot reveals them)
function buildDOM() {
  const rows = [];
  [0, 1].forEach(c => {
    const colEl = $(c === 0 ? 'column-a' : 'column-b');
    colEl.textContent = '';
    for (let r = 0; r < ROWS; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';
      rowEl.style.visibility = 'hidden';

      const addr = document.createElement('span');
      addr.className = 'hex-addr';
      addr.textContent = hexAddr(G.hexBase + (c * ROWS + r) * COLS);
      rowEl.appendChild(addr);

      const content = document.createElement('span');
      content.className = 'grid-content';
      for (let k = 0; k < COLS; k++) {
        const i = r * COLS + k;
        const sp = document.createElement('span');
        sp.dataset.c = c; sp.dataset.i = i;
        G.cells[c][i] = sp;
        content.appendChild(sp);
        paintCell(c, i);
      }
      rowEl.appendChild(content);
      colEl.appendChild(rowEl);
      (rows[r] = rows[r] || []).push(rowEl);
    }
  });
  G.rowEls = rows;
}

function renderAttempts() {
  const el = $('attempts-line');
  el.textContent = `${G.attempts} TENTATIVA(S) RESTANTE(S): `;
  for (let k = 0; k < G.attempts; k++) {
    const b = document.createElement('span');
    b.className = 'att-block';
    el.appendChild(b);
  }
}

function renderAlert() {
  const sub = $('header-sub');
  const alert = G.attempts === 1 && G.state !== 'BOOT';
  sub.classList.toggle('alert', alert);
  sub.textContent = alert ? MSG_ALERT : MSG_PROMPT;
}

function flickerAttempts(gen) {   // brief 1-frame-ish dip
  const el = $('attempts-line');
  el.style.opacity = '0.25';
  setTimeout(() => { if (GEN === gen) el.style.opacity = ''; }, 70);
}

// ─── TOKENS & CURSOR ──────────────────────────────────────────────────────────

const range = (s, n) => Array.from({ length: n }, (_, k) => s + k);

function tokenAt(c, i) {
  const cell = G.cols[c][i];
  if (cell.type === 'word') {
    const w = G.words[cell.id];
    return { key: 'w' + w.id, kind: 'word', ref: w, c, cells: range(w.start, w.text.length), text: w.text };
  }
  if (cell.type === 'bracket') {
    const b = G.brackets[cell.id];
    return { key: 'b' + b.id, kind: 'bracket', ref: b, c, cells: range(b.start, b.len), text: b.str };
  }
  return { key: 'j' + c + '_' + i, kind: cell.type, c, cells: [i], text: cellChar(cell) };
}

function hl(tok, on) {
  if (tok) tok.cells.forEach(i => G.cells[tok.c][i].classList.toggle('hl', on));
}

function setInput(txt) {
  $('input-line').firstChild.nodeValue = '>' + txt;
}

// move the cell cursor; reacts only when the token under it changes (or force)
function setCursor(c, i, opt = {}) {
  const tok = tokenAt(c, i);
  G.cur = { c, i };
  if (!opt.force && G.tok && G.tok.key === tok.key) return;
  hl(G.tok, false);
  G.tok = tok;
  hl(tok, true);
  setInput(tok.text);
  if (!opt.quiet) play(opt.snd || 'hover');
}

// call after mutating cells: clear old highlight first, then re-resolve under cursor
const unhl = () => { hl(G.tok, false); G.tok = null; };
const refreshCursor = () => setCursor(G.cur.c, G.cur.i, { force: true, quiet: true });

// keyboard navigation; each move repeats until the token changes
function moveCursor(dir) {
  const { c, i } = G.cur;
  const row = Math.floor(i / COLS), off = i % COLS;
  const key = G.tok ? G.tok.key : tokenAt(c, i).key;
  let v = row * 2 * COLS + c * COLS + off;   // visual linear index
  let cc = c, ii = i;
  for (;;) {
    if (dir === 'left' || dir === 'right') {
      v += dir === 'left' ? -1 : 1;
      if (v < 0 || v >= ROWS * 2 * COLS) return;
      const r = Math.floor(v / (2 * COLS)), m = v % (2 * COLS);
      cc = Math.floor(m / COLS); ii = r * COLS + (m % COLS);
    } else {
      ii += dir === 'up' ? -COLS : COLS;
      if (ii < 0 || ii >= TOTAL) return;
    }
    if (tokenAt(cc, ii).key !== key) break;
  }
  setCursor(cc, ii, { snd: 'key' });
}

// ─── ACTIONS ──────────────────────────────────────────────────────────────────

function submit() {
  if (G.state !== 'PLAYING' || !G.tok) return;
  G.tapKey = null;
  const t = G.tok;
  if (t.kind === 'word') guessWord(t.ref);
  else if (t.kind === 'bracket') useBracket(t.ref);
  else play('enter');
}

function guessWord(w) {
  flushLog();
  play('enter');
  logLine('>' + w.text);

  if (w.text === G.secret) {
    G.state = 'WON';
    ['>Senha aceita.', '>Autenticando...', '>Acesso liberado.'].forEach(logLine);
    play('granted');
    endSequence('won');
    return;
  }

  G.attempts--;
  w.guessed = true;
  logLine('>Entrada negada.');
  logLine('>Semelhança=' + likeness(w.text, G.secret));
  renderAttempts();
  flickerAttempts(GEN);
  if (G.attempts <= 0) {
    G.state = 'LOST';
    play('locked');
    endSequence('lost');
  } else {
    play('denied');
    renderAlert();
  }
}

function useBracket(br) {
  flushLog();
  play('enter');
  logLine('>' + br.str);

  unhl();
  br.used = true;
  range(br.start, br.len).forEach(i => { G.cols[br.col][i] = { type: 'dud', ch: '.' }; paintCell(br.col, i); });

  const duds = G.words.filter(w => !w.removed && w.text !== G.secret);
  const replenish = () => {
    G.attempts = G.max; G.replUsed = true;
    play('replenish');
    renderAttempts(); renderAlert();
    logLine('>Tentativas restauradas.');
  };

  if (!G.replUsed && G.attempts < G.max && rnd() < 0.2) {
    replenish();
  } else if (duds.length) {
    const fresh = duds.filter(w => !w.guessed);
    const w = pick(fresh.length ? fresh : duds);
    w.removed = true;
    range(w.start, w.text.length).forEach(i => { G.cols[w.col][i] = { type: 'dud', ch: '.' }; paintCell(w.col, i); });
    play('dud');
    logLine('>Resíduo removido.');
  } else if (G.attempts < G.max) {
    replenish();
  } else {
    play('dud');
    logLine('>Resíduo removido.');
  }
  refreshCursor();
}

// ─── ANIMATION PRIMITIVES ─────────────────────────────────────────────────────

// rAF time-based typing; resolves early on cancel (alive() false) and completes instantly on skip
function typeEl(el, text, msPerChar, alive) {
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

// skippable, cancellable pause
function wait(ms, alive) {
  return new Promise(res => {
    const t0 = performance.now();
    const step = now => {
      if (!alive() || skip || reduced() || now - t0 >= ms) return res();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// ─── LOG QUEUE ────────────────────────────────────────────────────────────────

// items: string (log line) or async function (sequenced step)
function logLine(text) {
  LQ.q.push(text);
  pump();
}

async function pump() {
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
  skip = false;
}

// finish everything pending instantly (before a new action)
function flushLog() {
  if (LQ.running) { skip = true; LQ.q.push(() => { skip = false; }); }   // reset after pending items
}

async function emitLine(text, alive) {
  const log = $('history-log');
  const el = document.createElement('div');
  el.className = 'log-line';
  log.appendChild(el);
  while (log.children.length > 40) log.removeChild(log.firstChild);
  await typeEl(el, text, 6, alive);
  if (!alive()) return;
  const live = $('sr-live');
  const d = document.createElement('div');
  d.textContent = text;
  live.appendChild(d);
  while (live.children.length > 6) live.removeChild(live.firstChild);
}

// ─── END SEQUENCES ────────────────────────────────────────────────────────────

function endSequence(kind) {
  G.ending = true;
  LQ.q.push(async alive => {
    await wait(kind === 'won' ? 500 : 400, alive);
    if (alive()) await showEnd(kind, alive);
  });
  pump();
}

async function showEnd(kind, alive) {
  const won = kind === 'won';
  document.body.classList.add(won ? 'state-won' : 'state-lost');
  const end = $('end-screen');
  end.classList.remove('won', 'lost');
  end.classList.add(won ? 'won' : 'lost');
  $('end-title').textContent = '';
  $('end-msg').textContent = '';
  $('end-btns').style.visibility = 'hidden';
  show('end-screen');

  await typeEl($('end-title'), won ? 'ACESSO CONCEDIDO' : 'TERMINAL BLOQUEADO', 8, alive);
  if (!alive()) return;
  await wait(120, alive);
  await typeEl($('end-msg'), won ? pick(LORE) : 'MODO DE SEGURANÇA ATIVADO.\nSOLICITE DESBLOQUEIO AO SUPERVISOR.', 5, alive);
  if (!alive()) return;
  $('end-btns').style.visibility = '';
  G.ending = false;
  skip = false;
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
}

function powerOn() {
  const p = document.querySelector('.crt-poweron');
  if (!p) return;
  p.classList.remove('on');
  void p.offsetWidth;
  if (!reduced()) p.classList.add('on');
}

function resetUI() {
  GEN++;
  skip = false;
  LQ.q = []; LQ.running = false;
  silence();

  document.body.classList.remove('state-won', 'state-lost');
  const sub = $('header-sub');
  sub.classList.remove('alert');
  sub.textContent = '';
  $('header-title').textContent = '';
  const att = $('attempts-line');
  att.textContent = ''; att.style.opacity = '';
  $('column-a').textContent = '';
  $('column-b').textContent = '';
  $('history-log').textContent = '';
  $('sr-live').textContent = '';
  $('input-line').firstChild.nodeValue = '>';

  const end = $('end-screen');
  end.classList.remove('won', 'lost');
  $('end-title').textContent = '';
  $('end-msg').textContent = '';
  $('end-btns').style.visibility = 'hidden';
}

// ─── DIFFICULTY SCREEN ────────────────────────────────────────────────────────

function updateHint() {
  $('diff-hint').textContent = '> TECLAS [1]–[5], SETAS + ENTER OU MOUSE  ·  [ESC] VOLTA AO MENU';
}

function setMenuIdx(i, focus) {
  const btns = $('diff-list').children;
  menuIdx = (i + btns.length) % btns.length;
  [...btns].forEach((b, k) => b.classList.toggle('hl', k === menuIdx));
  if (focus) btns[menuIdx].focus({ preventScroll: true });
}

function showDifficultyScreen() {
  resetUI();
  G = { state: 'MENU', seed: nextSeed };
  window.dbg = G;

  const list = $('diff-list');
  list.textContent = '';
  Object.values(DIFF).forEach((d, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'diff-option';
    b.textContent = `[${idx + 1}] ${d.label.padEnd(14, ' ')} ${d.desc}`;
    b.addEventListener('mouseenter', () => { if (G.state === 'MENU') { const nw = idx !== menuIdx; setMenuIdx(idx, true); if (nw) play('hover'); } });
    b.addEventListener('click', () => chooseDiff(d));
    list.appendChild(b);
  });
  updateHint();
  show('diff-screen');
  setMenuIdx(0, false);
}

function chooseDiff(d) {
  if (G.state !== 'MENU') return;
  startGame(d);
  play('enter');
}

// ─── BOOT SEQUENCE ────────────────────────────────────────────────────────────

async function bootSequence(gen) {
  const alive = () => GEN === gen;

  powerOn();
  play('poweron');
  await wait(120, alive);
  if (!alive()) return;
  await typeEl($('header-title'), 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL', 8, alive);
  if (!alive()) return;
  await typeEl($('header-sub'), MSG_PROMPT, 8, alive);
  if (!alive()) return;
  renderAttempts();

  for (let r = 0; r < ROWS; r++) {
    G.rowEls[r].forEach(el => { el.style.visibility = ''; });
    play('type');
    await wait(12, alive);
    if (!alive()) return;
  }

  skip = false;
  G.state = 'PLAYING';
  setCursor(0, 0, { quiet: true });
  $('terminal').focus({ preventScroll: true });
}

// ─── START ────────────────────────────────────────────────────────────────────

function startGame(diff) {
  resetUI();
  const seed = nextSeed;
  _rs = seed;   // each game reproducible from its own seed
  G = buildGrid(diff);
  G.seed = seed;
  nextSeed = (rnd() * 4294967296) >>> 0;
  window.dbg = G;   // DevTools: dbg.secret reveals the answer, dbg.seed the RNG seed
  buildDOM();
  show('terminal');
  bootSequence(GEN);
}

// ─── INPUT ────────────────────────────────────────────────────────────────────

const MOD_KEYS = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock', 'AltGraph', 'OS'];

// is a skippable animation running that should swallow the next input?
const skipping = () => G.state === 'BOOT' || G.ending === true;

function onKeyDown(e) {
  ensureAudio();
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const k = e.key;
  if (MOD_KEYS.includes(k) || /^F\d+$/.test(k)) return;

  if (k === 'Escape' && !e.repeat && (G.state === 'BOOT' || G.state === 'PLAYING')) {
    e.preventDefault(); showDifficultyScreen(); return;   // resetUI bumps GEN + silences audio
  }

  if (skipping()) {   // consume: complete the animation, don't also act
    if (!e.repeat) skip = true;
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

function onPointerDown(e) {
  ensureAudio();
  lastPtr = e.pointerType || 'mouse';
  if (skipping()) {
    skip = true;
    suppressNextClick = true;
    e.preventDefault();
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  ensureAudio();
  loadSamples();
  document.querySelectorAll('#end-btns button').forEach(b =>
    b.addEventListener('mouseenter', () => play('hover')));
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointerup', ensureAudio, true);   // touch/iOS unlock
  document.addEventListener('click', ensureAudio, true);
  document.addEventListener('click', e => {   // swallow the click that follows a skipping pointerdown
    if (suppressNextClick) { suppressNextClick = false; e.stopPropagation(); e.preventDefault(); }
  }, true);

  // grid: ONE delegated handler set resolves the token under the pointer
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

  $('restart-btn').addEventListener('click', () => { if (G.diff && !G.ending) { startGame(G.diff); play('enter'); } });
  $('diff-btn').addEventListener('click', () => { if (!G.ending) { showDifficultyScreen(); play('enter'); } });

  powerOn();
  showDifficultyScreen();
});
