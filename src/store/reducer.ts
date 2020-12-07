import {
  Action,
  ActionType,
  ChangeColorPayload,
  Color,
  Colors,
  GameStatus,
  Line,
  Positions,
  Result,
  Sequence,
  State,
} from './types';
import { linesAmount } from 'config';
import isProd from 'utils/isProd';

/**
 * Creates random color
 * @param exclude Exclude colors from this list (already added in this line)
 */
const getRandomColor = (exclude: string[]): Color => {
  const colorIndex = Math.round(Math.random() * (Colors.length - 1));
  const color = Colors[colorIndex];
  if (!exclude.includes(color)) {
    return color;
  }
  return getRandomColor(exclude);
};

/**
 * Creates a sequence of 4 positions of random colors.
 */
export const getRandomSequence = (): Sequence => {
  const sequence: Sequence = {};
  for (let i = 0; i < Positions.length; i++) {
    sequence[Positions[i]] = getRandomColor(Object.values(sequence));
  }
  return sequence;
}

/**
 * Creates initial state. Used both when app starts and when new game is started.
 * @param initData Should we initialize data or not. App can be started without data initialized.
 */
const getInitialState = (initData: boolean): State => {
  const lines: Line[] = [];
  let hidden: Sequence = {};

  if (initData) {
    for (let i = 0; i < linesAmount; i++) {
      lines.push({ active: i === 0, canSubmit: false });
    }

    hidden = getRandomSequence();
  }

  return {
    hidden,
    status: GameStatus.WelcomeScreen,
    lines,
  };
};

/**
 * Initial state.
 */
export const initialState: State = getInitialState(false);

/**
 * Checks if given line can be submitted.
 * @param line
 */
const canSubmitLine = (line: Line) => {
  const uniqColors = new Set(Positions.map(position => line[position]));
  return Array.from(uniqColors).filter(v => v !== undefined).length === Positions.length;
};

/**
 * Calculates how many positions/colors matched the hidden sequence.
 * @param hidden Hidden sequence.
 * @param line Line to be checked.
 */
const getResult = (hidden: Sequence, line: Line): Result => {
  let colorMatch = 0;
  let positionMatch = 0;

  for (let i = 0; i < Positions.length; i++) {
    const position = Positions[i];
    if (hidden[position] === line[position]) {
      positionMatch++;
    } else if (Positions.filter(p => p !== position).map(p => line[p]).includes(hidden[position])) {
      colorMatch++;
    }
  }

  return { colorMatch, positionMatch };
};

/**
 * The reducer itself.
 * @param state
 * @param action
 */
const Reducer = (state: State, action: Action): State => {
  console.log('Incoming action', action);

  switch (action.type) {
    case ActionType.GameStart:
      const newState = getInitialState(true);
      return { ...newState, status: GameStatus.GameActive };

    case ActionType.LineFinish:
      const finishedLine = action.payload as number;
      let status = GameStatus.GameActive;

      if (finishedLine === linesAmount - 1) {
        console.info('Game over');
        status = GameStatus.GameOver;
      }

      const linesAfterLineFinish = state.lines.map((line, index) => {
        const newLine = { ...line };

        if (index === finishedLine) {
          newLine.active = false;
          newLine.result = getResult(state.hidden, line);
          if (newLine.result.positionMatch === Positions.length) {
            status = GameStatus.GameWin;
          }
        } else if (index === finishedLine + 1) {
          newLine.active = true;
        }
        return newLine;
      });

      return { ...state, lines: linesAfterLineFinish, status };

    case ActionType.ChangeColor:
      const { line: lineNo, position, color } = action.payload as ChangeColorPayload;
      const linesAfterColorChange = state.lines.map((line: Line, index: number) => {
        if (index === lineNo) {
          const newLine = { ...line, [position]: color };
          const canSubmit = canSubmitLine(newLine);
          return { ...newLine, canSubmit };
        }
        return line;
      });
      return { ...state, lines: linesAfterColorChange };

    default:
      console.error('Unhandled action', action);
      return state;
  }
};

/**
 * A wrapper around Reducer that logs newly created state.
 * @param state
 * @param action
 * @constructor
 */
const LoggableReducer = (state: State, action: Action): State => {
  const newState = Reducer(state, action);
  console.log('New state', newState);
  return newState;
};

export default isProd ? Reducer : LoggableReducer;
