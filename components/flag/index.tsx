import { FC } from 'react';
import { useFela } from '../../utils';

interface FlagProps {}

const Flag: FC<FlagProps> = () => {
  const { theme } = useFela();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: theme.squareDimension.width / 2,
          height: theme.squareDimension.height / 2
        }}
      >
        <svg x="0px" y="0px" viewBox="0 0 48 60">
          <g>
            <path d="M8.3,35.5V2.2c-0.1-1-0.9-1.7-1.9-1.7c-1.1,0-2,0.9-2,2v2.8v22v18.3c0,1.1,0.9,2,2,2s2-0.9,2-2L8.3,35.5L8.3,35.5z" />
            <path d="M43.3,26.3c-1.6-3.6-3.2-7.2-4.9-10.9c1.7-3.4,3.3-6.4,4.9-9.1c0.3-0.5,0.3-1.1,0.1-1.7s-0.7-1-1.3-1.2   c-2.5-0.7-5.1-1.1-8-1.1c-3.5,0-7.1,0.5-10.5,1c-3.4,0.5-6.6,1-9.9,1c-0.5,0-1.1,0-1.6,0v25.9c0.5,0,1.1,0,1.6,0   c3.5,0,7.1-0.5,10.5-1c3.4-0.5,6.6-1,9.9-1c2.5,0,4.8,0.3,6.9,0.9c0.2,0.1,0.4,0.1,0.6,0.1c0,0,0,0,0,0c1.1,0,2-0.9,2-2   C43.6,26.9,43.5,26.6,43.3,26.3z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Flag;
