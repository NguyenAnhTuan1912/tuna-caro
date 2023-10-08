import { PlayerType } from "src/classes/Player";

export interface ProfileCardProps {
  canEdit?: boolean;
  isVertical?: boolean;
  player: PlayerType;
}