import { NavigateFunction } from "react-router-dom";

// Import from classes
import { ChangeDataFnType } from "src/classes/GlobalPrivateData";
import { GameType, GameRoomType } from "src/classes/Game";

// Import from `apis/socket`
import { Message } from "src/apis/socket";

// Import from utils
import { ROUTES } from "src/utils/constant";

// Locally Import
import { GameRoomsStateConfigs } from "../../state/game_rooms";

type ListenerArgsType = {
  stateFns?: ReturnType<typeof GameRoomsStateConfigs.getStateFns>,
  changeData?: ChangeDataFnType
  navigate?: NavigateFunction
};
type GetGamesListenerArgsType = ListenerArgsType;
type JoinGameListenerArgsType = ListenerArgsType;

function getGetGamesListener(args: GetGamesListenerArgsType) {
  return function getGamesListener(m: Message<Array<GameRoomType>>) {
    console.log("Message from `getGames`: ", m);
    args.stateFns!.setGames(m.data!);
  }
}

function getJoinGameListener(args: JoinGameListenerArgsType) {
  return function joinGameListener(m: Message<GameType>) {
    let game = m.data!;
        
    // Set new game.
    args.changeData!("game", function() {
      return game;
    });

    // After set new game, navigato /game/online
    args.navigate!(ROUTES.GameOnline);
  }
}

export const GameRoomsSocketEventListeners = {
  getGetGamesListener,
  getJoinGameListener
};