import React from 'react';
import Board from 'components/Board/Board';
import { StoreProvider } from 'store/store';
import './App.css';

const App = () => {
  return (
    <StoreProvider>
      <Board/>
    </StoreProvider>
  );
};

export default App;
