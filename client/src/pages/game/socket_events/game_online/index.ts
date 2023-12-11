// Import from classes
import { Game } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

// Import from `apis/socket`
import { Message } from "src/apis/socket";

// Import from components
import { openNotifiableSnackBar } from "src/components/snack_bar/SnackBar";

// Import from props.
import {
  EmitMarkMessageDataType,
  EmitWinnerMessageDataType,
  UseEffectCBArgsType
} from "../../Game.props";

type ListenerArgsType = {
  useEffectArgs: UseEffectCBArgsType
}
type EmitMarkListenerArgsType = ListenerArgsType;
type EmitWinnerListener = ListenerArgsType;
type JoinGameListenerArgsType = ListenerArgsType;
type LeaveGameListenerArgsType = ListenerArgsType;
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
    openNotifiableSnackBar(m.text!);

    // Add player to game.
    // Because first player always "X", so the second will be "O".
    args.useEffectArgs.appendPlayer("second", player);
  } 
}

function getLeaveGameListener(args: LeaveGameListenerArgsType) {
  return function leaveGameListener(m: Message<{ playerId: string }>) {
    // Announce to player.
    openNotifiableSnackBar(m.text!);

    // When receive a message that player is leave the game, remove them from game.
    args.useEffectArgs.removePlayer(m.data?.playerId!);
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
  getStartNewRoundListener
};