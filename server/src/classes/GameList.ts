// Import classes
import { Socket } from 'socket.io';
import { Game, GameType } from './Game';

// Import modified objects
import { MyMap } from "objects/MyMap";

/**
 * Create a game list to manage games.
 */
export class GameList {
  private _games!: MyMap<string, Game>;

  constructor() {
    this._games = new MyMap();
  }

  /**
   * Use this method to get customized data of games.
   * @param fn 
   * @returns 
   */
  map<R>(fn: (value: Game | undefined, key: string, index: number) => R) {
    return this._games.map(fn);
  }

  /**
   * Use this method to add a game to list with `id` and itself.
   * @param id 
   * @param game 
   */
  addGame(socket: Socket, id: string, game: Game) {
    socket.join(game.id);
    this._games.set(id, game);
  }
  
  /**
   * Use this method to get information of a game.
   * @param id 
   */
  getGame(id: string) {
    return this._games.get(id);
  }

  /**
   * Use this method to remove a game from list with its `id`.
   * @param id 
   */
  removeGame(id: string) {
    this._games.delete(id);
  }

  /**
   * Use this method to get game from the range `[skip, limit + skip]`.
   * @param limit 
   * @param skip 
   */
  getGames(limit: number, skip: number) {
    return this._games.inRange<Array<Game>>(limit, skip + limit);
  }
}