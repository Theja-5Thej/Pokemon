import { configureStore } from '@reduxjs/toolkit';
import collectionReducer from './slices/collectionSlice';

export const store = configureStore({
  reducer: {
    collection: collectionReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
