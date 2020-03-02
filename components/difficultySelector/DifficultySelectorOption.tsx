import { FC } from 'react';
import { useFela } from '../../utils';
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

export default DifficultySelectorOption;
