import { GameType, Coordinate, MarkType, ResultType } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

import { GameCoreStateFnsType } from "./state/game_core";

export type TypeOfGame = "offline" | "online";

/**
 * This use to set up some outside works for GameCore about socket.
 */
export type UseEffectCBArgsType = GameCoreStateFnsType;

export type GameCoreProps = {
  /**
   * __Online only__
   * 
   * This is host player, they can perform some permission.
   */
  host?: PlayerType;
  /**
   * __Online only__
   * 
   * This is main player. Because when player online, the GameCore need to know
   * that who play directly and who play remotely.
   */
  mainPlayer?: PlayerType;
  /**
   * 
   */
  oppositePlayer?: PlayerType;
  /**
   * Data of game.
   */
  game: Partial<GameType>;
  /**
   * This function use to track the coordinate is emit from Grid to GameCore and GameCore to outside.
   * Of course, this will be called when click.
   * @param x 
   * @param y 
   * @param t 
   * @param currentTurn 
   * @param winner 
   * @returns 
   */
  onAddMark?: (x: number, y: number, t: number, currentTurn: MarkType, winner?: ResultType, canCallOnAddMark?: boolean) => void;
  /**
   * A callback use to setup useEffect for GameCore.
   * @param args 
   * @returns 
   */
  useEffectCB?: (args: UseEffectCBArgsType) => () => void;
  /**
   * This function use to fire works outside GameCore or given works.
   * When the host click "start new round" (reset icon).
   * @returns 
   */
  onResetClick?: () => void;
}

export type EmitMarkMessageDataType = {
  mark: MarkType;
  coor: Coordinate;
  gameId: string;
}

export type EmitWinnerMessageDataType =
  EmitMarkMessageDataType
  & {
    winner: ResultType;
  }

export type PauseGameLayerProps = {
  canResume?: boolean;
  text?: string;
}