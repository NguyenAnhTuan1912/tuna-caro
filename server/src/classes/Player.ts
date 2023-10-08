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

  constructor(_: PlayerType);
  constructor(_: string | PlayerType, name?: string);
  constructor(_: string | PlayerType, name?: string, isWinner?: boolean, score?: number);
  constructor(_: string | PlayerType, name?: string, isWinner?: boolean, score?: number) {
    if(typeof _ === "string") {
      this.id = _;
      this.name = name ? name : "Player-" + _;
      this.isWinner = isWinner ? isWinner : false;
      this.score = score ? score : 0;
    } else {
      this.id = _.id;
      this.name = _.name;
      this.isWinner = _.isWinner;
      this.score = _.score;
    }
  }

  reset() {
    this.score = 0;
    this.isWinner = false;
  }
}