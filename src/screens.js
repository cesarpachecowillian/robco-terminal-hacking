// Screen switching and UI reset.
import { $, reduced } from './dom.js';
import { LQ, bumpGen, setSkip } from './state.js';
import { silence } from './audio.js';
import { disarm } from './touchbar.js';
import { releaseAwake } from './wakelock.js';

/** @param {string} id  screen element id to activate (others deactivate) */
export function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
}

/** Replays the CRT power-on flash (skipped for reduced motion). */
export function powerOn() {
  const p = document.querySelector('.crt-poweron');
  if (!p) return;
  p.classList.remove('on');
  void p.offsetWidth;
  if (!reduced()) p.classList.add('on');
}

/** Cancels all async sequences, silences audio and clears every dynamic element. */
export function resetUI() {
  bumpGen();
  setSkip(false);
  LQ.q = []; LQ.running = false;
  silence();
  releaseAwake();

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

  // touch UI back to idle
  const send = $('send-btn'), hint = document.querySelector('.tap-hint');
  if (send) { send.disabled = true; send.classList.remove('ready'); }
  disarm();
  if (hint) { hint.textContent = ''; hint.hidden = true; }

  const end = $('end-screen');
  end.classList.remove('won', 'lost');
  $('end-title').textContent = '';
  $('end-msg').textContent = '';
  $('end-btns').style.visibility = 'hidden';
}
