import { createSlice } from "@reduxjs/toolkit";

// Import classes
import { Player, PlayerType } from "src/classes/Player";

// Import thunks
import { getPlayerIDAsyncThunk } from "./thunks/getPlayerIDAsyncThunk";

// Import utils
import { BrowserStorageUtils, LocalStorageKeys } from "src/utils/browser_storage";

// Import types
import { ReduxAction } from "../state.types";

let initialState = BrowserStorageUtils.getItem<PlayerType>(LocalStorageKeys.player);
initialState = initialState ? initialState : Player.createPlayer();

/**
 * State of player. This slice store only the main player, another player will
 * be store in game, sync with game.
 */
export const PlayerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    /**
     * Use this action to set player's ID.
     * @param state 
     * @param payload 
     */
    setPlayerIDAction: function(state, action: ReduxAction<string>) {
      state.id = action.payload;
      BrowserStorageUtils.updateItem(LocalStorageKeys.player, { id: state.id }, { canOverrideValues: false });
    },

    /**
     * Use this action to set player's.
     * @param state 
     * @param action 
     */
    setPlayerNameAction: function(state, action: ReduxAction<string>) {
      state.name = action.payload;
      BrowserStorageUtils.updateItem(LocalStorageKeys.player, { name: state.name });
    },

    /**
     * Use this action to set player.
     * @param state 
     * @param action 
     */
    setPlayerAction: function(state, action: ReduxAction<Partial<PlayerType>>) {
      Player.setPlayer(state, action.payload);
      BrowserStorageUtils.updateItem(LocalStorageKeys.player, state);
    }
  },
  
  extraReducers: function(builder) {
    builder.addCase(getPlayerIDAsyncThunk.fulfilled, function(state, action) {
      state.id = action.payload;
      state.name = `Player[${state.id}]`;
      BrowserStorageUtils.updateItem(LocalStorageKeys.player, { id: state.id, name: state.name }, { canOverrideValues: false });
    });
  }
});

/**
 * Use this selector to get information of player with `useSelector()`.
 * @param state 
 * @returns 
 */
export function playerSelector(state: any): PlayerType {
  return state.player;
}

export const {
  setPlayerIDAction,
  setPlayerNameAction,
  setPlayerAction
} = PlayerSlice.actions;