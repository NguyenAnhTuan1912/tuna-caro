// Import classes
import { Socket } from 'socket.io';
import { Game } from './Game';

// Import modified objects
import { MyMap } from "objects/MyList";

export class GameList {
  private _games!: MyMap<string, Game>;

  /**
   * Use this method to add a game to list with `id` and itself.
   * @param id 
   * @param game 
   */
  addGame(id: string, game: Game) {
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