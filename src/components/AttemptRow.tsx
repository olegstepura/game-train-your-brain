import { useState } from 'react';
import { MAX_ATTEMPTS, type ColorId } from '@/game/config';
import { canSubmitRow } from '@/game/logic';
import { useGame } from '@/game/store';
import type { Row } from '@/game/types';
import { useI18n } from '@/i18n/context';
import {
  ColorPicker,
  COLOR_PICKER_WIDTH_EM,
  type PickerPlacement,
} from './ColorPicker';
import { Icon } from './Icon';
import { Peg } from './Peg';
import { ResultDots } from './ResultDots';

interface AttemptRowProps {
  rowIdx: number;
  row: Row;
  isActive: boolean;
}

/** Row-level layout constants (em). Keep in sync with the JSX:
 * row padding `px-[1em]`, peg `w-[5em]`, peg gap `space-x-[1.5em]`.
 * Board content is 47em wide (50em cap minus 1.5em padding per side). */
const ROW_WIDTH_EM = 47;
const pegCenterEm = (pegIdx: number) => 3.5 + pegIdx * 6.5;
const PICKER_HALF_EM = COLOR_PICKER_WIDTH_EM / 2;

export const AttemptRow = ({ rowIdx, row, isActive }: AttemptRowProps) => {
  const { dispatch } = useGame();
  const { t } = useI18n();
  const [openPeg, setOpenPeg] = useState<number | null>(null);
  const submittable = canSubmitRow(row);
  const isEmpty = row.pegs.every((p) => p === null);
  /* The last row's picker must flip above it, otherwise it goes off-screen
     because body overflow is hidden. */
  const placement: PickerPlacement =
    rowIdx === MAX_ATTEMPTS - 1 ? 'above' : 'below';

  const handlePegClick = (pegIdx: number) => {
    if (!isActive) return;
    setOpenPeg((curr) => (curr === pegIdx ? null : pegIdx));
  };

  const handleSelect = (color: ColorId) => {
    if (openPeg === null) return;
    dispatch({ type: 'setPeg', rowIdx, pegIdx: openPeg, color });
    setOpenPeg(null);
  };

  const handleClear = () => {
    if (openPeg === null) return;
    dispatch({ type: 'setPeg', rowIdx, pegIdx: openPeg, color: null });
    setOpenPeg(null);
  };

  const otherColors = row.pegs.filter(
    (p, i): p is ColorId => p !== null && i !== openPeg,
  );
  const canClear = openPeg !== null && row.pegs[openPeg] !== null;

  /* Every row reserves a 1px transparent border so switching between
     non-active and active states doesn't shift pegs by a pixel. */
  const stateClass = isActive
    ? 'rounded-[1em] bg-slate-500/10 bloom-active-neutral'
    : '';

  const pickerPlacement =
    openPeg !== null ? computePickerPlacement(openPeg) : null;

  return (
    <div
      className={`relative flex items-center justify-between w-full py-[1em] px-[1em] border border-transparent transition-colors ${stateClass}`}
      aria-current={isActive ? 'step' : undefined}
    >
      <div className="flex space-x-[1.5em]">
        {row.pegs.map((peg, pegIdx) => (
          <Peg
            key={pegIdx}
            variant={
              peg !== null
                ? 'filled'
                : isActive
                  ? 'active-empty'
                  : 'empty'
            }
            color={peg ?? undefined}
            onClick={isActive ? () => handlePegClick(pegIdx) : undefined}
          />
        ))}
      </div>

      {isActive && submittable ? (
        <RowActionButton
          icon="check"
          label={t('rowSubmit')}
          onClick={() => dispatch({ type: 'submit' })}
          variant="submit"
        />
      ) : isActive && isEmpty ? (
        <RowActionButton
          icon="casino"
          label={t('rowRandomize')}
          onClick={() => dispatch({ type: 'randomizeActive' })}
          variant="neutral"
        />
      ) : (
        <ResultDots result={row.result} />
      )}

      {isActive && pickerPlacement && (
        <div
          className="absolute z-50"
          style={{
            left: `${pickerPlacement.centerEm}em`,
            transform: 'translateX(-50%)',
            ...(placement === 'below'
              ? { top: 'calc(100% + 0.8em)' }
              : { bottom: 'calc(100% + 0.8em)' }),
          }}
        >
          <ColorPicker
            disabledColors={otherColors}
            canClear={canClear}
            onSelect={handleSelect}
            onClear={handleClear}
            onDismiss={() => setOpenPeg(null)}
            triangleOffsetEm={pickerPlacement.triangleEm}
            placement={placement}
          />
        </div>
      )}
    </div>
  );
};

interface RowActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  variant: 'submit' | 'neutral';
}

const RowActionButton = ({ icon, label, onClick, variant }: RowActionButtonProps) => {
  const base =
    'ml-[2em] w-[3.5em] h-[3.5em] rounded-[0.8em] flex items-center justify-center transition-colors';

  if (variant === 'submit') {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`${base} text-white border border-white/20`}
        style={{
          backgroundColor: '#475569',
          boxShadow: '0 0 1.5em rgba(71, 85, 105, 0.6)',
        }}
      >
        <Icon name={icon} className="text-[2em]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`btn-neutral ${base}`}
    >
      <Icon name={icon} className="text-[2em]" />
    </button>
  );
};

/** Center the picker on the active peg, then clamp it so it never overflows
 * the row. The triangle keeps pointing at the peg — it lands at the picker's
 * center for inner pegs and slides toward the edge for outer pegs. */
const computePickerPlacement = (pegIdx: number) => {
  const pegCenter = pegCenterEm(pegIdx);
  const min = PICKER_HALF_EM;
  const max = ROW_WIDTH_EM - PICKER_HALF_EM;
  const centerEm = Math.max(min, Math.min(pegCenter, max));
  const triangleEm = pegCenter - (centerEm - PICKER_HALF_EM);
  return { centerEm, triangleEm };
};
