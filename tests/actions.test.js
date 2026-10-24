// Gameplay oracle: scripted guesses/brackets on MEDIO (seeds 0..19) recorded from the baseline
// (git tag baseline-pre-refactor) must match src/ under the same fake DOM. See fixtures/harness.js.
import { test, expect } from 'bun:test';
import { installStubs, runScript } from './fixtures/harness.js';
import fixture from './fixtures/grids-baseline.json';

test('scripted action sequences match the baseline', async () => {
  let stub = installStubs();
  const { DIFF } = await import('../src/config.js');
  const { createRound } = await import('../src/grid.js');
  const { rnd } = await import('../src/rng.js');
  const state = await import('../src/state.js');
  const { buildDOM } = await import('../src/render.js');
  const { setCursor } = await import('../src/cursor.js');
  const actions = await import('../src/actions.js');
  const api = {
    setup(seed) {
      state.setG(createRound(DIFF.MEDIO, seed).game);
      buildDOM();
      state.G.state = 'PLAYING';
      setCursor(0, 0, { quiet: true });
    },
    getG: () => state.G,
    getLQ: () => state.LQ,
    guessWord: actions.guessWord,
    useBracket: actions.useBracket,
    rnd
  };
  for (const seed of Object.keys(fixture.actions)) {
    stub = installStubs();
    const got = await runScript(api, stub, +seed);
    expect(got, 'seed ' + seed).toEqual(fixture.actions[seed]);
  }
});
