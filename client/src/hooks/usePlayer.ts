import { useSelector, useDispatch } from 'react-redux';

// Import from classes
import { PlayerType } from 'src/classes/Player';

// Import from state
import { AppDispatch } from 'src/state';
import { getPlayerIDAsyncThunk } from "src/state/player/thunks/getPlayerIDAsyncThunk";

// Import actions
import {
  playerSelector,
  setPlayerIDAction,
  setPlayerNameAction,
  setPlayerAction
} from "src/state/player";

export const {
  usePlayer,
  usePlayerState,
  usePlayerActions
} = (function() {
  const createPlayerDispatchers = function(dispatch: AppDispatch) {
    return {
      /**
       * Use this dispatcher to get ID for player.
       */
      getPlayerIDAsync: function() {
        dispatch(getPlayerIDAsyncThunk());
      },

      /**
       * Use this dispatcher to set or update id for player.
       * @param id 
       */
      setPlayerId: function(id: string) {
        dispatch(setPlayerIDAction(id));
      },

      /**
       * Use this dispatcher to set or update name for player.
       * @param name 
       */
      setPlayerName: function(name: string) {
        dispatch(setPlayerNameAction(name));
      },

      /**
       * Use this dispatcher to set or update player.
       * @param player 
       */
      setPlayer: function(player: Partial<PlayerType>) {
        dispatch(setPlayerAction(player));
      }
    }
  }

  return {
    /**
     * Use this hook to get and trace player's state and use player's action.
     * @returns
     */
    usePlayer: function() {
      const player = useSelector(playerSelector);
      const dispatch = useDispatch();

      return {
        player,
        playerDispatcher: createPlayerDispatchers(dispatch)
      }
    },

    /**
     * Use this hook to get and trace player's state.
     * @returns
     */
    usePlayerState: function() {
      const player = useSelector(playerSelector);

      return player;
    },

    /**
     * Use this hook to use player's action.
     * @returns
     */
    usePlayerActions: function() {
      const dispatch = useDispatch();

      return createPlayerDispatchers(dispatch);
    }
  }
})();