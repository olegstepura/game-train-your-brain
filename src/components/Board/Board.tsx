import React, { useContext, useEffect, useState } from 'react';
import { Context } from 'store/store';
import { ActionType, Colors, GameStatus } from 'store/types';
import BoardLines from './BoardLine/BoardLines';
import BoardHidden from './BoardHidden/BoardHidden';
import isProd from 'utils/isProd';
import BoardInfo from './BoardInfo/BoardInfo';
import BoardWelcome from './BoardWelcome/BoardWelcome';
import './Board.css';

const Board = () => {
  const { state, dispatch } = useContext(Context);
  const infoInitial = localStorage.getItem('os-info-shown') !== 'true';
  const [infoShown, showInfo] = useState(infoInitial);

  const startGame = () => {
    dispatch({ type: ActionType.GameStart });
  }

  const hideOverlay = () => {
    showInfo(false);
    localStorage.setItem('os-info-shown', 'true');
  }

  useEffect(() => {
    const hidden = Object.values(state.hidden);
    if (!isProd && hidden.length) {
      console.log(`Currently hidden: ${hidden.map(v => Colors.indexOf(v) + 1).join(', ')}`);
    }
  }, [state.hidden])

  if (state.status === GameStatus.WelcomeScreen) {
    return <BoardWelcome onClick={startGame}/>;
  }

  let overlay;
  if (state.status === GameStatus.GameWin) {
    overlay = (
      <div className="Board__Overlay" onClick={startGame}>
        <div>
          <div>🎉</div>
          <div className="Board__Msg">Congratulations!<br/>Click to play again</div>
        </div>
      </div>
    );
  }

  if (state.status === GameStatus.GameOver) {
    overlay = (
      <div className="Board__Overlay" onClick={startGame}>
        <div>
          <div>❌</div>
          <div className="Board__Msg">Game over!<br/>Click to play again</div>
        </div>
      </div>
    );
  }

  if (infoShown) {
    overlay = <BoardInfo onClick={hideOverlay} />;
  }

  const hasOverlay = [GameStatus.GameWin, GameStatus.GameOver].includes(state.status) || infoShown;

  return (
    <div className={`Board ${hasOverlay ? 'Board-with-overlay' : ''}`}>
      <BoardHidden onClick={startGame}/>
      <BoardLines/>
      {overlay}
      <button className="InfoButton" onClick={() => showInfo(!infoShown)}>ℹ️</button>
    </div>
  );
};

export default Board;
