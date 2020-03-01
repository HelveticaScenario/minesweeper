import { FC } from 'react';
import { useFela } from '../theme';
import { useSelector } from '../../state/store';
import { DifficultyOptions } from '../../state/types';
import { useDispatch } from 'react-redux';
import { actions } from '../../state/reducer';

interface DifficultySelectorOptionProps {
  option: DifficultyOptions;
  selected: boolean;
}
const DifficultySelectorOption: FC<DifficultySelectorOptionProps> = ({
  option,
  selected
}) => {
  const dispatch = useDispatch();
  const { css } = useFela();
  return (
    <button
      className={css({
        margin: 5
      })}
      onClick={() => dispatch(actions.selectDifficulty(option))}
      disabled={selected}
    >
      {DifficultyOptions[option]}
    </button>
  );
};
interface DifficultySelectorProps {}
const DifficultySelector: FC<DifficultySelectorProps> = () => {
  const difficultyOption = useSelector(state => state.difficultyOption);
  const { css } = useFela();
  console.log(DifficultyOptions);

  const options = Object.keys(DifficultyOptions).map(
    key => DifficultyOptions[key] as DifficultyOptions
  );

  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        height: 40
      })}
    >
      {options.map(option => (
        <DifficultySelectorOption
          option={option}
          selected={difficultyOption === option}
        />
      ))}
    </div>
  );
};

export default DifficultySelector;
