// Import from classes.
import { PlayerType } from "src/classes/Player";

export type StaticProfileCardProps = {
  isVertical?: boolean;
  player: PlayerType;
};

export type ProfileCardProps = Partial<StaticProfileCardProps>
& {
  canEdit?: boolean;
};