export interface PlayerType {
  id: string;
  socketId?: string;
  name: string;
  mark?: string;
  isWinner: boolean;
  score: number;
};

/**
 * Use this class to create an object that can manage Player in game.
 */
export class Player {
  id!: string;
  socketId?: string;
  name!: string;
  mark?: string;
  isWinner!: boolean;
  score!: number;

  private static __hasArgsDefaultConstruct__(
    o: PlayerType,
    _: Partial<PlayerType>
  ) {
    o.id = _.id ? _.id : "";
    o.name = _.name ? _.name : `Player[${_.id}]`;

    for(let key in _) {
      if((_ as any)[key] && typeof (_ as any)[key] !== "function") (o as any)[key] = (_ as any)[key];
    }

    return o;
  }

  constructor(game: PlayerType);
  constructor(id: string, name?: string);
  constructor(id: string, name?: string, isWinner?: boolean, score?: number, socketId?: string);
  constructor(generic: string | PlayerType, name?: string, isWinner?: boolean, score?: number, socketId?: string) {
    if(typeof generic === "object")
      Player.__hasArgsDefaultConstruct__(this, generic);
    else
      Player.__hasArgsDefaultConstruct__(this, { id: generic, name, isWinner, score, socketId });
  }

  /**
   * Use this method to set information for player.
   * @param player 
   */
  setPlayer(player: PlayerType) {
    for(let prop in player) {
      let key = prop as keyof PlayerType;
      if(prop !== "id" && player[key]) {
        (this as any)[key] = player[key];
      }
    }
  }

  reset() {
    this.score = 0;
    this.isWinner = false;
  }
}