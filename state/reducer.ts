import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import {
  makeIndex,
  makeCoords,
  simpleQueue,
  incOnTrueDecOnFalse
} from '../utils';
import {
  Coords,
  Square,
  Board,
  SquareType,
  Mine,
  Blank,
  WinState,
  Difficulties,
  DifficultyOptions
} from './types';

export const difficulties: Difficulties = {
  [DifficultyOptions.Beginner]: {
    width: 9,
    height: 9,
    mineCount: 10
  },
  [DifficultyOptions.Intermediate]: {
    width: 16,
    height: 16,
    mineCount: 40
  },
  [DifficultyOptions.Expert]: {
    width: 24,
    height: 24,
    mineCount: 99
  }
};

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const makeMine = (): Mine => ({
  type: SquareType.Mine,
  flagged: false,
  exposed: false
});

export const makeBlank = (minesAdjacent: number): Blank => ({
  type: SquareType.Blank,
  flagged: false,
  exposed: false,
  minesAdjacent
});

export const createBoard = (difficultyOption: DifficultyOptions): Board => {
  const { width, height, mineCount } = difficulties[difficultyOption];

  const grid: Square[] = Array(width * height);

  const getAdjacentMineCount = (_x: number, _y: number) => {
    let count = 0;
    for (let offY = -1; offY <= 1; offY++) {
      for (let offX = -1; offX <= 1; offX++) {
        if (offX === 0 && offY === 0) {
          continue;
        }

        const [x, y] = [_x + offX, _y + offY];

        if (x < 0 || y < 0 || x >= width || y >= height) {
          continue;
        }
        const index = makeIndex(width, x, y);
        if (grid[index]?.type === SquareType.Mine) {
          count++;
        }
      }
    }
    return count;
  };

  const mineIndices: Set<number> = new Set();

  while (mineIndices.size < mineCount) {
    const randX = getRandomInt(width);
    const randY = getRandomInt(height);
    const index = makeIndex(width, randX, randY);
    mineIndices.add(index);
  }

  for (let index of mineIndices) {
    grid[index] = makeMine();
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = makeIndex(width, x, y);
      if (grid[index] == null) {
        grid[index] = makeBlank(getAdjacentMineCount(x, y));
      }
    }
  }

  return {
    grid,
    difficultyOption,
    difficulty: { width, height, mineCount },
    flagCount: 0,
    flaggedMineCount: 0,
    winState: WinState.Playing,
    mineIndices: Array.from(mineIndices)
  };
};

const queue = simpleQueue();
const { dequeue, enqueue, resizeAndClear } = queue;

const chooseSquare: CaseReducer<Board, PayloadAction<Coords>> = (
  draft,
  { payload }
) => {
  const { width, height } = draft.difficulty;
  const index = (c: Coords) => makeIndex(width, c.x, c.y);

  const coords = (idx: number) => makeCoords(width, idx);

  if (draft.grid[index(payload)].type === SquareType.Mine) {
    draft.winState = WinState.Lost;
    return;
  }
  const { grid } = draft;

  // all mines should be surrounded completely by blanks, so if we get a mine here something is wrong
  const getBlankOrPanic = (idx: number) => {
    const square = grid[idx];
    if (square.type === SquareType.Mine) {
      throw new Error(
        `mine encountered in flood fill. this shouldn't ever happen.`
      );
    }
    return square;
  };

  resizeAndClear(grid.length);
  enqueue(index(payload));

  let idx: number | undefined;
  while ((idx = dequeue()) != null) {
    let blank = getBlankOrPanic(idx);
    if (blank.exposed) {
      continue;
    }
    blank.exposed = true;
    if (blank.minesAdjacent > 0) {
      continue;
    }
    let c = coords(idx);
    const { y } = c;
    let { x: eastX } = c;
    let { x: westX } = c;
    while (eastX + 1 < width) {
      eastX++;
      blank = getBlankOrPanic(index({ x: eastX, y }));
      if (blank.exposed) {
        break;
      }
      blank.exposed = true;
      if (blank.minesAdjacent > 0) {
        break;
      }
    }
    while (westX - 1 >= 0) {
      westX--;
      blank = getBlankOrPanic(index({ x: westX, y }));
      if (blank.exposed) {
        break;
      }
      blank.exposed = true;
      if (blank.minesAdjacent > 0) {
        break;
      }
    }
    for (let x = westX; x <= eastX; x++) {
      blank = getBlankOrPanic(index({ x, y }));
      if (blank.minesAdjacent > 0) {
        continue;
      }
      if (y + 1 < height) {
        enqueue(index({ x, y: y + 1 }));
        if (x + 1 < width) {
          enqueue(index({ x: x + 1, y: y + 1 }));
        }

        if (x - 1 >= 0) {
          enqueue(index({ x: x - 1, y: y + 1 }));
        }
      }
      if (y - 1 >= 0) {
        enqueue(index({ x, y: y - 1 }));
        if (x + 1 < width) {
          enqueue(index({ x: x + 1, y: y - 1 }));
        }

        if (x - 1 >= 0) {
          enqueue(index({ x: x - 1, y: y - 1 }));
        }
      }
    }
  }
};

const slice = createSlice({
  name: 'board',
  initialState: createBoard(DifficultyOptions.Beginner),
  reducers: {
    newGame: draft => createBoard(draft.difficultyOption),
    selectDifficulty: (_draft, { payload }: PayloadAction<DifficultyOptions>) =>
      createBoard(payload),
    setFlag: (
      draft,
      {
        payload: { flagState, x, y }
      }: PayloadAction<Coords & { flagState: boolean }>
    ) => {
      const index = makeIndex(draft.difficulty.width, x, y);
      const square = draft.grid[index];

      if (
        square.flagged === flagState ||
        (flagState && draft.flagCount >= draft.difficulty.mineCount)
      ) {
        return;
      }

      draft.flagCount = incOnTrueDecOnFalse(draft.flagCount, flagState);

      if (square.type === SquareType.Mine) {
        draft.flaggedMineCount = incOnTrueDecOnFalse(
          draft.flaggedMineCount,
          flagState
        );
      }

      draft.grid[index].flagged = flagState;

      if (draft.flaggedMineCount === draft.difficulty.mineCount) {
        draft.winState = WinState.Won;
      }
    },
    chooseSquare
  }
});

export const { actions, caseReducers, name, reducer } = slice;
