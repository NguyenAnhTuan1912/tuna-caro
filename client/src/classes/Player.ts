export interface PlayerType {
  id: string;
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
  name!: string;
  mark?: string;
  isWinner!: boolean;
  score!: number;

  constructor();
  constructor(_?: PlayerType);
  constructor(_?: string | PlayerType, name?: string)
  constructor(_?: string | PlayerType, name?: string) {
    if(_ && typeof _ === "string") {
      this.id = _;
      this.name = name ? name : `Player[${_}]`;
    }
    
    if(_ && typeof _ !== "string") {
      this.id = _.id;
      this.name = _.name;
      this.mark = _.mark;
      this.isWinner = _.isWinner;
      this.score = _.score;
    }
  }

  /**
   * Use this method to init state of player when enter game, including `score` and `isWinner`.
   */
  init() {
    this.score = 0;
    this.isWinner = false;
  }

  /**
   * Use this method to reset state of user in game, including `score` and `isWinner`.
   */
  reset() {
    this.init();
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