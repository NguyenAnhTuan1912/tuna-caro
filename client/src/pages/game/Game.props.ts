import { GameType, Coordinate, MarkType, PlayersKeyType, ResultType } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

export type TypeOfGame = "offline" | "online";

/**
 * This use to set up some outside works for GameCore about socket.
 */
export interface UseEffectCBArgsType {
  /**
   * Use this to add new mark to table. Can receive a information about winner (result)
   * and onAddMark can be called inside.
   * @param x 
   * @param y 
   * @param t 
   * @param result 
   * @param canCallOnAddMark 
   * @returns 
   */
  addMark: (x: number, y: number, t: number, result?: ResultType, canCallOnAddMark?: boolean) => void;
  /**
   * Use this function to reset game.
   * @returns 
   */
  resetGame: () => void;
  /**
   * Use this function to add a player.
   * @param key 
   * @param player 
   * @returns 
   */
  appendPlayer: (key: PlayersKeyType, player: PlayerType) => void;
  /**
   * Use this function to remove a player.
   * @param g 
   * @returns 
   */
  removePlayer: (g: PlayersKeyType | string) => void;
  /**
   * Use this function to start a new round.
   * @returns 
   */
  startNewRound: () => void;
}

export interface GameCoreProps {
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

export interface EmitMarkMessageDataType {
  mark: MarkType;
  coor: Coordinate;
  gameId: string;
}

export interface EmitWinnerMessageDataType extends EmitMarkMessageDataType {
  winner: ResultType;
}