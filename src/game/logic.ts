import { MAX_ATTEMPTS, PEGS_PER_ROW, PEG_COLORS, type ColorId } from './config';
import type { Peg, Result, Row, State } from './types';

const emptyPegs = (): Peg[] => Array.from({ length: PEGS_PER_ROW }, () => null);

const emptyRow = (): Row => ({ pegs: emptyPegs(), result: null });

export const createRows = (): Row[] =>
  Array.from({ length: MAX_ATTEMPTS }, emptyRow);

export const pickUniqueColors = (count: number): ColorId[] => {
  const pool = PEG_COLORS.map((c) => c.id);
  const picked: ColorId[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]!);
  }
  return picked;
};

export const isRowComplete = (row: Row): boolean =>
  row.pegs.every((p): p is ColorId => p !== null);

export const isRowUnique = (row: Row): boolean => {
  const filled = row.pegs.filter((p): p is ColorId => p !== null);
  return new Set(filled).size === filled.length;
};

export const canSubmitRow = (row: Row): boolean =>
  isRowComplete(row) && isRowUnique(row);

export const computeResult = (secret: ColorId[], pegs: Peg[]): Result => {
  let positionMatch = 0;
  let colorMatch = 0;

  for (let i = 0; i < PEGS_PER_ROW; i++) {
    const peg = pegs[i];
    if (peg === null) continue;
    if (peg === secret[i]) {
      positionMatch++;
    } else if (secret.includes(peg)) {
      colorMatch++;
    }
  }

  return { colorMatch, positionMatch };
};

export const createInitialState = (): State => ({
  status: 'playing',
  secret: pickUniqueColors(PEGS_PER_ROW),
  rows: createRows(),
  activeRow: 0,
});
