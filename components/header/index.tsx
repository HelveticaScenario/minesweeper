import { FC } from 'react';
import { useFela } from 'react-fela';
import { useDispatch } from 'react-redux';
import { actions } from '../../state/reducer';
import { useSelector } from '../../state/store';
import { WinState } from '../../state/types';

const height = 50;

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const minesRemaining = useSelector(
    state => state.difficulty.mineCount - state.flagCount
  );
  const winState = useSelector(state => state.winState);
  const dispatch = useDispatch();
  const { css } = useFela();
  let statusText = `Mines Remaining (${minesRemaining})`;
  if (winState !== WinState.Playing) {
    statusText = `You ${WinState[winState]}`;
  }
  return (
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
        {statusText}
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
  );
};
export default Header;
