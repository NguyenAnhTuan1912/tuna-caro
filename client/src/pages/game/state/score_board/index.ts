// Import from classes
import { PlayerType } from "src/classes/Player";

// Import from hooks
import { ChangeStateFnType } from "src/hooks/useStateWESSFns";

function getInitialState() {
  return {
    lostConnectionPlayer: null
  } as {
    lostConnectionPlayer: PlayerType | null
  }
}

function getStateFns(changeState: ChangeStateFnType<ReturnType<typeof getInitialState>>) {
  return {
    updateLostConnectionPlayer: function(data: PlayerType | null) {
      changeState("lostConnectionPlayer", function() {
        return data;
      });
    }
  }
}

export type ScoreBoardStateFns = ReturnType<typeof getStateFns>;

export const ScoreBoardStateConfigs = {
  getInitialState,
  getStateFns
};