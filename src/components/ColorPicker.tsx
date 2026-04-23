import { useEffect, type CSSProperties } from 'react';
import { PEG_COLORS, type ColorId } from '@/game/config';
import { useI18n } from '@/i18n/context';
import type { TranslationKey } from '@/i18n/locales';
import { Icon } from './Icon';

export type PickerPlacement = 'above' | 'below';

interface ColorPickerProps {
  disabledColors: readonly ColorId[];
  canClear: boolean;
  onSelect: (color: ColorId) => void;
  onClear: () => void;
  onDismiss: () => void;
  /** X of the triangle center, in em, measured from the picker's left edge. */
  triangleOffsetEm: number;
  placement: PickerPlacement;
}

/** Width of a rendered ColorPicker in game units.
 * 7 buttons × 3.5em + 6 gaps × 0.7em + 2 × 1em padding = 30.7em. */
export const COLOR_PICKER_WIDTH_EM = 30.7;

const TRIANGLE_SIZE_EM = 2;
const TRIANGLE_HALF_EM = TRIANGLE_SIZE_EM / 2;

const COLOR_LABEL_KEY: Record<ColorId, TranslationKey> = {
  red: 'pickerColorRed',
  orange: 'pickerColorOrange',
  yellow: 'pickerColorYellow',
  green: 'pickerColorGreen',
  blue: 'pickerColorBlue',
  purple: 'pickerColorPurple',
};

export const ColorPicker = ({
  disabledColors,
  canClear,
  onSelect,
  onClear,
  onDismiss,
  triangleOffsetEm,
  placement,
}: ColorPickerProps) => {
  const { t } = useI18n();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  return (
    <>
      <div
        className="glass-panel p-[1em] rounded-[1em] flex gap-[0.7em] bloom-active"
        role="dialog"
        aria-label={t('pickerDialogLabel')}
      >
        {PEG_COLORS.map((c) => {
          const disabled = disabledColors.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(c.id)}
              aria-label={t(COLOR_LABEL_KEY[c.id])}
              className={`w-[3.5em] h-[3.5em] rounded-[0.7em] border border-white/20 transition-transform ${c.bg} ${
                disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:scale-110 active:scale-95'
              }`}
              style={{ boxShadow: `0 0 1em ${c.glow}` }}
            />
          );
        })}
        <button
          type="button"
          onClick={onClear}
          disabled={!canClear}
          aria-label={t('pickerClearColor')}
          title={t('pickerClearColor')}
          className={`w-[3.5em] h-[3.5em] rounded-[0.7em] border border-outline-variant flex items-center justify-center transition-transform ${
            canClear
              ? 'text-on-surface-variant hover:text-on-surface hover:scale-110 active:scale-95'
              : 'opacity-30 cursor-not-allowed text-outline'
          }`}
        >
          <Icon name="close" className="text-[2em]" />
        </button>
      </div>
      {/* Triangle is a sibling of the glass-panel so its `left` is measured
          from the wrapper's edge — no 1px border offset to worry about.
          The polygon + borders flip for above/below placement so the arrow
          always points at the active peg. */}
      <span
        aria-hidden="true"
        className="absolute rotate-45"
        style={trianglePositionStyle(placement, triangleOffsetEm)}
      />
    </>
  );
};

const trianglePositionStyle = (
  placement: PickerPlacement,
  triangleOffsetEm: number,
): CSSProperties => {
  const common: CSSProperties = {
    left: `calc(${triangleOffsetEm}em - ${TRIANGLE_HALF_EM}em + 0.2em)`,
    width: `${TRIANGLE_SIZE_EM}em`,
    height: `${TRIANGLE_SIZE_EM}em`,
    background: 'var(--glass-bg-solid)',
  };
  if (placement === 'below') {
    return {
      ...common,
      top: `calc(-${TRIANGLE_HALF_EM}em + 1px)`,
      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
      borderTop: '1px solid var(--bloom-border)',
      borderLeft: '1px solid var(--bloom-border)',
    };
  }
  return {
    ...common,
    bottom: `calc(-${TRIANGLE_HALF_EM}em + 1px)`,
    clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
    borderBottom: '1px solid var(--bloom-border)',
    borderRight: '1px solid var(--bloom-border)',
  };
};
