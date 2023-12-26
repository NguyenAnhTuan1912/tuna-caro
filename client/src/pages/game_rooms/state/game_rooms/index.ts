// Import from classes
import { GameRoomType } from "src/classes/Game";

// Import from hooks
import { ChangeStateFnType } from "src/hooks/useStateWESSFns";

function getInitialState() {
  return {
    skip: 0,
    data: [] as Array<GameRoomType>
  }
}

function getStateFns(changeState: ChangeStateFnType<ReturnType<typeof getInitialState>>) {
  return {
    /**
     * Use this function to add games to `data`.
     * @param games 
     */
    setGames: function(games: Array<GameRoomType>) {
      changeState("data", function(data) {
        data = games;
        return data;
      })
    },

    /**
     * Use this function to update skip to get next `skip` games.
     */
    nextGames: function() {
      changeState("skip", function(data) {
        return data;
      })
    }
  }
}

export type GameRoomsStateFnsType = ReturnType<typeof getStateFns>;

export const GameRoomsStateConfigs = {
  getInitialState,
  getStateFns
};