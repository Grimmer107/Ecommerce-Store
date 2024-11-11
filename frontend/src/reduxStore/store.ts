import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'reduxStore/rootReducer';

export const store = configureStore({
  reducer: {
    root: rootReducer,
  },
});
