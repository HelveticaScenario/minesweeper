import { FC } from 'react';
import { useFela } from '../theme';
import Square from '../square';
import { makeCoords } from '../../utils/index';
import { useSelector } from '../../state/store';

export interface DeskProps {}
const Desk: FC<DeskProps> = ({}) => {
  const grid = useSelector(state => state.grid);
  const dimensions = useSelector(state => state.dimensions);
  const {
    css,
    theme: { squareDimension }
  } = useFela();
  const style = css({
    width: squareDimension.width * dimensions.width + 2,
    height: squareDimension.width * dimensions.height + 2,
    border: `1px solid black`,
    display: 'grid',
    gridTemplateColumns: `repeat(${dimensions.width}, 1fr)`,
    gridTemplateRows: `repeat(${dimensions.height}, 1fr)`
  });
  const children = grid.map((square, i) => (
    <Square key={i} square={square} coords={makeCoords(dimensions.width, i)} />
  ));
  return <div className={style}>{children}</div>;
};

export default Desk;
