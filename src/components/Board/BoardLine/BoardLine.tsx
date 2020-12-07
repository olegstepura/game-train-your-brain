import BoardSquares from './BoardSquare/BoardSquares';
import ColorPicker from './ColorPicker/ColorPicker';
import { ActionType, Color, Position, Positions } from 'store/types';
import React, { useContext, useState } from 'react';
import { Context } from 'store/store';
import './BoardLine.css';
import { getRandomSequence } from '../../../store/reducer';

interface BoardLineProps {
  line: number
}

const BoardLine = (props: BoardLineProps) => {
  const { state, dispatch } = useContext(Context);
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [targetOffset, setTargetOffset] = useState<number>(0);
  const { line } = props;
  const { active, canSubmit, result } = state.lines[line];

  const renderResults = () => {
    if (active && line === 0 && !canSubmit) {
      const clickHandler = () => {
        const sequence = getRandomSequence();
        Positions.forEach(position => {
          const color = sequence[position];
          if (color) {
            dispatch({ type: ActionType.ChangeColor, payload: { line, position, color } })
          }
        })
      }
      return (
        <div className="BoardLine-Result">
          <button onClick={clickHandler}>
            ♻️
          </button>
        </div>
      );
    }

    if (active && canSubmit) {
      return (
        <div className="BoardLine-Result">
          <button onClick={() => dispatch({ type: ActionType.LineFinish, payload: line })}>
            👍
          </button>
        </div>
      );
    }

    if (result) {
      return (
        <div className="BoardLine-Result">
          {Array.from(Array(Positions.length - result.colorMatch - result.positionMatch)).map((_, index) => {
            return <span key={`item-${index}`} className="BoardLine-Result-Item"/>;
          })}
          {Array.from(Array(result.colorMatch)).map((_, index) => {
            return <span key={`item-cm-${index}`} className="BoardLine-Result-Item BoardLine-Result-ColorMatch"/>;
          })}
          {Array.from(Array(result.positionMatch)).map((_, index) => {
            return <div key={`item-pm-${index}`} className="BoardLine-Result-Item BoardLine-Result-PositionMatch"/>;
          })}
        </div>
      );
    }

    return (
      <div className="BoardLine-Result"/>
    );
  };

  const squareClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, position: Position): void => {
    const target = event.currentTarget;
    const targetParent = target.parentElement;
    if (targetParent) {
      const x = target.getBoundingClientRect().x - targetParent.getBoundingClientRect().x;
      setTargetOffset(x);
    }
    if (active) {
      if (position === activePosition) {
        setActivePosition(null);
      } else {
        setActivePosition(position);
      }
    }
  };

  const colorSelectHandler = (color: Color) => {
    if (activePosition !== null) {
      dispatch({ type: ActionType.ChangeColor, payload: { line, position: activePosition, color } });
      setActivePosition(null);
    }
  };

  return (
    <div className={`BoardLine ${active ? 'BoardLine--active' : ''}`}>
      <BoardSquares line={line} onSquareClick={squareClickHandler} activePosition={activePosition}/>
      {renderResults()}
      {active && activePosition !== null
        ? <ColorPicker onColorSelect={colorSelectHandler} targetOffsetX={targetOffset + 1}/>
        : null
      }
    </div>
  );
};

export default BoardLine;
