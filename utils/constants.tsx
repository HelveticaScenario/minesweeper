import { DifficultyOptions } from '../state/types';

export const difficultyOptionArray: readonly DifficultyOptions[] = Object.keys(
  DifficultyOptions
).map(key => DifficultyOptions[key] as DifficultyOptions);
