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
  constructor(id?: string, name?: string)
  constructor(id?: string, name?: string) {
    if(id) {
      this.id = id;
      this.name = name ? name : `Player[${id}]`;
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
}