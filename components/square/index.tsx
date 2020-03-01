import { useFela } from '../theme';
import {
  Square as ISquare,
  SquareType,
  Coords,
  WinState
} from '../../state/types';
import Flag from '../flag';
import { ReactNode, FC } from 'react';
import Mine from '../mine';
import Exposed from '../exposed';
import Covered from '../covered';
import { actions } from '../../state/reducer';
import { useSelector } from '../../state/store';
import { useDispatch } from 'react-redux';

interface SquareProps {
  square: ISquare;
  coords: Coords;
}

const Square: FC<SquareProps> = ({ square, coords }) => {
  const winState = useSelector(state => state.winState);
  const dispatch = useDispatch();
  const { css } = useFela();
  const showMine =
    winState === WinState.Lost && square.type === SquareType.Mine;
  let exposed = square.exposed || showMine;

  const style = css({
    cursor: winState !== WinState.Playing || exposed ? 'initial' : 'pointer',
    backgroundColor: exposed ? '#CCC' : '#FFF',
    borderTop: `1px solid black`,
    borderLeft: `1px solid black`,
    lineHeight: 1,
    textAlign: 'center',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'content-box'
  });

  let child: ReactNode;
  if (square.flagged) {
    child = <Flag />;
  } else if (square.exposed && square.type === SquareType.Blank) {
    child = <Exposed blank={square} />;
  } else if (showMine) {
    child = <Mine />;
  } else {
    child = <Covered />;
  }

  return (
    <div
      onClick={e => {
        e.preventDefault();
        if (winState !== WinState.Playing || square.flagged) {
          return;
        }
        if (e.button === 0) {
          dispatch(
            actions.chooseSquare({
              ...coords
            })
          );
        }
      }}
      onContextMenu={e => {
        e.preventDefault();
        if (winState !== WinState.Playing || square.exposed) {
          return;
        }
        dispatch(
          actions.setFlag({
            ...coords,
            flagState: !square.flagged
          })
        );
      }}
      className={style}
    >
      {child}
    </div>
  );
};

export default Square;
