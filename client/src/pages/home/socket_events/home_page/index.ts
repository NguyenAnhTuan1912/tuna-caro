import { NavigateFunction } from "react-router-dom";

// Import from classes
import { GameType } from "src/classes/Game";
import { ChangeDataFnType } from "src/classes/GlobalPrivateData";

// Import from apis/socket
import { Message } from "src/apis/socket";

// Import from utils.
import { ROUTES } from "src/utils/constant";

type ListenerArgsType = {
  changeData: ChangeDataFnType,
  navigate: NavigateFunction
};
type EmitGameListenerArgsType = ListenerArgsType;
type JoinGameListenerArgsType = ListenerArgsType;

export function getEmitGameListener(args: EmitGameListenerArgsType) {
  return function emitGameListener(m: Message<GameType>) {
    // If there is error, stop execute.
    if(m.isError) return;
    let game = m.data!;

    // Set new game.
    args.changeData("game", function() {
      return game;
    });

    // After change the data, navigate to /game/online
    args.navigate(ROUTES.GameOnline);
  }
}

export function getJoinGameListener(args: JoinGameListenerArgsType) {
  return function joinGameListener(m: Message<GameType>) {
    let game = m.data!;
        
    // Set new game.
    args.changeData("game", function() {
      return game;
    });

    // After set new game, navigato /game/online
    args.navigate(ROUTES.GameOnline);
  }
}

export const HomePageSocketEvents = {
  getEmitGameListener,
  getJoinGameListener
};