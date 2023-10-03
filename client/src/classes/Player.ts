/**
 * Use this class to create an object that can manage Player in game.
 */
export class Player {
  id!: string;
  name!: string;
  mark?: string;
  isWinner!: boolean;

  constructor(id: string) {
    this.id = id;
    this.name = "player-" + id;
    this.isWinner = false;
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
}