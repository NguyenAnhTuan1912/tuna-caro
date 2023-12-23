import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";

// Import from env
import { env } from 'env';

// Import from classes
import { GameList } from "./GameList";

// Import from object
import { MyMap } from "objects/MyMap";

// Import from templates
import { CreateSEListenerWrapperCallback } from "templates/socket_events";

interface MySocketOptions {
  httpServer: Server
}

export interface Message<T> {
  eventName: string;
  isError: boolean;
  text?: string;
  data?: T
}

export type EventNames = keyof typeof MySocket.EventNames;

export type SocketListnerFn = (...args: Array<any>) => void;
export type ListenerFn = (socket: Socket, ...args: any[]) => void;
export type ListenerWrapperFn = (socket: Socket) => SocketListnerFn;
export interface SEListenerObjectsType {
  gameList: GameList;
}

export interface ListenerInfo {
  name: string;
  fn: ListenerFn;
}

export interface ListenerWrapperInfo {
  name: string;
  fn: ListenerWrapperFn;
}



/**
 * Create a instance to manage all socket events inside app. Like a central of socket events.
 * There are 2 ways that listener can be added:
 * - Throught the SEListener Wrapper.
 * - Or direct listener function.
 */
export class MySocket {
  private _io!: SocketServer;
  static EventNames = {
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
  static MAX_DISCONNECTION_DURATION = 2 * 60 * 1000 // 2 minutes

  private _listeners: Array<ListenerInfo> | null;
  private _listenerWrapper: Array<ListenerWrapperInfo> | null;
  private _dataRemoveCBs: MyMap<string, NodeJS.Timeout>;

  // Objects
  private __o__!: SEListenerObjectsType;

  constructor(options: MySocketOptions) {
    this._io = new SocketServer(options.httpServer, {
      cors: {
        // For safe
        origin: env.AUTHORIZED_DOMAINS,
        credentials: true
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: MySocket.MAX_DISCONNECTION_DURATION
      }
    });
    this.__o__ = {
      gameList: new GameList()
    };
    this._listeners = [];
    this._listenerWrapper = [];
    this._dataRemoveCBs = new MyMap();

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
  static createMessage<T>(eventName: string, text?: string, data?: T, isError: boolean = false): Message<T> {
    return {
      isError,
      eventName,
      data,
      text
    }
  }

  /**
   * Use this method to basically init configurations for socket.
   */
  private _init() {
    let that = this;

    this._io.on("connection", (socket) => {
      console.log("Game in list: ", this.__o__.gameList);
      
      if(socket.recovered) {
        let [socketId, gameId] = [...socket.rooms];
        let game = that.__o__.gameList.getGame(gameId);
        let player = game?.getPlayerBySocketId(socketId);

        console.log("Old Connection");
        console.log("SocketID: ", socket.id);
        console.log("Rooms: ", socket.rooms);
        
        // Cancel data removing by remove the `remove data` callback from `_dataRemoveCBs`.
        clearTimeout(that._dataRemoveCBs.get(socket.id));
        
        // Delelte `remove data` callback.
        that._dataRemoveCBs.delete(socket.id);

        // Emit a message to another player if player reconnected and in game.
        if(gameId)
          socket
          .broadcast
          .to(gameId)
          .emit(
            MySocket.EventNames.gameConnectionStatus,
            MySocket.createMessage(
              MySocket.EventNames.gameConnectionStatus,
              "Reconnected",
              {
                isConnected: true,
                playerName: player?.name
              }
            )
          );
      };
      // Set up `disconnect` event for socket to handle some tasks for individual socket.
      socket.on("disconnect", () => {
        console.log("Disconnected");
        socket.removeAllListeners();
      });

      // Set up `disconnecting` event for socket to handle some tasks for individual socket.
      socket.on("disconnecting", () => {
        let [socketId, gameId] = [...socket.rooms];
        let game = that.__o__.gameList.getGame(gameId);
        let player = game?.getPlayerBySocketId(socketId);

        console.log("Disconnecting...");
        console.log("SocketID: ", socket.id);
        console.log("Rooms: ", socket.rooms);

        // Create the `remove data` callback.
        let cb = setTimeout(function() {
          // Clear all the data here.
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
          if(gameId && that.__o__.gameList.getGame(gameId)) {
            // Remove game.
            that.__o__.gameList.removeGame(gameId);

            // (Client App have to navigate to Home Page) Send message.
          }

          // Other tasks.
        }, MySocket.MAX_DISCONNECTION_DURATION);

        // Add the `remove data` callback to `_dataRemoveCBs`
        that._dataRemoveCBs.set(socket.id, cb);

        // Emit a message to another player if player disconnect and in game.
        if(gameId)
          socket
          .broadcast
          .to(gameId)
          .emit(
            MySocket.EventNames.gameConnectionStatus,
            MySocket.createMessage(
              MySocket.EventNames.gameConnectionStatus,
              "Disconnected",
              {
                isConnected: false,
                playerName: player?.name
              }
            )
          );
      });

      // Set up `initial` event for socket.
      socket.on(MySocket.EventNames.initial, (message) => {
        socket.emit(
          MySocket.EventNames.initial,
          MySocket.createMessage(
            MySocket.EventNames.initial,
            "Welcome to caro game by Tuna Nguyen",
            {
              socketId: socket.id,
              configParams: {
                maxDisconnectionDuration: MySocket.MAX_DISCONNECTION_DURATION
              }
            }
          )
        );
      });

      // Set up listeners (including listener wrappers)
      that._listeners?.forEach((data) => {
        socket.on(data.name, (...args) => {
          data.fn(socket, args);
        });
      });

      that._listenerWrapper?.forEach((data) => {
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
  addEventListener(name: string, listener: (socket: Socket, o: SEListenerObjectsType, ...args: any[]) => void)
  {
    let that = this;
    this._listeners!.push({
      name,
      fn: (socket, ...args: any[]) => { listener(socket, that.__o__, ...args) }
    });
  }

  /**
   * Use this method to add event listener wrapper.
   * @param name 
   * @param wrapper 
   */
  addEventListenerWrapper(name: string, wrapper: CreateSEListenerWrapperCallback) {
    let that = this;
    this._listenerWrapper!.push({
      name,
      fn: (socket) => { return wrapper(this._io, socket, that.__o__) }
    });
  }
}