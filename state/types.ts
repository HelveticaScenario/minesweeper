export interface Coords {
  readonly x: number;
  readonly y: number;
}

export interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export enum SquareType {
  Mine,
  Blank
}

export interface BaseSquare {
  readonly flagged: boolean;
  readonly exposed: boolean;
}

export interface Mine extends BaseSquare {
  readonly type: SquareType.Mine;
}

export interface Blank extends BaseSquare {
  readonly type: SquareType.Blank;
  readonly minesAdjacent: number;
}

export type Square = Mine | Blank;

export type Grid = readonly Square[];

export type Indices = readonly number[];

export enum WinState {
  Playing,
  Won,
  Lost
}

export interface Board {
  readonly dimensions: Dimensions;
  readonly grid: Grid;
  readonly mineCount: number;
  readonly winState: WinState;
  readonly mineIndices: Indices;
}
