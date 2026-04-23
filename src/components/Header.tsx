import { PEGS_PER_ROW } from '@/game/config';
import { useGame } from '@/game/store';
import { useI18n } from '@/i18n/context';
import { useTheme } from '@/theme';
import { Icon } from './Icon';
import { LanguageSelector } from './LanguageSelector';
import { Peg } from './Peg';

interface HeaderProps {
  onRestart: () => void;
  onShowHelp: () => void;
}

export const Header = ({ onRestart, onShowHelp }: HeaderProps) => {
  const { state } = useGame();
  const { theme, toggle: toggleTheme } = useTheme();
  const { t } = useI18n();
  const reveal = state.status !== 'playing';

  const nextTheme = theme === 'dark' ? 'headerThemeLight' : 'headerThemeDark';
  const themeLabel = t('headerSwitchTheme', { theme: t(nextTheme) });

  return (
    <div className="glass-panel w-full rounded-[2em] p-[1.5em] relative z-20">
      <div className="noise-overlay" />
      <div className="flex items-center justify-between w-full px-[1em] relative z-10">
        <div className="flex space-x-[1.5em]">
          {Array.from({ length: PEGS_PER_ROW }, (_, i) =>
            reveal ? (
              <Peg key={i} variant="filled" color={state.secret[i]} />
            ) : (
              <Peg key={i} variant="locked" />
            ),
          )}
        </div>
        <div className="flex items-center space-x-[0.8em] ml-[2em]">
          <LanguageSelector />
          <HeaderButton
            icon={theme === 'dark' ? 'light_mode' : 'dark_mode'}
            label={themeLabel}
            onClick={toggleTheme}
          />
          <HeaderButton
            icon="refresh"
            label={t('headerNewGame')}
            onClick={onRestart}
          />
          <HeaderButton
            icon="help"
            label={t('headerHowToPlay')}
            onClick={onShowHelp}
          />
        </div>
      </div>
    </div>
  );
};

interface HeaderButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const HeaderButton = ({ icon, label, onClick }: HeaderButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="w-[3.5em] h-[3.5em] flex items-center justify-center rounded-[0.8em] text-outline hover:text-on-surface hover:bg-white/5 transition-colors"
  >
    <Icon name={icon} className="text-[2.5em]" />
  </button>
);
