import { FC } from 'react';
import Desk from '../desk';
import Layout from '../layout';

import Fullscreen from '../fullscreen';
import Theme from '../theme';

interface AppState {}
const App: FC<AppState> = () => {
  return (
    <Theme>
      <Fullscreen>
        <Layout>
          <Desk />
        </Layout>
      </Fullscreen>
    </Theme>
  );
};

export default App;
