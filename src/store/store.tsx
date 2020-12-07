import React, { createContext, Dispatch, useReducer } from 'react';
import Reducer, { initialState } from './reducer';
import { Action, State } from './types';

export const Context = createContext<{
  state: State
  dispatch: Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
});

export const StoreProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};
