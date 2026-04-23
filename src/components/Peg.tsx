import type { MouseEventHandler } from 'react';
import { PEG_COLOR_BY_ID, type ColorId } from '@/game/config';
import { useI18n } from '@/i18n/context';
import type { TranslationKey } from '@/i18n/locales';
import { Icon } from './Icon';

type PegVariant = 'empty' | 'locked' | 'active-empty' | 'filled';

interface PegProps {
  variant: PegVariant;
  color?: ColorId;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
}

const BASE = 'w-[5em] h-[5em] rounded-full flex items-center justify-center shrink-0';

const COLOR_LABEL_KEY: Record<ColorId, TranslationKey> = {
  red: 'pickerColorRed',
  orange: 'pickerColorOrange',
  yellow: 'pickerColorYellow',
  green: 'pickerColorGreen',
  blue: 'pickerColorBlue',
  purple: 'pickerColorPurple',
};

export const Peg = ({ variant, color, onClick, ariaLabel }: PegProps) => {
  const { t } = useI18n();

  if (variant === 'filled' && color) {
    const spec = PEG_COLOR_BY_ID[color];
    const label = ariaLabel ?? t(COLOR_LABEL_KEY[color]);
    const className = `${BASE} ${spec.bg} border border-white/20`;
    const style = { boxShadow: `0 0 1.5em ${spec.glow}` };
    return onClick ? (
      <button
        type="button"
        className={`${className} hover:scale-105 active:scale-95 transition-transform`}
        style={style}
        onClick={onClick}
        aria-label={label}
      />
    ) : (
      <div className={className} style={style} aria-label={label} role="img" />
    );
  }

  if (variant === 'locked') {
    return (
      <div
        className={`${BASE} bg-surface-container-high border border-outline shadow-inner`}
        role="img"
        aria-label={ariaLabel ?? t('pegHiddenColor')}
      >
        <Icon name="lock" className="text-outline text-[2.5em]" />
      </div>
    );
  }

  if (variant === 'active-empty') {
    return (
      <button
        type="button"
        className={`${BASE} bg-surface-container-high border-[0.2em] border-dashed border-slate-400 text-slate-400 animate-pulse`}
        onClick={onClick}
        aria-label={ariaLabel ?? t('pegSelectColor')}
      />
    );
  }

  return (
    <div className={`${BASE} bg-surface-container-lowest border border-outline-variant`} aria-hidden="true" />
  );
};
