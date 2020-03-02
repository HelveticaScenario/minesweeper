import { FC } from 'react';
import { useFela } from '../../utils';
import Square from '../square';
import { makeCoords } from '../../utils/index';
import { useSelector } from '../../state/store';

export interface DeskProps {}

const Desk: FC<DeskProps> = ({}) => {
  const grid = useSelector(state => state.grid);
  const difficulty = useSelector(state => state.difficulty);
  const {
    css,
    theme: { squareDimension }
  } = useFela();

  const style = css({
    width: squareDimension.width * difficulty.width + 2,
    height: squareDimension.width * difficulty.height + 2,
    borderRight: `1px solid black`,
    borderBottom: `1px solid black`,
    alignSelf: 'center',
    display: 'grid',
    gridTemplateColumns: `repeat(${difficulty.width}, 1fr)`,
    gridTemplateRows: `repeat(${difficulty.height}, 1fr)`
  });

  const children = grid.map((square, i) => (
    <Square key={i} square={square} coords={makeCoords(difficulty.width, i)} />
  ));
  return <div className={style}>{children}</div>;
};

export default Desk;
