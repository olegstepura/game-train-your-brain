import { describe, expect, it } from 'vitest';
import { MAX_ATTEMPTS, PEGS_PER_ROW, PEG_COLORS, type ColorId } from './config';
import {
  canSubmitRow,
  computeResult,
  createInitialState,
  createRows,
  pickUniqueColors,
} from './logic';
import type { Peg, Row } from './types';

const row = (...pegs: Peg[]): Row => ({ pegs, result: null });

describe('computeResult', () => {
  const secret: ColorId[] = ['red', 'green', 'blue', 'yellow'];

  it('counts an exact match as position only', () => {
    expect(computeResult(secret, ['red', 'green', 'blue', 'yellow'])).toEqual({
      positionMatch: 4,
      colorMatch: 0,
    });
  });

  it('counts right colors in wrong places as color only', () => {
    expect(computeResult(secret, ['yellow', 'blue', 'green', 'red'])).toEqual({
      positionMatch: 0,
      colorMatch: 4,
    });
  });

  it('mixes position and color matches', () => {
    expect(computeResult(secret, ['red', 'blue', 'purple', 'orange'])).toEqual({
      positionMatch: 1,
      colorMatch: 1,
    });
  });

  it('returns zero for colors not in the secret', () => {
    expect(computeResult(secret, ['purple', 'orange', null, null])).toEqual({
      positionMatch: 0,
      colorMatch: 0,
    });
  });

  it('ignores empty slots', () => {
    expect(computeResult(secret, ['red', null, null, 'blue'])).toEqual({
      positionMatch: 1,
      colorMatch: 1,
    });
  });
});

describe('pickUniqueColors', () => {
  it('returns the requested number of distinct, known colors', () => {
    const known = new Set(PEG_COLORS.map((c) => c.id));
    for (let i = 0; i < 50; i++) {
      const picked = pickUniqueColors(PEGS_PER_ROW);
      expect(picked).toHaveLength(PEGS_PER_ROW);
      expect(new Set(picked).size).toBe(PEGS_PER_ROW);
      for (const c of picked) expect(known.has(c)).toBe(true);
    }
  });
});

describe('canSubmitRow', () => {
  it('accepts a full row of unique colors', () => {
    expect(canSubmitRow(row('red', 'green', 'blue', 'yellow'))).toBe(true);
  });

  it('rejects a row with an empty slot', () => {
    expect(canSubmitRow(row('red', 'green', null, 'yellow'))).toBe(false);
  });

  it('rejects a row with a repeated color', () => {
    expect(canSubmitRow(row('red', 'green', 'red', 'yellow'))).toBe(false);
  });
});

describe('createInitialState', () => {
  it('starts a fresh game on the first row', () => {
    const state = createInitialState();
    expect(state.status).toBe('playing');
    expect(state.activeRow).toBe(0);
    expect(state.secret).toHaveLength(PEGS_PER_ROW);
    expect(state.rows).toEqual(createRows());
    expect(state.rows).toHaveLength(MAX_ATTEMPTS);
  });
});
