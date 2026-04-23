import { PEGS_PER_ROW } from '@/game/config';
import type { Result } from '@/game/types';
import { useI18n } from '@/i18n/context';

type DotKind = 'position' | 'color' | 'blank';

const DOT_BASE = 'w-[1.5em] h-[1.5em] rounded-full';

const DOT_STYLES: Record<DotKind, { className: string; style?: React.CSSProperties }> = {
  position: {
    className: `${DOT_BASE} bg-match-strong`,
    style: { boxShadow: '0 0 0.5em var(--match-strong-glow)' },
  },
  color: {
    className: DOT_BASE,
    style: { backgroundColor: 'var(--match-color-soft)' },
  },
  blank: {
    className: `${DOT_BASE} bg-surface-container-lowest border border-outline-variant`,
  },
};

const dotsForResult = (result: Result | null): DotKind[] => {
  if (!result) return Array<DotKind>(PEGS_PER_ROW).fill('blank');
  const { positionMatch, colorMatch } = result;
  const miss = PEGS_PER_ROW - positionMatch - colorMatch;
  return [
    ...Array<DotKind>(positionMatch).fill('position'),
    ...Array<DotKind>(colorMatch).fill('color'),
    ...Array<DotKind>(miss).fill('blank'),
  ];
};

interface ResultDotsProps {
  result: Result | null;
}

export const ResultDots = ({ result }: ResultDotsProps) => {
  const { t } = useI18n();
  const label = result
    ? t('resultsSummary', {
        pos: result.positionMatch,
        col: result.colorMatch,
      })
    : t('resultsNone');
  return (
    <div
      className="grid grid-cols-2 gap-[0.5em] w-[3.5em] ml-[2em] shrink-0"
      role="group"
      aria-label={label}
    >
      {dotsForResult(result).map((kind, i) => {
        const { className, style } = DOT_STYLES[kind];
        return <span key={i} className={className} style={style} />;
      })}
    </div>
  );
};
