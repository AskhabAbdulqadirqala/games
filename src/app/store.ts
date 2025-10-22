import { configureStore } from '@reduxjs/toolkit';
import checkersReducer from '../pages/Checkers/store/slice';

export const store = configureStore({
  reducer: {
    checkers: checkersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
