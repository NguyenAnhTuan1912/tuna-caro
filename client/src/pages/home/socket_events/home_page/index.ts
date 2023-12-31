import { NavigateFunction } from "react-router-dom";

// Import from classes
import { GameType } from "src/classes/Game";
import { ChangeDataFnType } from "src/classes/GlobalPrivateData";

// Import from apis/socket
import { Message } from "src/apis/socket";

// Import from utils.
import { ROUTES } from "src/utils/constant";

// Import from components
import { NotifiableSnackBars } from "src/components/snack_bar/SnackBar";

// Import types
import { LangTextJSONType } from "src/types/lang.types";

type ListenerArgsType = {
  changeData: ChangeDataFnType,
  navigate: NavigateFunction,
  langText: LangTextJSONType
};
type EmitGameListenerArgsType = ListenerArgsType;

export function getEmitGameListener(args: EmitGameListenerArgsType) {
  return function emitGameListener(m: Message<GameType>) {
    // If there is error, stop execute.
    if(m.isError) return;
    let game = m.data!;

    // Set new game.
    args.changeData("game", function() {
      return game;
    });

    NotifiableSnackBars.success(args.langText.socketMessages.createGameSuccessfully);

    // After change the data, navigate to /game/online
    args.navigate(ROUTES.GameOnline);
  }
}

export const HomePageSocketEvents = {
  getEmitGameListener
};