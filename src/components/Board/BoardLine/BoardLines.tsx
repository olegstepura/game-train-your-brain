import BoardLine from './BoardLine';
import { linesAmount } from 'config';

// any because of https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20356
const BoardLines: any = () => {
  const lines = [];

  for (let i = 0; i < linesAmount; i++) {
    lines.push(<BoardLine line={i} key={`line-${i}`}/>);
  }

  return lines.reverse();
};

export default BoardLines;
