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
  private static __hasArgsDefaultConstruct__(o: PlayerType, id?: string, name?: string, mark?: string, isWinner?: boolean, score?: number) {
    o.id = id ? id : "";
    o.name = name ? name : `Player[${id}]`;
    if(mark) o.mark = mark;
    if(isWinner) o.isWinner = isWinner;
    if(score) o.score = score;
    return o;
  }

  /**
   * 
   */
  static createPlayer(): PlayerType;
  /**
   * Use this static method to create a player with only `id`.
   * @param id 
   */
  static createPlayer(id: string): PlayerType;
  /**
   * Use this static method to create a player with `id` and `name`.
   * @param id 
   * @param name 
   */
  static createPlayer(id: string, name: string): PlayerType;
  /**
   * Use this static method to create a player object with complete information.
   * @param id 
   * @param name 
   * @param mark 
   * @param isWinner 
   * @param score 
   */
  static createPlayer(id: string, name: string, mark: string, isWinner: boolean, score: number): PlayerType;
  static createPlayer(id?: string, name?: string, mark?: string, isWinner?: boolean, score?: number): PlayerType {
    return Player.__hasArgsDefaultConstruct__({} as PlayerType, id, name, mark, isWinner, score);
  }

  /**
   * Use this static method to create default player.
   */
  static createDefault(): PlayerType {
    return {
      id: "",
      socketId: "",
      name: "",
      mark: "",
      isWinner: false,
      score: 0
    }
  }

  /**
   * Use this static method to init state of player when enter game, including `score` and `isWinner`.
   * @param o 
   */
  static initForGame(o: PlayerType) {
    o.score = 0;
    o.isWinner = false;
  }

  /**
   * Use this static method to reset state of user in game, including `score` and `isWinner`.
   * @param o 
   */
  static reset(o: PlayerType) {
    Player.initForGame(o);
  }

  /**
   * Use this static method to set information for player.
   * @param player 
   */
  static setPlayer(o: PlayerType, player: Partial<PlayerType>) {
    for(let prop in player) {
      let key = prop as keyof PlayerType;
      if(prop !== "id" && player[key]) {
        (o as any)[key] = player[key];
      }
    }
  }
}