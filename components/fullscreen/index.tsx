import { FC } from 'react';
import { useFela } from '../../utils';

interface FullscreenProps {}

const Fullscreen: FC<FullscreenProps> = ({ children }) => {
  const { css } = useFela();

  const style = css({
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center'
  });

  return <div className={style}>{children}</div>;
};

export default Fullscreen;
