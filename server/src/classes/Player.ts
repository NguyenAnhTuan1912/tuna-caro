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
    o: Player,
    id: string,
    name?: string,
    isWinner?: boolean,
    score?: number,
    socketId?: string
  ) {
    o.id = id;
    o.name = name ? name : `Player[${id}]`;
    o.isWinner = isWinner ? isWinner : false;
    o.score = score ? score : 0;
    if(socketId) o.socketId = socketId;
  }

  constructor(game: PlayerType);
  constructor(id: string, name?: string);
  constructor(id: string, name?: string, isWinner?: boolean, score?: number, socketId?: string);
  constructor(_: string | PlayerType, name?: string, isWinner?: boolean, score?: number, socketId?: string) {
    if(typeof _ === "string") {
      Player.__hasArgsDefaultConstruct__(this, _, name, isWinner, score, socketId);
    } else {
      Player.__hasArgsDefaultConstruct__(this, _.id, _.name, _.isWinner, _.score, _.socketId);
    }
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