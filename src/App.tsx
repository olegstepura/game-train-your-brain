import { useCallback, useState } from 'react';
import { Board } from '@/components/Board';
import { EndGameOverlay } from '@/components/EndGameOverlay';
import { Header } from '@/components/Header';
import { ForkMe } from '@/components/ForkMe';
import { HowToPlay } from '@/components/HowToPlay';
import { useGame } from '@/game/store';

const INFO_SEEN_KEY = 'tyb.info-seen';

const firstVisit = (): boolean => {
  try {
    return localStorage.getItem(INFO_SEEN_KEY) !== 'true';
  } catch {
    return false;
  }
};

const markInfoSeen = () => {
  try {
    localStorage.setItem(INFO_SEEN_KEY, 'true');
  } catch {
    /* ignore */
  }
};

export const App = () => {
  const { state, dispatch } = useGame();
  const [infoOpen, setInfoOpen] = useState(firstVisit);

  const closeInfo = useCallback(() => {
    markInfoSeen();
    setInfoOpen(false);
  }, []);

  const restart = useCallback(() => dispatch({ type: 'start' }), [dispatch]);

  return (
    <div className="game-root w-full h-full flex flex-col items-center justify-center font-body">
      <div className="w-full max-w-[50em] flex flex-col space-y-[1.5em] flex-none">
        <Header onRestart={restart} onShowHelp={() => setInfoOpen(true)} />
        <Board />
      </div>

      <ForkMe url="https://github.com/olegstepura/game-train-your-brain" />

      {infoOpen && <HowToPlay onClose={closeInfo} />}
      {!infoOpen && state.status !== 'playing' && (
        <EndGameOverlay status={state.status} onRestart={restart} />
      )}
    </div>
  );
};
