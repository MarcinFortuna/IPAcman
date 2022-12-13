import { configureStore } from '@reduxjs/toolkit';
import { intervalsSlice } from './reducers/IntervalsReducer';
import { ipacmanSlice } from "./reducers/IpacmanReducer";

export const store = configureStore({
  reducer: {
      intervals: intervalsSlice.reducer,
      ipacmanData: ipacmanSlice.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch