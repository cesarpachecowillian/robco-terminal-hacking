// Shared by the baseline generator and tests/actions.test.js: a minimal fake DOM plus a scripted
// action sequence, so the same recording code runs against the baseline game.js and against src/.
import { createHash } from 'node:crypto';

class ClassList {
  constructor() { this.set = new Set(); }
  add(...c) { c.forEach(x => this.set.add(x)); }
  remove(...c) { c.forEach(x => this.set.delete(x)); }
  contains(c) { return this.set.has(c); }
  toggle(c, force) {
    const on = force === undefined ? !this.set.has(c) : !!force;
    if (on) this.set.add(c); else this.set.delete(c);
    return on;
  }
}

class El {
  constructor() { this.children = []; this._text = ''; this.classList = new ClassList(); this.style = {}; this.dataset = {}; this.className = ''; }
  get firstChild() { return this.children[0] || null; }
  get textContent() { return this.children.length ? this.children.map(c => c.textContent).join('') : this._text; }
  set textContent(v) { this.children = []; this._text = String(v); }
  appendChild(c) { this.children.push(c); return c; }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; }
  focus() {}
  addEventListener() {}
}

/**
 * Installs fake browser globals (reduced motion on, microtask rAF) and returns the element registry.
 * @returns {{byId: Map<string, El>}}
 */
export function installStubs() {
  const byId = new Map();
  const input = new El(); input.children = [{ nodeValue: '>', textContent: '>' }];
  byId.set('input-line', input);
  globalThis.window = globalThis;
  globalThis.location = { search: '' };
  globalThis.matchMedia = () => ({ matches: true });
  globalThis.requestAnimationFrame = cb => queueMicrotask(() => cb(performance.now()));
  globalThis.document = {
    body: new El(),
    addEventListener() {},
    createElement: () => new El(),
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: id => { if (!byId.has(id)) byId.set(id, new El()); return byId.get(id); }
  };
  return { byId };
}

const sha = s => createHash('sha1').update(s).digest('hex');

/**
 * Runs: one wrong guess, every bracket in index order, then wrong guesses until LOST.
 * @param {{setup(seed:number):void, getG():any, getLQ():any, guessWord(w:any):void, useBracket(b:any):void, rnd():number}} api
 * @param {{byId: Map<string, El>}} stub
 * @param {number} seed
 * @returns {Promise<object[]>} one snapshot per step, plus the rnd() tail
 */
export async function runScript(api, stub, seed) {
  const el = id => stub.byId.get(id) || new El();
  const settle = async () => {
    const LQ = api.getLQ();
    for (let k = 0; k < 500 && (LQ.running || LQ.q.length); k++) await Promise.resolve();
  };
  const snap = step => {
    const g = api.getG();
    return {
      step, state: g.state, attempts: g.attempts, replUsed: g.replUsed,
      removed: g.words.map(w => +w.removed).join(''), guessed: g.words.map(w => +w.guessed).join(''),
      used: g.brackets.map(b => +b.used).join(''),
      cols: sha(g.cols.map(c => c.map(x => x.type + x.ch).join('')).join('/')),
      tok: g.tok ? g.tok.key : null,
      cells: sha(g.cells.map(c => c.map(s => s.className + s.textContent + (s.classList.contains('hl') ? '*' : '')).join('|')).join('/')),
      input: el('input-line').firstChild.nodeValue,
      log: el('history-log').children.map(c => c.textContent),
      sr: el('sr-live').children.map(c => c.textContent),
      att: el('attempts-line').textContent + '#' + el('attempts-line').children.length,
      sub: el('header-sub').textContent + '|' + [...el('header-sub').classList.set].join(',')
    };
  };
  api.setup(seed);
  const out = [];
  const g = api.getG();
  const wrong = g.words.filter(w => w.text !== g.secret);
  api.guessWord(wrong[0]); await settle(); out.push(snap('guess0'));
  for (const b of g.brackets) { api.useBracket(b); await settle(); out.push(snap('bracket' + b.id)); }
  for (let k = 1; g.state === 'PLAYING' && k < 60; k++) {
    api.guessWord(wrong[k % wrong.length]); await settle(); out.push(snap('guess' + k));
  }
  out.push({ step: 'tail', tail: [api.rnd(), api.rnd(), api.rnd()] });
  return out;
}
