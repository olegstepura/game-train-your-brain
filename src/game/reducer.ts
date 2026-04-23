import { MAX_ATTEMPTS, PEGS_PER_ROW } from './config';
import {
  canSubmitRow,
  computeResult,
  createInitialState,
  pickUniqueColors,
} from './logic';
import type { Action, Row, State } from './types';

const replaceAt = <T>(arr: T[], idx: number, next: T): T[] =>
  arr.map((v, i) => (i === idx ? next : v));

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'start':
      return createInitialState();

    case 'setPeg': {
      const { rowIdx, pegIdx, color } = action;
      if (rowIdx !== state.activeRow || state.status !== 'playing') return state;
      const row = state.rows[rowIdx];
      const nextPegs = replaceAt(row.pegs, pegIdx, color);
      return {
        ...state,
        rows: replaceAt(state.rows, rowIdx, { ...row, pegs: nextPegs }),
      };
    }

    case 'randomizeActive': {
      if (state.status !== 'playing') return state;
      const row = state.rows[state.activeRow];
      const nextPegs = pickUniqueColors(PEGS_PER_ROW);
      const nextRow: Row = { ...row, pegs: nextPegs };
      return {
        ...state,
        rows: replaceAt(state.rows, state.activeRow, nextRow),
      };
    }

    case 'submit': {
      if (state.status !== 'playing') return state;
      const row = state.rows[state.activeRow];
      if (!canSubmitRow(row)) return state;

      const result = computeResult(state.secret, row.pegs);
      const nextRow: Row = { ...row, result };
      const rows = replaceAt(state.rows, state.activeRow, nextRow);

      if (result.positionMatch === PEGS_PER_ROW) {
        return { ...state, rows, status: 'won' };
      }
      if (state.activeRow === MAX_ATTEMPTS - 1) {
        return { ...state, rows, status: 'lost' };
      }
      return { ...state, rows, activeRow: state.activeRow + 1 };
    }
  }
};
