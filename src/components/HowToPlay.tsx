import { MAX_ATTEMPTS, PEGS_PER_ROW, PEG_COLORS } from '@/game/config';
import { useI18n } from '@/i18n/context';
import { Overlay } from './Overlay';

interface HowToPlayProps {
  onClose: () => void;
}

export const HowToPlay = ({ onClose }: HowToPlayProps) => {
  const { t } = useI18n();
  return (
    <Overlay onDismiss={onClose} labelledBy="how-to-play-title">
      <div className="relative z-10 space-y-[2em] text-on-surface">
        <h1
          id="how-to-play-title"
          className="font-display text-[3em] font-bold leading-tight"
        >
          {t('howToTitle')}
        </h1>
        <p className="text-[1.6em] leading-snug text-on-surface-variant">
          {t('howToIntro', {
            pegs: PEGS_PER_ROW,
            colors: PEG_COLORS.length,
            attempts: MAX_ATTEMPTS,
          })}
        </p>
        <ul className="text-[1.6em] leading-snug text-on-surface-variant list-disc pl-[1.6em] space-y-[0.4em]">
          <li>{t('howToTapSlot')}</li>
          <li>{t('howToUnique')}</li>
          <li>
            {t('howToHintsPrefix')}{' '}
            <span
              className="inline-block w-[0.8em] h-[0.8em] rounded-full bg-match-strong align-middle mx-[0.4em]"
              style={{ boxShadow: '0 0 0.4em var(--match-strong-glow)' }}
            />
            {t('howToHintExact')}{' '}
            <span
              className="inline-block w-[0.8em] h-[0.8em] rounded-full align-middle mx-[0.4em]"
              style={{ backgroundColor: 'var(--match-color-soft)' }}
            />
            {t('howToHintColor')}
          </li>
          <li>{t('howToRandomize')}</li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="btn-neutral mt-[0.5em] px-[1.6em] py-[0.8em] rounded-[1em] text-[1.6em]"
        >
          {t('howToClose')}
        </button>
      </div>
    </Overlay>
  );
};
