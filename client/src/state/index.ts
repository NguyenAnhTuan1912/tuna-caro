import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import slices
import { PlayerSlice } from "./player";

const reducers = combineReducers({
  [PlayerSlice.name]: PlayerSlice.reducer
});

/**
 * This is global state of application.
 */
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});