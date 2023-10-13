import { useSelector, useDispatch } from 'react-redux';

// Import from classes
import { PlayerType } from 'src/classes/Player';

// Import from state
import { AppDispatch } from 'src/state';
import { getPlayerIDAsyncThunk } from "src/state/player/thunks";

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
  const createPlayerActionFns = function(dispatch: AppDispatch) {
    return {
      getPlayerIDAsyncThunk: function() {
        dispatch(getPlayerIDAsyncThunk());
      },

      setPlayerIdAction: function(id: string) {
        dispatch(setPlayerIDAction(id));
      },

      setPlayerNameAction: function(name: string) {
        dispatch(setPlayerNameAction(name));
      },

      setPlayerAction: function(player: Partial<PlayerType>) {
        dispatch(setPlayerAction(player));
      }
    }
  }

  return {
    /**
     * Use this hook to get and trace player's state and use player's action.
     */
    usePlayer: function() {
      const player = useSelector(playerSelector);
      const dispatch = useDispatch();

      return {
        player,
        playerDispatcher: createPlayerActionFns(dispatch)
      }
    },

    /**
     * Use this hook to get and trace player's state.
     */
    usePlayerState: function() {
      const player = useSelector(playerSelector);

      return player;
    },

    /**
     * Use this hook to use player's action.
     */
    usePlayerActions: function() {
      const dispatch = useDispatch();

      return createPlayerActionFns(dispatch);
    }
  }
})();