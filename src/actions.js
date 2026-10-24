// Player actions: guessing a word, using a bracket.
import { REPLENISH_CHANCE } from './config.js';
import { rnd, pick } from './rng.js';
import { likeness, range } from './util.js';
import { G, GEN } from './state.js';
import { play } from './audio.js';
import { buzz } from './haptics.js';
import { releaseAwake } from './wakelock.js';
import { paintCell, renderAttempts, renderAlert, flickerAttempts } from './render.js';
import { unhl, refreshCursor, syncTouchUI } from './cursor.js';
import { logLine, flushLog } from './log.js';
import { endSequence } from './end.js';

/** Acts on the token under the cursor (word -> guess, bracket -> use). */
export function submit() {
  if (G.state !== 'PLAYING' || !G.tok) return;
  G.tapKey = null;
  const t = G.tok;
  if (t.kind === 'word') guessWord(t.ref);
  else if (t.kind === 'bracket') useBracket(t.ref);
  else play('enter');
  syncTouchUI();
}

/** @param {import('./grid.js').Word} w */
export function guessWord(w) {
  flushLog();
  play('enter');
  logLine('>' + w.text);

  if (w.text === G.secret) {
    G.state = 'WON';
    releaseAwake();
    ['>Senha aceita.', '>Autenticando...', '>Acesso liberado.'].forEach(logLine);
    play('granted'); buzz('granted');
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
    releaseAwake();
    play('locked'); buzz('locked');
    endSequence('lost');
  } else {
    play('denied'); buzz('denied');
    renderAlert();
  }
}

/** @param {import('./grid.js').Bracket} br */
export function useBracket(br) {
  flushLog();
  play('enter');
  logLine('>' + br.str);

  unhl();
  br.used = true;
  range(br.start, br.len).forEach(i => { G.cols[br.col][i] = { type: 'dud', ch: '.' }; paintCell(br.col, i); });

  const duds = G.words.filter(w => !w.removed && w.text !== G.secret);
  const replenish = () => {
    G.attempts = G.max; G.replUsed = true;
    play('replenish'); buzz('replenish');
    renderAttempts(); renderAlert();
    logLine('>Tentativas restauradas.');
  };

  if (!G.replUsed && G.attempts < G.max && rnd() < REPLENISH_CHANCE) {
    replenish();
  } else if (duds.length) {
    const fresh = duds.filter(w => !w.guessed);
    const w = pick(fresh.length ? fresh : duds);
    w.removed = true;
    range(w.start, w.text.length).forEach(i => { G.cols[w.col][i] = { type: 'dud', ch: '.' }; paintCell(w.col, i); });
    play('dud'); buzz('dud');
    logLine('>Resíduo removido.');
  } else if (G.attempts < G.max) {
    replenish();
  } else {
    play('dud'); buzz('dud');
    logLine('>Resíduo removido.');
  }
  refreshCursor();
}
