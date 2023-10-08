// Import classes
import { Socket } from 'socket.io';
import { Game, GameType } from './Game';

// Import modified objects
import { MyMap } from "objects/MyList";

/**
 * Create a game list to manage games.
 */
export class GameList {
  private _games!: MyMap<string, Game>;

  constructor() {
    this._games = new MyMap();
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
   * Use this method to remove a game from list with its `id`.
   * @param id 
   */
  removeGame(socket: Socket, id: string) {
    socket.leave(id);
    this._games.delete(id);
  }
}