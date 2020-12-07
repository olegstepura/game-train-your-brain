import { useContext } from 'react';
import { Context } from 'store/store';
import './BoardHidden.css';
import { GameStatus, Positions, WithOnClick } from 'store/types';

const BoardHidden = (props: WithOnClick) => {
  const { state } = useContext(Context);
  const { onClick } = props;
  const squares = [];

  for (let i = 0; i < Positions.length; i++) {
    squares.push(
      <div
        key={`hidden-${i}`}
        className={`BoardSquare ${state.status === GameStatus.GameWin ? '' : 'BoardSquare--hidden'}`}
        style={[GameStatus.GameOver, GameStatus.GameWin].includes(state.status) ? { backgroundColor: state.hidden[Positions[i]] } : {}}
      />,
    );
  }

  return (
    <div className="BoardHidden" onClick={onClick} title="Click to start new game">
      {squares}
      <div className="BoardLine__Result"/>
    </div>
  );
};

export default BoardHidden;
