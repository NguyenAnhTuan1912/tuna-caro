import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import slices
import { PlayerSlice } from "./player";
import { SettingsSlice } from "./settings";
import { LangSlice } from "./lang";

// Central Reducer.
const reducers = combineReducers({
  [PlayerSlice.name]: PlayerSlice.reducer,
  [SettingsSlice.name]: SettingsSlice.reducer,
  [LangSlice.name]: LangSlice.reducer
});

/**
 * Because settings will be store in local storage, so we will need Persist Store.
 */

/**
 * This is global state of application.
 */
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch