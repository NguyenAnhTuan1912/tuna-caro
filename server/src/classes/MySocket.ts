import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";

// Import env
import { env } from 'env';

// Import classes
import { GameList } from "./GameList";

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
     * This event is all about player get games in server. When a player create a game, its data will store (fast solution) in
     * server. So if another player go to Game Rooms Page, they will see multiple Game Rooms.
     */
    getGames: "get_games"
  };

  private _listeners: Array<ListenerInfo> | null;
  private _listenerWrapper: Array<ListenerWrapperInfo> | null;

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
        maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
      }
    });
    this.__o__ = {
      gameList: new GameList()
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
    this._io.on("connection", (socket) => {
      console.log("Game in list: ", this.__o__.gameList);
      
      if(socket.recovered) {
        console.log("Old Connection");
        console.log("SocketID: ", socket.id);
        console.log("Rooms: ", socket.rooms);
      } else {
        console.log("New Connection");
        console.log("SocketID: ", socket.id);
        console.log("Rooms: ", socket.rooms);
      }

      // Set up `disconnect` event for socket to handle some tasks for individual socket.
      socket.on("disconnect", () => {
        console.log("Disconnect");
        console.log("SocketID: ", socket.id);
        console.log("Rooms: ", socket.rooms);
        socket.removeAllListeners();
      });

      // Set up `initial` event for socket.
      socket.on(MySocket.EventNames.initial, (message) => {
        socket.emit(
          MySocket.EventNames.initial,
          MySocket.createMessage(
            MySocket.EventNames.initial,
            "Hello from Server app of caro game.",
            {
              socketId: socket.id
            }
          )
        );
      });

      // Set up listeners (including listener wrappers)
      this._listeners?.forEach((data) => {
        socket.on(data.name, (...args) => {
          data.fn(socket, args);
        });
      });

      this._listenerWrapper?.forEach((data) => {
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