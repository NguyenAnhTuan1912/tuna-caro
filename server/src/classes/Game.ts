import { Socket } from "socket.io";

// Import classes
import { Player, PlayerType } from "./Player";

// Import utils
import Utils from "utils";

export type Coordinate = {
  x: number;
  y: number;
};
export type GameStatus = "Waiting" | "Playing";
export type MarkType = "X" | "O";

export interface GameType {
  id: string;
  name: string;
  status: GameStatus;
  currentTurn: MarkType;
  host: Player;
  password?: string;
  players: { [key: string]: PlayerType } | null;
};

/**
 * There are some rule in game:
 * - The first turn always "X".
 * - The first player in room is "X".
 * - The host is the first player, mean "X" player.
 * - The guest is "O" player.
 * - Data in server must be synced with client. Because a player can be disconnect and
 * they may want to join again with old data or when player's connection is shut down
 * just after they send messeage to server, so they can get their old data.
 * 
 * Or maybe not need to sync the data in both server and client. Because server may store many data
 * so maybe we just need a method to request data from other user.
 * If player is disconnect, the data still in their computer, as well as when both players are lost connection.
 */

/**
 * Create a instance to manage game.
 */
export class Game {
  id!: string;
  name!: string;
  status!: GameStatus;
  currentTurn!: MarkType;
  host!: Player;
  
  private _password?: string;
  private _players!: { [key: string]: Player } | null;

  private static __hasArgsDefaultConstruct__(o: Game, id: string, name?: string, status?: GameStatus, currentTurn?: MarkType) {
    o.id = id ? id : Utils.Security.getRandomID("game", 2);
    o.name = name ? name : "Phòng của ";
    o.status = status ? status : "Waiting";
    o.currentTurn = currentTurn ? currentTurn : "X";
    o._players = {};
  }

  constructor(game: GameType);
  constructor(id?: string | GameType, name?: string, status?: GameStatus, currentTurn?: MarkType);
  constructor(_: string | GameType, name?: string, status?: GameStatus, currentTurn?: MarkType) {
    if(typeof _ === "string") {
      Game.__hasArgsDefaultConstruct__(
        this,
        _, name, status, currentTurn
      );
    } else {
      Game.__hasArgsDefaultConstruct__(
        this,
        _.id, _.name, _.status, _.currentTurn
      );
    }
  }

  /**
   * Use this method to add/set player to game. Max is 2.
   * @param player 
   */
  setPlayer(player: Player) {
    if(!this._players!["X"]) {
      this.host = player;
      this._players!["X"] = player as Player;
      return;
    }

    if(!this._players!["O"]) {
      this._players!["O"] = player;
      return;
    }
  }

  /**
   * Use this method to get information of player by `mark`.
   * @param mark 
   * @returns 
   */
  getPlayerByMark(mark: MarkType) {
    return this._players![mark];
  }

  /**
   * Use this method to get information of player by `name`.
   * @param name 
   * @returns 
   */
  getPlayerByName(name: string) {
    if(this._players!["X"].name === name) {
      return this._players!["X"];
    };

    if(this._players!["O"].name === name) {
      this._players!["O"];
    };

    return;
  }

  /**
   * Use this method to remove player from game. Except host.
   */
  removePlayer(socket: Socket) {
    socket.in(this.id).disconnectSockets();
    delete this._players!["O"];
  }

  /**
   * Use this method to leave a game. The work depend on what's player emit 'leave-game' event.
   * There are 2 seneriors, if player leave the game is
   * - Host: the "O" player will be host and "O" change to "X", reset all score,
   * then remove the old host.
   * - Not host: just remove "O" player and reset score.
   * @param socket 
   */
  leaveGame(socket: Socket, playerId: string) {
    if(this.host.id === playerId) {
      this.host = this._players!["O"];
    }
    
    // Notification to remain player.
    // socket.to(this.id).emit();
    socket.leave(this.id);
  }

  /**
   * Use this method to check if game has password.
   * @returns 
   */
  hasPassword() {
    return Boolean(this._password);
  }

  /**
   * Use this method to switch turn.
   */
  switchTurn() {
    this.currentTurn = this.currentTurn === "X" ? "O" : "X";
  }

  /**
   * Use this method to switch status.
   */
  swithStatus() {
    this.status = this.status === "Playing" ? "Waiting" : "Playing";
  }

  /**
   * Use this method to set password for game.
   * @param password 
   * @param fn 
   */
  async setPassword(password: string, fn?: () => void) {
    this._password = await Utils.Security.hash(password);
    if(fn) fn();
  }

  /**
   * Use this method to compare password.
   * @param password 
   * @param fn 
   * @returns 
   */
  async comparePassword(password: string, fn?: (result: boolean) => void) {
    const result = await Utils.Security.compareHash(password, this._password!);
    if(fn) fn(result);
    return result;
  }
}