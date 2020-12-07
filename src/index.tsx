import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from 'store/store';
import './index.css';
import reportWebVitals from './utils/reportWebVitals';
import './utils/mobile100vhFix';
import Board from './components/Board/Board';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <Board/>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
