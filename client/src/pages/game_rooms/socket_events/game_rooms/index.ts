// Import from classes
import { GameRoomType } from "src/classes/Game";

// Import from `apis/socket`
import { Message } from "src/apis/socket";

type GetGamesListenerArgsType = { getData: (data: any) => void };

function getGetGamesListener(args: GetGamesListenerArgsType) {
  return function getGamesListener(m: Message<Array<GameRoomType>>) {
    args.getData(m.data!);
  }
}

export const GameRoomsSocketEventListeners = {
  getGetGamesListener
};