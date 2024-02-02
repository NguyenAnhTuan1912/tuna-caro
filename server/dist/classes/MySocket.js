"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySocket = void 0;
const socket_io_1 = require("socket.io");
// Import from env
const env_1 = require("../env");
const GameList_1 = require("./GameList");
// Import from object
const MyMap_1 = require("../objects/MyMap");
/**
 * Use this function to prepare for game removing.
 * @param socket
 * @param globalSocketManagerObject
 * @param gameId
 * @returns
 */
function prepareToRemoveGame(socket, globalSocketManagerObject, gameId) {
  /*
    Currently, the app has only list of game data is managed
    directly by Socket.
  */
  /*
    If socket connection has the second room is a id of game,
    this game will be delete and the server will send a message
    to client app and let it know that the game was deleted and
    client app must navigate to home.
       But there isn't id of game, that's mean player doesn't create game.
    So nothing is clear.
  */

  let game = globalSocketManagerObject.gameList.getGame(gameId);
  // If there isn't game exist, terminate this task.
  if (!game)
  return;
  let socketId = socket.id;
  let player = game === null || game === void 0 ? void 0 : game.getPlayerBySocketId(socketId);
  // Create the `remove data` callback.
  let cb = setTimeout(function () {
    let remainPlayer = game === null || game === void 0 ? void 0 : game.getPlayerByExceptedId(player === null || player === void 0 ? void 0 : player.id);
    let isHostLeaved = player.id === game.host.id;
    // Clear all the data here.
    // Before the game remove, remain player must be know this.
    // Send a message to remain player.
    if (remainPlayer) {
      /*
        Because the "disconnected player" cannot leave the game from client.
        So server will perform this task.
      */
      game === null || game === void 0 ? void 0 : game.leaveGame(player === null || player === void 0 ? void 0 : player.id);
      // Emit message to remain player.
      socket.
      broadcast.
      to(gameId).
      emit(MySocket.EventNames.leaveGame, MySocket.createMessage(MySocket.EventNames.leaveGame, env_1.env.WS_MESSAGE_KEYS.LEAVE_GAME, {
        playerId: player.id,
        isHostLeaved
      }));
    } else
    {
      // If game has only host, remove game.
      // Remove game.
      globalSocketManagerObject.gameList.removeGame(gameId);
    }
    ;
    // (Client App have to navigate to Home Page) Send message.
    // Other tasks.
  }, MySocket.MAX_DISCONNECTION_DURATION);
  // Add the `remove data` callback to `_dataRemoveCBs`
  globalSocketManagerObject.dataRemoveCBs.set(gameId, cb);
  // Emit a message to another player if player disconnect and in game.
  if (gameId)
  socket.
  broadcast.
  to(gameId).
  emit(MySocket.EventNames.gameConnectionStatus, MySocket.createMessage(MySocket.EventNames.gameConnectionStatus, env_1.env.WS_MESSAGE_KEYS.DISCONNECTED, {
    isConnected: false,
    player
  }));
}
/**
 * Use this function to cancel game removing.
 * @param socket
 * @param globalSocketManagerObject
 * @param gameId
 */
function cancelGameRemoving(socket, globalSocketManagerObject, gameId) {
  let game = globalSocketManagerObject.gameList.getGame(gameId);
  // If there isn't game exist, terminate this task.
  if (!game)
  return;
  let socketId = socket.id;
  let player = game === null || game === void 0 ? void 0 : game.getPlayerBySocketId(socketId);
  // Cancel data removing by remove the `remove data` callback from `_dataRemoveCBs`.
  clearTimeout(globalSocketManagerObject.dataRemoveCBs.get(gameId));
  // Delelte `remove data` callback.
  globalSocketManagerObject.dataRemoveCBs.delete(gameId);
  // Emit a message to another player if player reconnected and in game.
  if (gameId)
  socket.
  broadcast.
  to(gameId).
  emit(MySocket.EventNames.gameConnectionStatus, MySocket.createMessage(MySocket.EventNames.gameConnectionStatus, env_1.env.WS_MESSAGE_KEYS.RECONNECTED, {
    isConnected: true,
    player
  }));
}
/**
 * Define a listener for `disconnecting` event of socket.
 * @param socket
 * @param globalSocketManagerObject
 * @param dataRemoveCBs
 */
function disconnectingListener(socket, globalSocketManagerObject) {
  let [, gameId] = [...socket.rooms];
  prepareToRemoveGame(socket, globalSocketManagerObject, gameId);
}
/**
 * This function will be executed when a socket connection is recovered.
 * @param socket
 * @param globalSocketManagerObject
 * @param dataRemoveCBs
 */
function executeWhenSocketIsRecovered(socket, globalSocketManagerObject) {
  let [, gameId] = [...socket.rooms];
  cancelGameRemoving(socket, globalSocketManagerObject, gameId);
}
/**
 * Create a instance to manage all socket events inside app. Like a central of socket events.
 * There are 2 ways that listener can be added:
 * - Throught the SEListener Wrapper.
 * - Or direct listener function.
 */
