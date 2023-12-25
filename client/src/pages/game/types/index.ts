// Import from classes
import { PlayerType } from "src/classes/Player";

export type GameConnectionStatusMessageDataType = { 
  isConnected: boolean;
  player: PlayerType;
}