import { MyMap } from "src/objects/MyMap";
import { Player } from "./Player";

export type GameStatusType = "Waiting" | "Playing";

export type MarkType = "X" | "O";

export interface MarkInfoType {
  value: MarkType;
  element: JSX.Element;
}

/**
 * Use this game to create an object that can manage Game in app.
 */
export class Game {
  id!: string;
  name!: string;
  status!: GameStatusType;
  currentTurn!: MarkType;
  
  private password?: string;
  private players!: { [key: string]: Player };
  private markInfoMap!: MyMap<string, MarkInfoType>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.status = "Waiting";
    this.players = {};
    this.currentTurn = "X";
    this.markInfoMap = new MyMap();
  }

  /*
    SETTERS
  */
  setPassword(password: string) {
    this.password = password;
  }

  setPlayer(turn: string, player: Player) {
    player.setMark(turn);
    if(!this.players[turn]) this.players[turn] = player;
  }

  setTurn(turn: MarkType) {
    this.currentTurn = turn;
  }

  /*
    GETTERS
  */
  getPassword() {
    return this.password;
  }

  getPlayer(turn: MarkType) {
    return this.players[turn];
  }

  /**
   * Use a callback with this function to render marks to JSX.Element.
   * @param fn 
   * @returns 
   */
  renderMarks(fn: (value: MarkInfoType | undefined, key?: string) => JSX.Element) {
    return this.markInfoMap.map(fn);
  }

  /**
   * Use this method to add an information of mark to map.
   * @param coordinate 
   * @param mark 
   * @param element 
   */
  addMarkInfo(coordinate: string, mark: MarkType, element: JSX.Element) {
    if(!this.markInfoMap.get(coordinate))
      this.markInfoMap.set(coordinate, { value: mark, element });
  }

  /**
   * Use this method to compare password.
   * @param password 
   * @returns 
   */
  comparePassword(password: string) {
    return this.password === password;
  }
}