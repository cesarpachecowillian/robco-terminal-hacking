// Menu buttons are built from spans (so touch can restyle them) but must read exactly like menuLabel.
import { test, expect } from 'bun:test';
import { installStubs } from './fixtures/harness.js';

test('menu option textContent is byte-identical to menuLabel', async () => {
  const stub = installStubs();
  const orig = document.createTextNode;
  document.createTextNode = text => ({ textContent: text });   // not in the shared harness
  try {
    const { DIFF, menuLabel } = await import('../src/config.js');
    const { showDifficultyScreen } = await import('../src/flow.js');
    showDifficultyScreen();
    const btns = stub.byId.get('diff-list').children;
    expect(btns.map(b => b.textContent)).toEqual(Object.values(DIFF).map(menuLabel));
    expect(stub.byId.get('diff-hint').children[0].textContent).toContain('[ESC] VOLTA AO MENU');
  } finally {
    document.createTextNode = orig;
  }
});
