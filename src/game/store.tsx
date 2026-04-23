import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { createInitialState } from './logic';
import { reducer } from './reducer';
import type { Action, State } from './types';

interface ContextValue {
  state: State;
  dispatch: Dispatch<Action>;
}

const GameContext = createContext<ContextValue | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info('Hidden sequence:', state.secret.join(', '));
    }
  }, [state.secret]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): ContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
};
