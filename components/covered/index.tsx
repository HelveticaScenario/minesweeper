import { FC } from 'react';
import { useFela } from '../theme';

interface CoveredProps {}
const Covered: FC<CoveredProps> = () => {
  const { css } = useFela();
  const style = css({});
  return <div className={style} />;
};
export default Covered;