class MySocket {
  constructor(options) {
    this._io = new socket_io_1.Server(options.httpServer, {
      cors: {
        // For safe
        origin: env_1.env.AUTHORIZED_DOMAINS,
        credentials: true
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: MySocket.MAX_DISCONNECTION_DURATION
      }
    });
    this.__o__ = {
      gameList: new GameList_1.GameList(),
      dataRemoveCBs: new MyMap_1.MyMap()
    };
    this._listeners = [];
    this._listenerWrapper = [];
    // Init
    setTimeout(() => this._init(), 0);
  }
  /**
   * Use this static method to create a message.
   * @param eventName
   * @param isError
   * @param text
   * @param data
   * @returns
   */
  static createMessage(eventName, text, data, isError = false) {
    return {
      isError,
      eventName,
      data,
      text
    };
  }
  /**
   * Use this method to basically init configurations for socket.
   */
  _init() {
    let that = this;
    this._io.on("connection", (socket) => {
      var _a, _b;
      if (socket.recovered) {
        executeWhenSocketIsRecovered(socket, this.__o__);
      }
      ;
      // Set up `disconnect` event for socket to handle some tasks for individual socket.
      socket.on("disconnect", () => {
        socket.removeAllListeners();
      });
      // Set up `disconnecting` event for socket to handle some tasks for individual socket.
      socket.on("disconnecting", (reason) => {
        disconnectingListener(socket, this.__o__);
      });
      // Set up `initial` event for socket.
      socket.on(MySocket.EventNames.initial, (message) => {
        socket.emit(MySocket.EventNames.initial, MySocket.createMessage(MySocket.EventNames.initial, env_1.env.WS_MESSAGE_KEYS.HANDSHAKE, {
          configParams: {
            maxDisconnectionDuration: MySocket.MAX_DISCONNECTION_DURATION
          }
        }));
      });
      // Set up listeners (including listener wrappers)
      (_a = that._listeners) === null || _a === void 0 ? void 0 : _a.forEach((data) => {
        socket.on(data.name, (...args) => {
          data.fn(socket, args);
        });
      });
      (_b = that._listenerWrapper) === null || _b === void 0 ? void 0 : _b.forEach((data) => {
        let listener = data.fn(socket);
        socket.on(data.name, listener);
      });
    });
  }
  /**
   * Use this method to add event listener for socket.
   * @param name
   * @param listener
   */
  addEventListener(name, listener) {
    let that = this;
    this._listeners.push({
      name,
      fn: (socket, ...args) => {listener(socket, that.__o__, ...args);}
    });
  }
  /**
   * Use this method to add event listener wrapper.
   * @param name
   * @param wrapper
   */
  addEventListenerWrapper(name, wrapper) {
    let that = this;
    this._listenerWrapper.push({
      name,
      fn: (socket) => {return wrapper(this._io, socket, that.__o__);}
    });
  }
}
exports.MySocket = MySocket;
MySocket.EventNames = {
  /**
   * Init a connection between client and server.
   */
  initial: "initial",
  /**
   * This event is all about create game and emit it to server. Then
   * get it back with `id`.
   */
  emitGame: "emit_game",
  /**
   * This event is all about when a player mark to table, this will emit the message and
   * listen to this event, then opposite player can catch the change.
   */
  emitMark: "emit_mark",
  /**
   * This event is all about a player join a game, this will emit the message and listen to this event.
   * So a player join a game, and opposite player will know about it.
   */
  joinGame: "join_game",
  /**
   * This event is all about a player leave the game, this will emit the message and listen to this event.
   * If a player leave the game, opposite player will know and app will calculate and re-render to sync with state.
   */
  leaveGame: "leave_game",
  /**
   * This event is all about a socket instance (client) try to reconnect to a game,
   * this will emit the message and listen to this event. If a player is on a game and disconnect to server,
   * then socket instance will be try to reconnect to game with this event.
   */
  reconnectGame: "reconnect_game",
  /**
   * This event is all about the game has player. When player hit the table and win the game, this event will be fired.
   * Sending new information of mark and winner.
   */
  emitWinner: "emit_winner",
  /**
   * This event is all about the game move to new round. When the round has winner, host will be click the start new round
   * in the right bottom corner. This event will send the message to another player to tell them start new round.
   */
  startNewRound: "start_new_round",
  /**
   * This event is mean a player connection status to a game. If player connection status is change, send message
   * to another player.
   */
  gameConnectionStatus: "game_connection_status",
  /**
   * This event is all about player get games in server. When a player create a game, its data will store (fast solution) in
   * server. So if another player go to Game Rooms Page, they will see multiple Game Rooms.
   */
  getGames: "get_games"
};
MySocket.MAX_DISCONNECTION_DURATION = 15 * 1000; // 5 minutes for production; any minutes or seconds for test.
MySocket.MAX_GAME_IN_LIST_DURATION = 10 * 1000; // Max duration of when in list when player is disconnected.