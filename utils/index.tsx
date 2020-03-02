import { useFela as useFelaReact } from 'react-fela';
import { Coords, ITheme } from '../state/types';

export const makeIndex = (width: number, x: number, y: number) => y * width + x;
export const makeCoords = (width: number, index: number): Coords => ({
  x: Math.floor(index) % Math.floor(width),
  y: Math.floor(index / width)
});
export const map = <T, R>(
  iterator: Iterable<T>,
  cb: (value: T, index: number) => R
): Iterable<R> => {
  return {
    [Symbol.iterator]() {
      const iter = iterator[Symbol.iterator]();
      let i = 0;
      return {
        next() {
          const val = iter.next();
          return {
            done: val.done,
            value: cb(val.value, i++)
          };
        }
      };
    }
  };
};

/**
 * a simple queue
 * optimizes speed at the cost of memory usage
 */
export const simpleQueue = (initialSize: number = 128) => {
  let size = initialSize;
  let queue = new Uint32Array(size);
  let inIndex = 0;
  let outIndex = 0;
  return {
    resizeAndClear: (newSize: number) => {
      inIndex = 0;
      outIndex = 0;
      if (newSize > size) {
        while (size < newSize) {
          size = size * 2;
        }
        queue = new Uint32Array(size);
      }
    },
    enqueue: (num: number) => {
      queue[inIndex++] = num;
    },
    dequeue: () => {
      if (outIndex >= inIndex) {
        return undefined;
      }
      return queue[outIndex++];
    }
  };
};

export const incOnTrueDecOnFalse = (val: number, bool: boolean) =>
  bool ? val + 1 : val - 1;

export const useFela = <P extends {} = {}>(props?: P) =>
  useFelaReact<ITheme, P>(props);
