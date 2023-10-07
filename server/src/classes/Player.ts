/**
 * Use this class to create an object that can manage Player in game.
 */
export class Player {
  id!: string;
  name!: string;
  mark?: string;
  isWinner!: boolean;
  score!: number;

  constructor(id: string, name?: string) {
    this.id = id;
    this.name = name ? name : "Player-" + id;
    this.isWinner = false;
    this.score = 0;
  }

  setName(name: string) {
    this.name = name;
  }

  setMark(mark: string) {
    this.mark = mark;
  }

  setIsWinner(isWinner: boolean) {
    this.isWinner = isWinner;
  }

  reset() {
    this.isWinner = false;
  }
}