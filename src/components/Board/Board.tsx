import React, { useContext, useEffect } from 'react';
import { Context } from 'store/store';
import { ActionType, Colors, GameStatus } from 'store/types';
import BoardLines from './BoardLine/BoardLines';
import BoardHidden from './BoardHidden/BoardHidden';
import './Board.css';

const Board = () => {
  const { state, dispatch } = useContext(Context);

  const startGame = () => dispatch({ type: ActionType.GameStart });

  useEffect(() => {
    console.log('New random sequence', Object.values(state.hidden).map(v => Colors.indexOf(v) + 1));
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
        <img src="logo.png" alt="App logo" className="App-logo"/>
        <span className="Board-msg">Click to start</span>
        <div className="Board-credentials">
          Weekend React.js project by Oleg Stepura<br />
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
