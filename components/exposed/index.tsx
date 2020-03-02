import { FC } from 'react';
import { Blank } from '../../state/types';

interface ExposedProps {
  blank: Blank;
}

const Exposed: FC<ExposedProps> = ({ blank }) => {
  const child = blank.minesAdjacent > 0 ? blank.minesAdjacent : '';
  return <div>{child}</div>;
};

export default Exposed;
