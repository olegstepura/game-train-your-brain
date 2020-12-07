import React, { useContext, useEffect } from 'react';
import { Context } from 'store/store';
import { ActionType, Colors, GameStatus } from 'store/types';
import BoardLines from './BoardLine/BoardLines';
import BoardHidden from './BoardHidden/BoardHidden';
import isProd from 'utils/isProd';
import './Board.css';

const Board = () => {
  const { state, dispatch } = useContext(Context);

  const startGame = () => dispatch({ type: ActionType.GameStart });

  useEffect(() => {
    const hidden = Object.values(state.hidden);
    if (!isProd && hidden.length) {
      console.log(`Currently hidden: ${hidden.map(v => Colors.indexOf(v) + 1).join(', ')}`);
    }
  }, [state.hidden])

  if (state.status === GameStatus.GameWin) {
    return (
      <div className="Board Board-win" onClick={() => dispatch({ type: ActionType.GameStart })}>
        <BoardHidden onClick={startGame} />
        <BoardLines/>
        <div className="Board-win-overlay">
          <div>
            <div>🎉</div>
            <div className="Board-msg">Congratulations!<br/>Click to play again</div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === GameStatus.WelcomeScreen) {
    return (
      <div className="Board Board-start" onClick={startGame}>
        <img src="logo.png" alt="App logo" className="App-logo" />
        <span className="Board-msg">Click to start</span>
        <div className="Board-credentials">
          <a href="https://github.com/olegstepura/game-train-your-brain" target="brain-github">
            Weekend React.js project by Oleg Stepura
          </a>
          <br />
          Logo designed by Anastasiya Stepura
        </div>
      </div>
    );
  }

  return (
    <div className="Board">
      <BoardHidden onClick={startGame} />
      <BoardLines/>
    </div>
  );
};

export default Board;
