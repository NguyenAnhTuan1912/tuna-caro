import { createSlice } from "@reduxjs/toolkit";

// Import classes
import { Player, PlayerType } from "src/classes/Player";

// Import thunks
import { getPlayerIDAsyncThunk } from "./thunks";

// Import utils
import { LocalStorageUtils } from "src/utils/localstorage";

// Import types
import { ReduxAction } from "../state.types";

/**
 * State of player. This slice store only the main player, another player will
 * be store in game, sync with game.
 */
export const PlayerSlice = createSlice({
  name: "player",
  initialState: {
    player: new Player()
  },
  reducers: {
    /**
     * Use this action to set player's ID.
     * @param state 
     * @param payload 
     */
    setPlayerIDAction: function(state, action: ReduxAction<string>) {
      state.player.id = action.payload;
    },

    /**
     * Use this action to set player's.
     * @param state 
     * @param action 
     */
    setPlayerNameAction: function(state, action: ReduxAction<string>) {
      state.player.name = action.payload;
    },

    /**
     * Use this action to set player.
     * @param state 
     * @param action 
     */
    setPlayerAction: function(state, action: ReduxAction<PlayerType>) {
      if(action.payload.id) state.player.id = action.payload.id;
      if(action.payload.name) state.player.id = action.payload.name;
    }
  },
  
  extraReducers: function(builder) {
    builder.addCase(getPlayerIDAsyncThunk.fulfilled, function(state, action) {
      state.player.id = action.payload;
      state.player.name = `Player[${action.payload}]`;
    });
  }
});

/**
 * Use this selector to get information of player with `useSelector()`.
 * @param state 
 * @returns 
 */
export function playerSelector(state: any): Player {
  return state.player.player;
}

export const {
  setPlayerIDAction,
  setPlayerNameAction,
  setPlayerAction
} = PlayerSlice.actions;