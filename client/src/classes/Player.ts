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
  socketId!: string;
  name!: string;
  mark?: string;
  isWinner!: boolean;
  score!: number;

  private static __hasArgsDefaultConstruct__(o: Player, id: string, name?: string, mark?: string, isWinner?: boolean, score?: number) {
    o.id = id;
    o.name = name ? name : `Player[${id}]`;
    if(mark) o.mark = mark;
    if(isWinner) o.isWinner = isWinner;
    if(score) o.score = score;
  }

  constructor();
  constructor(player?: PlayerType);
  constructor(id?: string, name?: string)
  constructor(id?: string, name?: string, mark?: string, isWinner?: boolean, score?: number)
  constructor(_?: string | PlayerType, name?: string, mark?: string, isWinner?: boolean, score?: number) {
    if(_ && typeof _ === "string") {
      Player.__hasArgsDefaultConstruct__(this, _, name, mark, isWinner, score);
    }
    
    if(_ && typeof _ !== "string") {
      Player.__hasArgsDefaultConstruct__(this, _.id, _.name, _.mark, _.isWinner, _.score);
    }
  }

  /**
   * Use this method to init state of player when enter game, including `score` and `isWinner`.
   */
  initForGame() {
    this.score = 0;
    this.isWinner = false;
  }

  /**
   * Use this method to reset state of user in game, including `score` and `isWinner`.
   */
  reset() {
    this.initForGame();
  }

  /**
   * Use this method to set information for player.
   * @param player 
   */
  setPlayer(player: Partial<PlayerType>) {
    for(let prop in player) {
      let key = prop as keyof PlayerType;
      if(prop !== "id" && player[key]) {
        (this as any)[key] = player[key];
      }
    }
  }

  /**
   * Use this method to get data of player (not include method).
   */
  getInformation(): PlayerType {
    return {
      id: this.id,
      name: this.name,
      mark: this.mark,
      isWinner: this.isWinner ? this.isWinner : false,
      score: this.score ? this.score : 0
    }
  }
}