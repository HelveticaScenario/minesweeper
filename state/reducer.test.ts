import { reducer, actions, difficulties, createBoard } from './reducer';
import { DifficultyOptions, SquareType } from './types';

describe('reducer', () => {
  const options = Object.keys(DifficultyOptions).map(
    key => DifficultyOptions[key] as DifficultyOptions
  );
  for (let option of options) {
    describe(`create ${DifficultyOptions[
      option
    ].toLocaleLowerCase()} board`, () => {
      const diff = difficulties[option];

      it(`should have the right difficulty`, () => {
        const board = createBoard(option);
        expect(board.difficulty).toEqual(diff);
        expect(board.difficultyOption).toBe(option);
      });

      it(`should have the right dimensions`, () => {
        const board = createBoard(option);
        expect(board.grid.length).toBe(diff.height * diff.width);
      });

      it(`should have the right number of mines`, () => {
        const board = createBoard(option);
        expect(board.mineIndices.length).toBe(diff.mineCount);
        let count = 0;
        for (let i = 0; i < board.grid.length; i++) {
          const square = board.grid[i];
          if (square.type === SquareType.Mine) {
            count++;
          }
        }
        expect(count).toBe(diff.mineCount);
      });

      it(`should have mines in the right places`, () => {
        const board = createBoard(option);
        for (let idx of board.mineIndices) {
          const square = board.grid[idx];
          expect(square.type).toBe(SquareType.Mine);
        }
      });
    });
  }

  describe(`actions`, () => {});
});
