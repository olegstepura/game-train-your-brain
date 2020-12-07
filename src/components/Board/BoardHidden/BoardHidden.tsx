import { useContext } from 'react';
import { Context } from 'store/store';
import './BoardHidden.css';
import { GameStatus, Positions } from 'store/types';

interface BoardGuessedProps {
  onClick: () => void
}

const BoardHidden = (props: BoardGuessedProps) => {
  const { state } = useContext(Context);
  const { onClick } = props;
  const squares = [];

  for (let i = 0; i < Positions.length; i++) {
    squares.push(
      <div
        key={`hidden-${i}`}
        className={`BoardSquare ${state.status === GameStatus.GameWin ? '' : 'BoardSquare--hidden'}`}
        style={state.status === GameStatus.GameWin ? { backgroundColor: state.hidden[Positions[i]] } : {}}
      />,
    );
  }

  return (
    <div className="BoardHidden" onClick={onClick} title="Click to start new game">
      {squares}
      <div className="BoardLine-Result"/>
    </div>
  );
};

export default BoardHidden;
