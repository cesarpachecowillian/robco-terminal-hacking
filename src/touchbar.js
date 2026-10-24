// Touch MENU button arm state. A leaf module (dom + config only) so input.js and screens.js can both use it.
import { MENU_ARM_MS } from './config.js';
import { $, announce } from './dom.js';

let timer = 0;

/** Un-arms the touch MENU button (back to "MENU") and stops its timeout; null-safe. */
export function disarm() {
  clearTimeout(timer);
  timer = 0;
  const b = $('menu-btn');
  if (!b) return;
  b.classList.remove('armed');
  b.textContent = 'MENU';
}

/** Arms the MENU button ("SAIR?") for MENU_ARM_MS, and announces it to screen readers. */
export function arm() {
  const b = $('menu-btn');
  if (!b) return;
  clearTimeout(timer);
  b.classList.add('armed');
  b.textContent = 'SAIR?';
  timer = setTimeout(disarm, MENU_ARM_MS);
  announce('TOQUE DE NOVO EM SAIR? PARA VOLTAR AO MENU');
}
