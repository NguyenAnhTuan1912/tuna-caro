"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = void 0;
// Import modified objects
const MyMap_1 = require("../objects/MyMap");
/**
 * Create a game list to manage games.
 */
class GameList {
  constructor() {
    this._games = new MyMap_1.MyMap();
  }
  /**
   * Use this method to get customized data of games.
   * @param fn
   * @returns
   */
  map(fn) {
    return this._games.map(fn);
  }
  /**
   * Use this method to add a game to list with `id` and itself.
   * @param id
   * @param game
   */
  addGame(socket, id, game) {
    socket.join(game.id);
    this._games.set(id, game);
  }
  /**
   * Use this method to get information of a game.
   * @param id
   */
  getGame(id) {
    return this._games.get(id);
  }
  /**
   * Use this method to remove a game from list with its `id`.
   * @param id
   */
  removeGame(id) {
    this._games.delete(id);
  }
  /**
   * Use this method to get game from the range `[skip, limit + skip]`.
   * @param limit
   * @param skip
   */
  getGames(limit, skip) {
    return this._games.inRange(limit, skip + limit);
  }
}
exports.GameList = GameList;