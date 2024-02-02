"use strict";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {return value instanceof P ? value : new P(function (resolve) {resolve(value);});}
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
    function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
    function step(result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
// Import utils
const utils_1 = __importDefault(require("../utils"));
;
;
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
class Game {
  static __hasArgsDefaultConstruct__(o, id, name, status, currentTurn) {
    o.id = id ? id : utils_1.default.Security.getRandomID("game", 2);
    o.name = name ? name : "Phòng của ";
    o.status = status ? status : "Waiting";
    o.currentTurn = currentTurn ? currentTurn : "X";
    o._players = {
      "first": undefined,
      "second": undefined
    };
  }
  constructor(_, name, status, currentTurn) {
    if (typeof _ === "string") {
      Game.__hasArgsDefaultConstruct__(this, _, name, status, currentTurn);
    } else
    {
      Game.__hasArgsDefaultConstruct__(this, _.id, _.name, _.status, _.currentTurn);
    }
  }
  /**
   * Use this static method to iterate players.
   * @param o
   * @param cb
   */
  static iteratePlayers(o, cb) {
    let players = o.getPlayers(true);
    let index = 0;
    for (let player of players) {
      cb(player, index);
      index++;
    }
  }
  /**
   * Use this method to add/set player to game. Max is 2.
   * @param player
   */
  setPlayer(player) {
    if (!this._players["first"]) {
      player.mark = player.mark ? player.mark : "X";
      this.host = player;
      this._players["first"] = player;
      return;
    }
    if (!this._players["second"]) {
      player.mark = this.host.mark === "X" ? "O" : "X";
      this._players["second"] = player;
      return;
    }
  }
  /**
   * Use this method to get player by id;
   * @param playerId
   */
  getPlayerById(playerId) {
    let players = this.getPlayers(true);
    return players.find((player) => {if (player)
      return player.id === playerId;});
  }
  /**
   * Use this method to get player by socket id.
   * @param socketId
   */
  getPlayerBySocketId(socketId) {
    let players = this.getPlayers(true);
    return players.find((player) => {if (player)
      return player.socketId === socketId;});
  }
  /**
   * Use this method to get the player whose `id` does not match with `playerId`.
   * @param playerId
   */
  getPlayerByExceptedId(playerId) {
    let players = this.getPlayers(true);
    return players.find((player) => {if (player)
      return player.id !== playerId;});
  }
  /**
   * Use this method to get information of player by `name`.
   * @param name
   * @returns
   */
  getPlayerByName(name) {
    if (!this._players)
    return undefined;
    let players = this.getPlayers(true);
    return players.find((player) => {if (player)
      return player.name === name;});
  }
  /**
   * Use this method to get ordinal number of player in `_players`.
   * @param playerId
   */
  getPlayerONumById(playerId) {
    var _a;
    let target = "second";
    // Find
    for (let key in this._players) {
      if (((_a = this._players[key]) === null || _a === void 0 ? void 0 : _a.id) === playerId)
      target = key;
    }
    return target;
  }
  /**
   * Use this method to get non-host player.
   */
  getNonHostPlayer() {
    if (!this._players)
    return;
    let players = this.getPlayers(true);
    return players.find((player) => {if (player)
      return player === this.host;});
  }
  /**
   * Use this method to get all players.
   * @param isArray
   */
  getPlayers(isArray = false) {
    if (isArray) {
      let result = [];
      if (!this._players)
      return result;
      // Check if `first` player is exist.
      if (this._players["first"]) {
        result.push(this._players["first"]);
      }
      // Check if `second` player is exist.
      if (this._players["second"]) {
        result.push(this._players["second"]);
      }
      return result;
    }
    if (!this._players)
    return {};
    return this._players;
  }
  /**
   * Use this method to update player in a game with new player.
   * @param player
   */
  updatePlayer(player) {
    if (!this._players)
    return;
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
  removePlayer(playerId) {
    if (!this._players)
    return;
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
  leaveGame(playerId) {
    if (!this._players)
    return;
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
      if (player)
      count++;
    });
    return count === 2 ? true : false;
  }
  /**
   * Use this method to check if the room is empty
   */
  isEmpty() {
    let count = 0;
    Game.iteratePlayers(this, (player) => {
      if (player)
      count++;
    });
    return count === 0 ? true : false;
  }
  /**
   * Use this method to set password for game.
   * @param password
   * @param fn
   */
  setPassword(password, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      this._password = yield utils_1.default.Security.hash(password);
      if (fn)
      fn();
    });
  }
  /**
   * Use this method to compare password.
   * @param password
   * @param fn
   * @returns
   */
  comparePassword(password, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield utils_1.default.Security.compareHash(password, this._password);
      if (fn)
      fn(result);
      return result;
    });
  }
}
exports.Game = Game;