import { GameType, Coordinate, MarkType, PlayersKeyType } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

export type TypeOfGame = "offline" | "online";

interface UserEffectCBArgsType {
  addMark: (x: number, y: number, t: number) => void;
  resetGame: () => void;
  appendPlayer: (key: PlayersKeyType, player: PlayerType) => void;
  removePlayer: (g: PlayersKeyType | string) => void;
}

export interface GameCoreProps {
  host?: PlayerType;
  game: Partial<GameType>;
  preventClickWhenTurn?: MarkType;
  onEmitCoordinate?: (x: number, y: number, t: number, currentTurn: MarkType) => void;
  useEffectCB?: (args: UserEffectCBArgsType) => () => void;
}

export interface MarkSocketMessageType {
  mark: MarkType;
  coor: Coordinate;
  gameId: string;
}