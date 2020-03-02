import { reducer, actions, difficulties, createBoard } from './reducer';
import { DifficultyOptions, SquareType, Board, WinState } from './types';
import { makeIndex } from '../utils';
import { Draft } from '@reduxjs/toolkit';
import { difficultyOptionArray } from '../utils/constants';

describe('reducer', () => {
  for (let option of difficultyOptionArray) {
    describe(`create ${DifficultyOptions[
      option
    ].toLocaleLowerCase()} board`, () => {
      const diff = difficulties[option];

      test(`it should have the right difficulty`, () => {
        const board = createBoard(option);
        expect(board.difficulty).toEqual(diff);
        expect(board.difficultyOption).toBe(option);
      });

      test(`it should have the right dimensions`, () => {
        const board = createBoard(option);
        expect(board.grid.length).toBe(diff.height * diff.width);
      });

      test(`it should have the right number of mines`, () => {
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

      test(`it should have mines in the right places`, () => {
        const board = createBoard(option);
        for (let idx of board.mineIndices) {
          const square = board.grid[idx];
          expect(square.type).toBe(SquareType.Mine);
        }
      });
    });
  }
  // create simplified board for testing
  const createTestBoard = (): Draft<Board> => ({
    grid: [
      { type: SquareType.Mine, flagged: false, exposed: false },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 1
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 0
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 1
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 1
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 0
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 0
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 0
      },
      {
        type: SquareType.Blank,
        flagged: false,
        exposed: false,
        minesAdjacent: 0
      }
    ],
    difficultyOption: DifficultyOptions.Beginner,
    difficulty: { width: 3, height: 3, mineCount: 1 },
    flagCount: 0,
    flaggedMineCount: 0,
    winState: 0,
    mineIndices: [0]
  });
  describe(`actions`, () => {
    describe(`new game`, () => {
      test(`it should make a new board of the same difficulty`, () => {
        const initialBoard = createBoard(DifficultyOptions.Beginner);
        const afterState = reducer(initialBoard, actions.newGame());
        expect(afterState.difficulty).toEqual(initialBoard.difficulty);
        expect(afterState.difficultyOption).toBe(initialBoard.difficultyOption);
      });
    });

    describe(`select difficulty`, () => {
      test(`it should make a new board of the payload difficulty`, () => {
        const initialBoard = createBoard(DifficultyOptions.Beginner);
        const afterState = reducer(
          initialBoard,
          actions.selectDifficulty(DifficultyOptions.Expert)
        );
        expect(afterState.difficulty).toEqual(
          difficulties[DifficultyOptions.Expert]
        );
        expect(afterState.difficultyOption).toBe(DifficultyOptions.Expert);
      });
    });

    describe(`set flag`, () => {
      test(`it should flag an unflagged unexposed square`, () => {
        const initialBoard = createTestBoard();

        const afterState = reducer(
          initialBoard,
          actions.setFlag({
            flagState: true,
            x: 1,
            y: 0
          })
        );

        expect(
          afterState.grid[makeIndex(afterState.difficulty.width, 1, 0)].flagged
        ).toBe(true);
        expect(afterState.flagCount).toBe(1);
      });

      test(`it should unflag a flagged unexposed square`, () => {
        const initialBoard = createTestBoard();
        initialBoard.grid[
          makeIndex(initialBoard.difficulty.width, 1, 0)
        ].flagged = true;
        initialBoard.flagCount++;

        const afterState = reducer(
          initialBoard,
          actions.setFlag({
            flagState: false,
            x: 1,
            y: 0
          })
        );

        expect(
          afterState.grid[makeIndex(afterState.difficulty.width, 1, 0)].flagged
        ).toBe(false);
        expect(afterState.flagCount).toBe(0);
      });

      test(`it should not flag an exposed square`, () => {
        const initialBoard = createTestBoard();
        initialBoard.grid[
          makeIndex(initialBoard.difficulty.width, 1, 0)
        ].exposed = true;

        const afterState = reducer(
          initialBoard,
          actions.setFlag({
            flagState: true,
            x: 1,
            y: 0
          })
        );

        expect(
          afterState.grid[makeIndex(afterState.difficulty.width, 1, 0)].flagged
        ).toBe(false);
      });

      test(`it flagging a mine should increase flaggedMineCount`, () => {
        const initialBoard = createTestBoard();

        const afterState = reducer(
          initialBoard,
          actions.setFlag({
            flagState: true,
            x: 0,
            y: 0
          })
        );

        expect(afterState.flaggedMineCount).toBe(1);
      });

      test(`it unflagging a mine should decrease flaggedMineCount`, () => {
        const initialBoard = createTestBoard();
        initialBoard.grid[
          makeIndex(initialBoard.difficulty.width, 0, 0)
        ].flagged = true;
        initialBoard.flagCount++;
        initialBoard.flaggedMineCount++;

        const afterState = reducer(
          initialBoard,
          actions.setFlag({
            flagState: false,
            x: 0,
            y: 0
          })
        );

        expect(afterState.flaggedMineCount).toBe(0);
      });

      test(`it flagging the last mine should win the game`, () => {
        const initialBoard = createTestBoard();

        const afterState = reducer(
          initialBoard,
          actions.setFlag({
            flagState: true,
            x: 0,
            y: 0
          })
        );

        expect(afterState.winState).toBe(WinState.Won);
      });
    });

    describe(`choose square`, () => {
      test(`it should cause you to lose to the game if you choose a mine`, () => {
        const initialBoard = createTestBoard();

        const afterState = reducer(
          initialBoard,
          actions.chooseSquare({
            x: 0,
            y: 0
          })
        );
        expect(afterState.winState).toBe(WinState.Lost);
      });
      test(`it should expose a single unexposed square, adjacent to a mine`, () => {
        const initialBoard = createTestBoard();

        const afterState = reducer(
          initialBoard,
          actions.chooseSquare({
            x: 1,
            y: 0
          })
        );

        expect(
          afterState.grid[makeIndex(afterState.difficulty.width, 1, 0)].exposed
        ).toBe(true);
      });

      test(`it should expose an unexposed square, not adjacent to a mine, and flood fill`, () => {
        const initialBoard = createTestBoard();

        const afterState = reducer(
          initialBoard,
          actions.chooseSquare({
            x: 2,
            y: 0
          })
        );

        // the grid is 3x3 and the mine is in the top left, so
        // choosing the top right should expose all the blanks
        for (let square of afterState.grid) {
          if (square.type === SquareType.Blank) {
            expect(square.exposed).toBe(true);
          } else {
            expect(square.exposed).toBe(false);
          }
        }
      });
    });
  });
});
