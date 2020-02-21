import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { makeIndex, makeCoords, simpleQueue } from '../utils';
import {
  Coords,
  Square,
  Dimensions,
  Board,
  SquareType,
  Mine,
  Blank,
  WinState,
  Grid,
  Indices
} from './types';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const makeMine = (): Mine => ({
  type: SquareType.Mine,
  flagged: false,
  exposed: false
});

const makeBlank = (minesAdjacent: number): Blank => ({
  type: SquareType.Blank,
  flagged: false,
  exposed: false,
  minesAdjacent
});

const createBoard = (
  width: number,
  height: number,
  mineCount: number
): Board => {
  const dimensions: Dimensions = {
    width,
    height
  };

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
    dimensions,
    mineCount,
    winState: WinState.Playing,
    mineIndices: Array.from(mineIndices)
  };
};

const checkForWin = (grid: Grid, mineIndices: Indices): boolean => {
  for (let index of mineIndices) {
    if (!grid[index].flagged) {
      return false;
    }
  }
  return true;
};

const queue = simpleQueue();
const { dequeue, enqueue, resizeAndClear } = queue;

const chooseSquare: CaseReducer<Board, PayloadAction<Coords>> = (
  draft,
  { payload }
) => {
  const { width, height } = draft.dimensions;
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
      }
      if (y - 1 >= 0) {
        enqueue(index({ x, y: y - 1 }));
      }
    }
  }
};

const slice = createSlice({
  name: 'board',
  initialState: createBoard(10, 10, 10),
  reducers: {
    newGame: draft =>
      createBoard(draft.dimensions.width, draft.dimensions.height, 10),
    setFlag: (
      draft,
      { payload }: PayloadAction<Coords & { flagState: boolean }>
    ) => {
      const index = makeIndex(draft.dimensions.width, payload.x, payload.y);
      draft.grid[index].flagged = payload.flagState;
      if (checkForWin(draft.grid, draft.mineIndices)) {
        draft.winState = WinState.Won;
      }
    },
    chooseSquare
  }
});

export const { actions, caseReducers, name, reducer } = slice;
