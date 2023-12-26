import { NavigateFunction } from "react-router-dom";

// Import from classes
import { Game } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

// Import from `apis/socket`
import { Message } from "src/apis/socket";

// Import from utils
import { ROUTES } from "src/utils/constant";

// Import from components
import { NotifiableSnackBars } from "src/components/snack_bar/SnackBar";

// Import types.
// Import from props.
import {
  EmitMarkMessageDataType,
  EmitWinnerMessageDataType,
  UseEffectCBArgsType
} from "../../Game.props";

// Import from types
import { GameConnectionStatusMessageDataType } from "../../types";

type ListenerArgsType = {
  useEffectArgs: UseEffectCBArgsType
}
type EmitMarkListenerArgsType = ListenerArgsType;
type EmitWinnerListener = ListenerArgsType;
type JoinGameListenerArgsType = ListenerArgsType;
type LeaveGameListenerArgsType = ListenerArgsType & {
  navigate: NavigateFunction;
};
type ReconnectGameListenerArgsType = ListenerArgsType & {
  navigate: NavigateFunction;
  player: PlayerType;
};
type GameConnectionStatusArgsType = {};
type StartNewRoundListenerArgsType = ListenerArgsType;

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

    // Announce to player.
    NotifiableSnackBars.info(m.text!);

    // Add player to game.
    // Because first player always "X", so the second will be "O".
    args.useEffectArgs.appendPlayer("second", player);
  }
}

function getLeaveGameListener(args: LeaveGameListenerArgsType) {
  return function leaveGameListener(m: Message<{ playerId: string, isHostLeaved: boolean }>) {
    // Announce to player.
    NotifiableSnackBars.info(m.text!);

    // If player leaves game is host. So the game will be removed from list in server.
    if(m.data?.isHostLeaved) {
      args.navigate(ROUTES.Home);
      return;
    }

    // When receive a message that player is leave the game, remove them from game.
    args.useEffectArgs.removePlayer(m.data?.playerId!);
  }
}

function getGameConnectionStatusListener(args?: GameConnectionStatusArgsType) {
  return function gameConnectionStastusListener(m: Message<GameConnectionStatusMessageDataType>) {
    let data = m.data!;
    if(data.isConnected) {
      // Show a snackbar.
      NotifiableSnackBars.success(data.player.name + " đã kết nối lại.");
    }
    else {
      // Show a snackbar.
      NotifiableSnackBars.warning(data.player.name + " đã mất kết nối.");
    }
  }
}

function getReconnectGameListener(args: ReconnectGameListenerArgsType) {
  return function reconnectGameListener(m: Message<any>) {
    if(m.isError && m.text === "not_exist") {
      args.navigate(ROUTES.Home);
      return;
    };

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