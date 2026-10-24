// Regenerates grids-baseline.json from the PRE-REFACTOR game.js (git tag baseline-pre-refactor, commit 4f94e4f).
// Usage: bun tests/fixtures/generate-baseline.js tests/fixtures/grids-baseline.json
// Never point this at src/: the fixture is the behavioral oracle for the refactor.
import { createHash } from 'node:crypto';
import { installStubs, runScript } from './harness.js';
const TAG = 'baseline-pre-refactor';
const src = await Bun.$`git -C ${import.meta.dir + '/../..'} show ${TAG}:game.js`.text();
globalThis.window = globalThis; globalThis.location = { search: '' };
globalThis.document = { addEventListener() {} };
// count tryGrid calls to detect the relax path
const needle = 'function tryGrid(diff, relax) {';
if (!src.includes(needle)) throw new Error('instrumentation target not found in baseline: ' + needle);
const inst = src.replace(needle, needle + ' __calls.n++; if (relax) __calls.relax++;');
if (inst === src) throw new Error('instrumentation did not change the baseline source');
globalThis.__calls = { n: 0, relax: 0 };
const build = () => new Function(inst + `
function __setup(seed) {
  _rs = seed; G = buildGrid(DIFF.MEDIO); G.seed = seed; nextSeed = (rnd() * 4294967296) >>> 0; window.dbg = G; buildDOM();
  G.state = 'PLAYING'; setCursor(0, 0, { quiet: true });
}
return { DIFF, LORE, buildGrid, rnd, reseed: s => { _rs = s; }, showDifficultyScreen, guessWord, useBracket,
  setup: __setup, getG: () => G, getLQ: () => LQ };`)();
const api = build();
const rec = (g) => ({ secret: g.secret, wLen: g.wLen, words: g.words.map(w => [w.text, w.col, w.start]),
  brackets: g.brackets.map(b => [b.col, b.start, b.str]), hexBase: g.hexBase, grid: g.cols.map(c => c.map(x => x.ch).join('')) });
const out = { provenance: 'Generated from baseline tag baseline-pre-refactor (commit 4f94e4f) game.js (pre-refactor). NEVER regenerate from src/.',
  full: {}, hashes: {}, stats: {} };
const FULL = [0, 1, 2, 3, 42, 123, 1000, 65535, 2147483648, 4294967295];
for (const k of Object.keys(api.DIFF)) {
  out.full[k] = {};
  for (const seed of FULL) {
    api.reseed(seed); const g = api.buildGrid(api.DIFF[k]);
    const next = (api.rnd() * 4294967296) >>> 0; const tail = [1,2,3,4,5].map(() => api.rnd());
    out.full[k][seed] = { ...rec(g), next, tail };
  }
  const h = createHash('sha256'); let min = 1e9, max = 0; __calls.n = 0; __calls.relax = 0;
  for (let seed = 0; seed < 300; seed++) {
    api.reseed(seed); const g = api.buildGrid(api.DIFF[k]);
    const next = (api.rnd() * 4294967296) >>> 0;
    h.update(JSON.stringify({ ...rec(g), next }));
    min = Math.min(min, g.words.length); max = Math.max(max, g.words.length);
  }
  out.hashes[k] = h.digest('hex');
  out.stats[k] = { minWords: min, maxWords: max, tryGridCalls: __calls.n, relaxCalls: __calls.relax };
}

// forced relax path: minW impossibly high so the strict attempts fail until t >= 20
out.relax = { minW: 99, maxW: 99, base: 'MUITO_DIFICIL', seeds: {} };
const relaxDiff = { ...api.DIFF.MUITO_DIFICIL, minW: out.relax.minW, maxW: out.relax.maxW };
for (let seed = 0; seed < 10; seed++) {
  __calls.n = 0; __calls.relax = 0;
  api.reseed(seed); const g = api.buildGrid(relaxDiff);
  const next = (api.rnd() * 4294967296) >>> 0; const tail = [1,2,3,4,5].map(() => api.rnd());
  if (!__calls.relax) throw new Error('relax path not exercised for seed ' + seed);
  out.relax.seeds[seed] = { ...rec(g), next, tail, tryGridCalls: __calls.n, relaxCalls: __calls.relax };
}

// LORE text, menu button text and a scripted action sequence (MEDIO, seeds 0..19)
out.loreHash = createHash('sha256').update(JSON.stringify(api.LORE)).digest('hex');
{
  const stub = installStubs();
  build().showDifficultyScreen();
  out.menuLabels = stub.byId.get('diff-list').children.map(c => c.textContent);
}
out.actions = {};
for (let seed = 0; seed < 20; seed++) {
  const stub = installStubs();
  out.actions[seed] = await runScript(build(), stub, seed);
}

await Bun.write(process.argv[2], JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(out.stats), JSON.stringify(out.hashes));
