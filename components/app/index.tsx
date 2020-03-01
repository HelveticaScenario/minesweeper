import { FC } from 'react';
import Desk from '../desk';
import Header from '../header';

import Fullscreen from '../fullscreen';
import Theme, { useFela } from '../theme';
import DifficultySelector from '../difficultySelector';

interface AppState {}
const App: FC<AppState> = () => {
  const { css } = useFela();
  return (
    <Theme>
      <Fullscreen>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            minWidth: 450
          })}
        >
          <Header />
          <Desk />
          <DifficultySelector />
        </div>
      </Fullscreen>
    </Theme>
  );
};

export default App;
