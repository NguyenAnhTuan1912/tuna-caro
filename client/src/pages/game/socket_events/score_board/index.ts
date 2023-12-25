/*
  There are many socket events, including:
  - `game_connection_status`: to know the remain player's internet (socket) connection status
*/
// Import from classes
import { Message } from 'src/apis/socket';

// Import types
import { GameConnectionStatusMessageDataType } from "../../types";
import { ScoreBoardStateConfigs } from '../../state/score_board';

type GameConnectionStatusArgsType = {
  setStateFns: ReturnType<typeof ScoreBoardStateConfigs.getStateFns>
};

function getGameConnectionStatusListener(args: GameConnectionStatusArgsType) {
  return function gameConnectionStatusListener(m: Message<GameConnectionStatusMessageDataType>) {
    if(m.data?.isConnected) {
      args.setStateFns.updateLostConnectionPlayer(null);
    } else {
      args.setStateFns.updateLostConnectionPlayer(m.data?.player!);
    }
  }
}

export const ScoreBoardSocketEvents = {
  getGameConnectionStatusListener
};