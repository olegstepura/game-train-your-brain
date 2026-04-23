import { useI18n } from '@/i18n/context';
import type { TranslationKey } from '@/i18n/locales';
import type { GameStatus } from '@/game/types';
import { Overlay } from './Overlay';

interface EndGameOverlayProps {
  status: Extract<GameStatus, 'won' | 'lost'>;
  onRestart: () => void;
}

interface Copy {
  emoji: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  ctaKey: TranslationKey;
}

const COPY: Record<'won' | 'lost', Copy> = {
  won: { emoji: '🎉', titleKey: 'wonTitle', bodyKey: 'wonBody', ctaKey: 'wonCta' },
  lost: { emoji: '💀', titleKey: 'lostTitle', bodyKey: 'lostBody', ctaKey: 'lostCta' },
};

export const EndGameOverlay = ({ status, onRestart }: EndGameOverlayProps) => {
  const { t } = useI18n();
  const { emoji, titleKey, bodyKey, ctaKey } = COPY[status];
  return (
    <Overlay onDismiss={onRestart} labelledBy="end-game-title">
      <div className="relative z-10 flex flex-col items-center text-center space-y-[1em]">
        <div className="text-[15em] leading-none" aria-hidden="true">
          {emoji}
        </div>
        <h2
          id="end-game-title"
          className="font-display text-[2.6em] font-bold leading-tight"
        >
          {t(titleKey)}
        </h2>
        <p className="text-[1.8em] mt-[2em] text-on-surface-variant max-w-[30em]">
          {t(bodyKey)}
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="btn-neutral px-[1.6em] py-[0.8em] rounded-[1em] text-[2em]"
        >
          {t(ctaKey)}
        </button>
      </div>
    </Overlay>
  );
};
