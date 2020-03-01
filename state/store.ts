import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook
} from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'localforage';

import { reducer } from './reducer';

const middleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
  }
});

const makeClientStore = () => {
  const persistConfig = {
    key: 'root',
    storage
  };
  const store = configureStore({
    reducer: persistReducer(persistConfig, reducer),
    middleware
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

const makeServerStore = () => ({
  store: configureStore({
    reducer,
    middleware
  }),
  persistor: null
});

const isClient = typeof window !== 'undefined';

export const { store, persistor } = isClient
  ? makeClientStore()
  : makeServerStore();

export type RootState = ReturnType<typeof store['getState']>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
