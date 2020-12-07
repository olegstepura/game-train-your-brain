import BoardLine from './BoardLine';
import { linesAmount } from 'config';

const BoardLines = () => {
  const lines = [];

  for (let i = 0; i < linesAmount; i++) {
    lines.push(<BoardLine line={i} key={`line-${i}`}/>);
  }

  return (
    <>
      {lines.reverse()}
    </>
  );
};

export default BoardLines;
