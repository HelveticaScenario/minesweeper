import { configureStore } from '@reduxjs/toolkit';
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook
} from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'localforage';

import { reducer } from './reducer';

const persistConfig = {
  key: 'root',
  storage
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducer)
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store['getState']>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
