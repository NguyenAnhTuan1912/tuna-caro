import { NavigateFunction } from "react-router-dom";
import { ChangeDataFnType } from "src/classes/GlobalPrivateData";

// Import from classes
import { GameType } from "src/classes/Game";

// Import from apis
import { Message } from "src/apis/socket";

// Import from utils
import { ROUTES, WS_MESSAGE_KEYS } from "src/utils/constant";

// Import from components
import { NotifiableSnackBars } from "src/components/snack_bar/SnackBar";

// Import types
import { LangTextJSONType } from "src/types/lang.types";

type JoinGameListenerArgsType = {
  changeData?: ChangeDataFnType;
  navigate?: NavigateFunction;
  langText: LangTextJSONType;
};

/**
 * Get `join_game` listener.
 * @param args 
 * @returns 
 */
export function getJoinGameListener(args: JoinGameListenerArgsType) {
  return function(m: Message<GameType>) {
    let game = m.data!;
    let message = m.text!;

    if(!m.isError) {
      // Set new game.
      args.changeData!("game", function() {
        return game;
      });

      message = args.langText.global.toPlayerPronoun + " " + args.langText.socketMessages.joinGame!;

      NotifiableSnackBars.success(message);
      // After set new game, navigato /game/online
      args.navigate!(ROUTES.GameOnline);
      
      return;
    };
        
    
    if(message === WS_MESSAGE_KEYS.VITE_NOT_EXIST_ROOM) message = args.langText.socketMessages.notExistRoom!;
    if(message === WS_MESSAGE_KEYS.VITE_FULL_ROOM) message = args.langText.socketMessages.fullRoom!;
    if(message === WS_MESSAGE_KEYS.VITE_WRONG_PASSWORD) message = args.langText.socketMessages.wrongPassword!;

    NotifiableSnackBars.warning(message);
  }
}