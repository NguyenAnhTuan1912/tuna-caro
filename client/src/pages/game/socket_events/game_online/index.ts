// Import from classes
import { Game } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

// Import from `apis/socket`
import { Message } from "src/apis/socket";

// Import from utils
import { ROUTES } from "src/utils/constant";

// Import from components
import { NotifiableSnackBars } from "src/components/snack_bar/SnackBar";

// Import from props.
import {
  EmitMarkMessageDataType,
  EmitWinnerMessageDataType,
  UseEffectCBArgsType
} from "../../Game.props";

// Import from types
import { GameConnectionStatusMessageDataType } from "../../types";
import { ListenerArgsType } from "src/types/socket.types";

type _ListenerArgsType_ = Partial<ListenerArgsType> & {
  useEffectArgs: UseEffectCBArgsType;
};
type EmitMarkListenerArgsType = _ListenerArgsType_;
type EmitWinnerListener = _ListenerArgsType_;
type JoinGameListenerArgsType = _ListenerArgsType_;
type LeaveGameListenerArgsType = _ListenerArgsType_;
type ReconnectGameListenerArgsType = _ListenerArgsType_ & {
  player: PlayerType;
};
type GameConnectionStatusArgsType = Partial<ListenerArgsType>;
type StartNewRoundListenerArgsType = _ListenerArgsType_;

function getEmitMarkListener(args: EmitMarkListenerArgsType) {
  return function emitMarkListener(m: Message<EmitMarkMessageDataType>) {
    let data = m.data;
    let { x, y } = data?.coor!;
    args.useEffectArgs.addMark(x, y, Game.t);
  }
}

function getEmitWinnerListener(args: EmitWinnerListener) {
  return function emitWinnerListener(m: Message<EmitWinnerMessageDataType>) {
    let data = m.data!;
    let { x, y } = data.coor!;
    let winner = data.winner;
    args.useEffectArgs.addMark(x, y, Game.t, winner, false);
  }
}

function getJoinGameListener(args: JoinGameListenerArgsType) {
  return function joinGameListener(m: Message<PlayerType>) {
    let player = m.data!;
    let message = player.name + " " + args.langText!.socketMessages.joinGame;

    // Announce to player.
    NotifiableSnackBars.info(message);

    // Add player to game.
    // Because first player always "X", so the second will be "O".
    args.useEffectArgs.appendPlayer("second", player);
  }
}

function getLeaveGameListener(args: LeaveGameListenerArgsType) {
  return function leaveGameListener(m: Message<{ playerId: string, playerName: string, isHostLeaved: boolean }>) {
    // Announce to player.
    let message = m.data?.playerName + " " + args.langText!.socketMessages.leaveGame;
    
    // If player leaves game is host. So the game will be removed from list in server.
    if(m.data?.isHostLeaved) {
      NotifiableSnackBars.info(message);
      args.navigate!(ROUTES.Home);
      return;
    };
    
    NotifiableSnackBars.info(message);
    // When receive a message that player is leave the game, remove them from game.
    args.useEffectArgs.removePlayer(m.data?.playerId!);
  }
}

function getGameConnectionStatusListener(args: GameConnectionStatusArgsType) {
  return function gameConnectionStastusListener(m: Message<GameConnectionStatusMessageDataType>) {
    let data = m.data!;
    let message = "";
    if(data.isConnected) {
      // Show a snackbar.
      message = data.player.name + " has " + args.langText!.socketMessages.reconnected;
      NotifiableSnackBars.success(message);
    }
    else {
      // Show a snackbar.
      message = data.player.name + " has " + args.langText!.socketMessages.disconnected;
      NotifiableSnackBars.warning(message);
    }
  }
}

function getReconnectGameListener(args: ReconnectGameListenerArgsType) {
  return function reconnectGameListener(m: Message<any>) {
    if(m.isError && m.text === "not_exist") {
      args.navigate!(ROUTES.Home);
      return;
    };

    NotifiableSnackBars.success(args.langText!.socketMessages.reconnectGameSuccessfully);

    // Update player.
    args.useEffectArgs.updatePlayer(args.player);
  }
}

function getStartNewRoundListener(args: StartNewRoundListenerArgsType) {
  return function startNewRoundListener(m: Message<boolean>) {
    if(m.data) args.useEffectArgs.startNewRound();
  }
}

export const GameOnlineSocketEvents = {
  getEmitMarkListener,
  getEmitWinnerListener,
  getJoinGameListener,
  getLeaveGameListener,
  getStartNewRoundListener,
  getGameConnectionStatusListener,
  getReconnectGameListener
};