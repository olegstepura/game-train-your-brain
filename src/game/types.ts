import type { ColorId } from './config';

export type Peg = ColorId | null;

export interface Result {
  colorMatch: number;
  positionMatch: number;
}

export interface Row {
  pegs: Peg[];
  result: Result | null;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface State {
  status: GameStatus;
  secret: ColorId[];
  rows: Row[];
  activeRow: number;
}

export type Action =
  | { type: 'start' }
  | { type: 'setPeg'; rowIdx: number; pegIdx: number; color: ColorId | null }
  | { type: 'randomizeActive' }
  | { type: 'submit' };
