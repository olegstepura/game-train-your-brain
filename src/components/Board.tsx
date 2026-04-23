import { Fragment } from 'react';
import { useGame } from '@/game/store';
import { AttemptRow } from './AttemptRow';

export const Board = () => {
  const { state } = useGame();
  const playing = state.status === 'playing';
  const lastIdx = state.rows.length - 1;

  const isActive = (idx: number) => playing && idx === state.activeRow;

  return (
    <div className="glass-panel w-full rounded-[2em] p-[1.5em] flex flex-col relative z-10">
      <div className="noise-overlay" />
      {state.rows.map((row, idx) => (
        <Fragment key={idx}>
          <AttemptRow rowIdx={idx} row={row} isActive={isActive(idx)} />
          {idx < lastIdx && (
            <RowDivider visible={!isActive(idx) && !isActive(idx + 1)} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

/** A 1px line sitting in the middle of a 0.8em gap — equidistant from the
 * peg centers of the rows above and below. Stays in layout even when hidden,
 * so rows next to the active row keep consistent spacing. */
const RowDivider = ({ visible }: { visible: boolean }) => (
  <div
    aria-hidden="true"
    className="h-px mx-[1em] my-[0.4em]"
    style={{
      backgroundColor: visible ? 'var(--row-separator)' : 'transparent',
    }}
  />
);
