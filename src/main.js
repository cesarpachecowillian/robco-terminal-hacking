// Entry point: wires listeners and shows the difficulty menu once the DOM is ready.
import { ensureAudio, loadSamples } from './audio.js';
import { powerOn } from './screens.js';
import { showDifficultyScreen } from './flow.js';
import { bindEndHover, bindDocumentInput, bindGridInput, bindEndButtons } from './input.js';

document.addEventListener('DOMContentLoaded', () => {
  ensureAudio();
  loadSamples();
  bindEndHover();
  bindDocumentInput();
  bindGridInput();
  bindEndButtons();

  powerOn();
  showDifficultyScreen();
});
