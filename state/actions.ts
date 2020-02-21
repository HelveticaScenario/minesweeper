import { createAction } from '@reduxjs/toolkit';
import { Coords } from './types';

// taken from https://redux-toolkit.js.org/usage/usage-with-typescript#createaction
function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

export const SET_FLAG = createAction(
  'ADD_FLAG',
  withPayloadType<Coords & { flagState: boolean }>()
);

export const CHOOSE_SQUARE = createAction(
  'CHOOSE_SQUARE',
  withPayloadType<Coords>()
);
