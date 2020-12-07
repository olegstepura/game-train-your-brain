import { Context } from 'store/store';
import { Position } from 'store/types';
import React, { useContext } from 'react';
import './BoardSquare.css';

export interface BoardSquareProps {
  line: number
  position: Position
  active: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const BoardSquare = (props: BoardSquareProps) => {
  const { state } = useContext(Context);
  const { line, position, onClick, active } = props;

  return (
    <div
      className={`BoardSquare ${active ? 'BoardSquare--active' : ''}`}
      style={{ backgroundColor: state.lines[line][position] }}
      onClick={onClick}
    />
  );
};

export default BoardSquare;
