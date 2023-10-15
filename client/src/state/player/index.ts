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
    self: new Player(
      LocalStorageUtils.getItem("playerId") ?? "",
      LocalStorageUtils.getItem("playerName") ?? ""
    )
  },
  reducers: {
    /**
     * Use this action to set player's ID.
     * @param state 
     * @param payload 
     */
    setPlayerIDAction: function(state, action: ReduxAction<string>) {
      state.self.id = action.payload;
    },

    /**
     * Use this action to set player's.
     * @param state 
     * @param action 
     */
    setPlayerNameAction: function(state, action: ReduxAction<string>) {
      LocalStorageUtils.setItem("playerName", action.payload);
      state.self.name = action.payload;
    },

    /**
     * Use this action to set player.
     * @param state 
     * @param action 
     */
    setPlayerAction: function(state, action: ReduxAction<Partial<PlayerType>>) {
      if(action.payload.name) LocalStorageUtils.setItem("playerName", action.payload.name);
      console.log("State: ", state.self);
      state.self.setPlayer(action.payload);
    }
  },
  
  extraReducers: function(builder) {
    builder.addCase(getPlayerIDAsyncThunk.fulfilled, function(state, action) {
      state.self.id = action.payload;
    });
  }
});

/**
 * Use this selector to get information of player with `useSelector()`.
 * @param state 
 * @returns 
 */
export function playerSelector(state: any): Player {
  return state.player.self;
}

export const {
  setPlayerIDAction,
  setPlayerNameAction,
  setPlayerAction
} = PlayerSlice.actions;