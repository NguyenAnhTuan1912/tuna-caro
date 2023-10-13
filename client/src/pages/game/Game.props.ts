import { GameType, Coordinate, MarkType } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

export type TypeOfGame = "offline" | "online";

interface UserEffectCBArgsType {
  addMark: (x: number, y: number, t: number) => void;
  resetGame: () => void;
  appendPlayer: (turn: string, player: PlayerType) => void;
  removePlayer: (g: MarkType | string) => void;
}

export interface GameCoreProps {
  playerX: PlayerType;
  playerO: PlayerType;
  game: Partial<GameType>;
  onEmitCoordinate?: (x: number, y: number, t: number, currentTurn: MarkType) => void;
  useEffectCB?: (args: UserEffectCBArgsType) => () => void;
}

export interface MarkSocketMessageType {
  coor: Coordinate;
  mark: string;
}