import { FC } from 'react';
import { useFela } from 'react-fela';
import { useDispatch } from 'react-redux';
import { actions } from '../../state/reducer';
import { useSelector } from '../../state/store';
import { WinState } from '../../state/types';

const height = 50;

interface LayoutProps {}

const Layout: FC<LayoutProps> = ({ children }) => {
  const winState = useSelector(state => state.winState);
  const dispatch = useDispatch();
  const { css } = useFela();
  return (
    <div>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        })}
      >
        <h1
          className={css({
            height
          })}
        >
          Minesweeper ({WinState[winState]})
        </h1>
        <button
          className={css({
            height
          })}
          onClick={() => dispatch(actions.newGame())}
        >
          New Game
        </button>
      </div>
      {children}
    </div>
  );
};
export default Layout;
