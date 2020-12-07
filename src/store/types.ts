export enum Color {
  Color1 = '#EA462B',
  Color2 = '#FF7A00',
  Color3 = '#F6D025',
  Color4 = '#44C427',
  Color5 = '#0088FF',
  Color6 = '#9D00FF',
}

export const Colors = Object.values(Color);

export enum Position {
  Position1 = 1,
  Position2 = 2,
  Position3 = 3,
  Position4 = 4,
}

export const Positions: Position[] = [Position.Position1, Position.Position2, Position.Position3, Position.Position4];

export interface Sequence {
  [Position.Position1]?: Color
  [Position.Position2]?: Color
  [Position.Position3]?: Color
  [Position.Position4]?: Color
}

export interface Result {
  colorMatch: number
  positionMatch: number
}

export interface Line extends Sequence {
  active: boolean
  canSubmit: boolean
  result?: Result
}

export enum GameStatus {
  WelcomeScreen,
  GameActive,
  GameWin,
  GameOver,
}

export interface State {
  hidden: Sequence
  status: GameStatus
  lines: Line[]
}

export enum ActionType {
  GameStart = 'GameStart',
  ChangeColor = 'ChangeColor',
  LineFinish = 'LineFinish',
}

export interface ChangeColorPayload {
  line: number
  position: Position
  color: Color
}

export interface WithOnClick {
  onClick: () => void
}

export type Action =
  | { type: ActionType.GameStart }
  | { type: ActionType.LineFinish, payload: number }
  | { type: ActionType.ChangeColor, payload: ChangeColorPayload };
