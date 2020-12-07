import BoardSquare from './BoardSquare';
import { Position, Positions } from 'store/types';
import React from 'react';

interface BoardSquaresProps {
  line: number
  activePosition: Position | null
  onSquareClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, p: Position) => void
}

const BoardSquares = (props: BoardSquaresProps) => {
  const squares = [];
  const { line, onSquareClick, activePosition } = props;

  for (let i = 0; i < Positions.length; i++) {
    const position = Positions[i];
    squares.push(
      <BoardSquare
        key={`square-${line}-${i}`}
        line={line}
        position={position}
        active={activePosition === position}
        onClick={(event) => onSquareClick(event, position)}
      />,
    );
  }

  return (
    <>
      {squares}
    </>
  );
};


export default BoardSquares;
