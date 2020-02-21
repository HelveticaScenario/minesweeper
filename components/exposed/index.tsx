import { FC } from 'react';
import { useFela } from '../theme';
import { Blank } from '../../state/types';

interface ExposedProps {
  blank: Blank;
}
const Exposed: FC<ExposedProps> = ({ blank }) => {
  const { css } = useFela();
  const style = css({});
  const child = blank.minesAdjacent > 0 ? blank.minesAdjacent : '';
  return <div className={style}>{child}</div>;
};

export default Exposed;
