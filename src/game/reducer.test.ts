import { describe, expect, it } from 'vitest';
import { MAX_ATTEMPTS, PEGS_PER_ROW, type ColorId } from './config';
import { canSubmitRow, createRows } from './logic';
import { reducer } from './reducer';
import type { State } from './types';

const SECRET: ColorId[] = ['red', 'green', 'blue', 'yellow'];
const WRONG: ColorId[] = ['purple', 'orange', 'red', 'green'];

const game = (overrides: Partial<State> = {}): State => ({
  status: 'playing',
  secret: SECRET,
  rows: createRows(),
  activeRow: 0,
  ...overrides,
});

const fillActive = (state: State, pegs: ColorId[]): State =>
  pegs.reduce<State>(
    (s, color, pegIdx) =>
      reducer(s, { type: 'setPeg', rowIdx: s.activeRow, pegIdx, color }),
    state,
  );

describe('setPeg', () => {
  it('sets a peg on the active row', () => {
    const next = reducer(game(), { type: 'setPeg', rowIdx: 0, pegIdx: 2, color: 'blue' });
    expect(next.rows[0]!.pegs).toEqual([null, null, 'blue', null]);
  });

  it('clears a peg with null', () => {
    const filled = reducer(game(), { type: 'setPeg', rowIdx: 0, pegIdx: 1, color: 'red' });
    const cleared = reducer(filled, { type: 'setPeg', rowIdx: 0, pegIdx: 1, color: null });
    expect(cleared.rows[0]!.pegs).toEqual([null, null, null, null]);
  });

  it('ignores rows other than the active one', () => {
    const state = game();
    expect(reducer(state, { type: 'setPeg', rowIdx: 1, pegIdx: 0, color: 'red' })).toBe(state);
  });

  it('ignores input after the game ends', () => {
    const state = game({ status: 'won' });
    expect(reducer(state, { type: 'setPeg', rowIdx: 0, pegIdx: 0, color: 'red' })).toBe(state);
  });
});

describe('randomizeActive', () => {
  it('fills the active row with a submittable guess', () => {
    const next = reducer(game(), { type: 'randomizeActive' });
    expect(next.rows[0]!.pegs).toHaveLength(PEGS_PER_ROW);
    expect(canSubmitRow(next.rows[0]!)).toBe(true);
  });
});

describe('submit', () => {
  it('does nothing for an incomplete row', () => {
    const state = reducer(game(), { type: 'setPeg', rowIdx: 0, pegIdx: 0, color: 'red' });
    expect(reducer(state, { type: 'submit' })).toBe(state);
  });

  it('scores the row and moves to the next one', () => {
    const next = reducer(fillActive(game(), WRONG), { type: 'submit' });
    expect(next.rows[0]!.result).toEqual({ positionMatch: 0, colorMatch: 2 });
    expect(next.activeRow).toBe(1);
    expect(next.status).toBe('playing');
  });

  it('wins on an exact match', () => {
    const next = reducer(fillActive(game(), SECRET), { type: 'submit' });
    expect(next.status).toBe('won');
    expect(next.activeRow).toBe(0);
  });

  it('loses after the last attempt misses', () => {
    let state = game();
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      state = reducer(fillActive(state, WRONG), { type: 'submit' });
    }
    expect(state.status).toBe('lost');
    expect(state.activeRow).toBe(MAX_ATTEMPTS - 1);
    expect(state.rows.every((r) => r.result !== null)).toBe(true);
  });
});

describe('start', () => {
  it('resets a finished game', () => {
    const next = reducer(game({ status: 'lost', activeRow: 9 }), { type: 'start' });
    expect(next.status).toBe('playing');
    expect(next.activeRow).toBe(0);
    expect(next.rows).toEqual(createRows());
  });
});
