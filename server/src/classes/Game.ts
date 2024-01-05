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
export type PlayersKeyType = "first" | "second";

export interface GameType {
  id: string;
  name: string;
  status: GameStatus;
  currentTurn: MarkType;
  host: Player;
  password?: string;
  players: { [key: string]: PlayerType } | null;
};

export interface ResultType {
  player: MarkType;
  from: string;
  to: string;
  endline: {
    from: Coordinate;
    to: Coordinate;
  }
};

/**
 * GameRoomType is a type definition of brief data object of Game.
 */
export interface GameRoomType {
  id: string;
  playerName: string;
  name: string;
  status: GameStatus;
  hasPassword: boolean;
}

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
  private _players!: { [key: string]: Player | undefined } | undefined;

  private static __hasArgsDefaultConstruct__(o: Game, id: string, name?: string, status?: GameStatus, currentTurn?: MarkType) {
    o.id = id ? id : Utils.Security.getRandomID("game", 2);
    o.name = name ? name : "Phòng của ";
    o.status = status ? status : "Waiting";
    o.currentTurn = currentTurn ? currentTurn : "X";
    o._players = {
      "first": undefined,
      "second": undefined
    };
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
   * Use this static method to iterate players.
   * @param o 
   * @param cb 
   */
  static iteratePlayers(o: Game, cb: (player: Player, index: number) => void) {
    let players = o.getPlayers(true) as (Array<Player>);
    let index = 0;
    for(let player of players) {
      cb(player, index);
      index++;
    }
  }

  /**
   * Use this method to add/set player to game. Max is 2.
   * @param player 
   */
  setPlayer(player: Player) {
    if(!this._players!["first"]) {
      player.mark = player.mark ? player.mark : "X";
      this.host = player;
      this._players!["first"] = player as Player;
      return;
    }

    if(!this._players!["second"]) {
      player.mark = this.host.mark === "X" ? "O" : "X";
      this._players!["second"] = player;
      return;
    }
  }

  /**
   * Use this method to get player by id;
   * @param playerId 
   */
  getPlayerById(playerId: string) {
    let players = this.getPlayers(true) as Array<Player>;

    return players.find(player => { if(player) return player.id === playerId });
  }

  /**
   * Use this method to get player by socket id.
   * @param socketId 
   */
  getPlayerBySocketId(socketId: string) {
    let players = this.getPlayers(true) as Array<Player>;

    return players.find(player => { if(player) return player.socketId === socketId });
  }

  /**
   * Use this method to get the player whose `id` does not match with `playerId`.
   * @param playerId 
   */
  getPlayerByExceptedId(playerId: string) {
    let players = this.getPlayers(true) as Array<Player>;

    return players.find(player => { if(player) return player.id !== playerId });
  }

  /**
   * Use this method to get information of player by `name`.
   * @param name 
   * @returns 
   */
  getPlayerByName(name: string) {
    if(!this._players) return undefined;

    let players = this.getPlayers(true) as Array<Player>;

    return players.find(player => { if(player) return player.name === name });
  }

  /**
   * Use this method to get ordinal number of player in `_players`.
   * @param playerId 
   */
  getPlayerONumById(playerId: string) {
    let target = "second";

    // Find
    for(let key in this._players) {
      if(this._players[key]?.id === playerId) target = key;
    }

    return target;
  }

  /**
   * Use this method to get non-host player.
   */
  getNonHostPlayer() {
    if(!this._players) return;
    let players = this.getPlayers(true) as Array<Player>;
    return players.find(player => { if(player) return player === this.host });
  }

  /**
   * Use this method to get all players.
   * @param isArray
   */
  getPlayers(isArray: boolean = false) {
    if(isArray) {
      let result: Array<any> = [];
      if(!this._players) return result;

      // Check if `first` player is exist.
      if(this._players["first"]) {
        result.push(this._players["first"]);
      }

      // Check if `second` player is exist.
      if(this._players["second"]) {
        result.push(this._players["second"]);
      }
      return result;

    }

    if(!this._players) return {};

    return this._players!;
  }

  /**
   * Use this method to update player in a game with new player.
   * @param player 
   */
  updatePlayer(player: Player) {
    if(!this._players) return;

    let onum = this.getPlayerONumById(player.id);
    delete this._players[onum];

    // Update new player.
    this.setPlayer(player);
  }

  /**
   * Use this method to remove player from game. Except host.
   * @param socket 
   * @param playerId 
   * @returns 
   */
  removePlayer( playerId: string) {
    if(!this._players) return;
    let onum = this.getPlayerONumById(playerId);

    // Delete from _players
    delete this._players[onum];
  }

  /**
   * Use this method to leave a game. The work depend on what's player emit 'leave-game' event.
   * There are 2 seneriors, if player leave the game is
   * - Host: the "O" player will be host and "O" change to "X", reset all score,
   * then remove the old host.
   * - Not host: just remove "O" player and reset score.
   * @param socket 
   */
  leaveGame(playerId: string) {
    if(!this._players) return;
    let onum = this.getPlayerONumById(playerId);

    // Delete this player.
    delete this._players[onum];
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
   * Use this method to check if the room is full
   */
  isFull() {
    let count = 0;
    Game.iteratePlayers(this, (player) => {
      if(player) count++;
    });

    return count === 2 ? true : false;
  }

  /**
   * Use this method to check if the room is empty
   */
  isEmpty() {
    let count = 0;
    Game.iteratePlayers(this, (player) => {
      if(player) count++;
    });

    return count === 0 ? true : false;
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