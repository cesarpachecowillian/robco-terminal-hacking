// Win / lockout end sequences.
import {
  LORE, TYPE_END_TITLE_MS, TYPE_END_MSG_MS, END_PAUSE_WON_MS, END_PAUSE_LOST_MS, END_TITLE_PAUSE_MS
} from './config.js';
import { $ } from './dom.js';
import { pick } from './rng.js';
import { G, LQ, setSkip } from './state.js';
import { typeEl, wait } from './anim.js';
import { pump } from './log.js';
import { show } from './screens.js';

/**
 * Queues the end screen after the pending log lines.
 * @param {'won'|'lost'} kind
 */
export function endSequence(kind) {
  G.ending = true;
  LQ.q.push(async alive => {
    await wait(kind === 'won' ? END_PAUSE_WON_MS : END_PAUSE_LOST_MS, alive);
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

  await typeEl($('end-title'), won ? 'ACESSO CONCEDIDO' : 'TERMINAL BLOQUEADO', TYPE_END_TITLE_MS, alive);
  if (!alive()) return;
  await wait(END_TITLE_PAUSE_MS, alive);
  await typeEl($('end-msg'), won ? pick(LORE) : 'MODO DE SEGURANÇA ATIVADO.\nSOLICITE DESBLOQUEIO AO SUPERVISOR.', TYPE_END_MSG_MS, alive);
  if (!alive()) return;
  $('end-btns').style.visibility = '';
  G.ending = false;
  setSkip(false);
}
