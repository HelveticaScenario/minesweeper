import { FC } from 'react';
import { useFela } from '../../utils';
import { useSelector } from '../../state/store';
import DifficultySelectorOption from './DifficultySelectorOption';
import { difficultyOptionArray } from '../../utils/constants';

interface DifficultySelectorProps {}

const DifficultySelector: FC<DifficultySelectorProps> = () => {
  const difficultyOption = useSelector(state => state.difficultyOption);
  const { css } = useFela();

  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        height: 40
      })}
    >
      {difficultyOptionArray.map(option => (
        <DifficultySelectorOption
          option={option}
          selected={difficultyOption === option}
        />
      ))}
    </div>
  );
};

export default DifficultySelector;
