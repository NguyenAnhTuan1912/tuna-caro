import { io, Socket } from "socket.io-client";

// Import constant
import { API_ROOT } from 'src/utils/constant';

// Import from types
import { InitialEventDataType } from "src/types/socket.types";

// Private instance
let __private__: MySocket | null = null;

export interface Message<T> {
  eventName: string;
  isError: boolean;
  text?: string;
  data?: T;
}

export type EventNames = keyof typeof MySocket.EventNames;

export class MySocket {
  private _socket!: Socket;

  private static _canInit: boolean = true;
  static EventNames = {
    /**
     * Init a connection between client and server.
     */
    initial: "initial",
    /**
     * This event is mean create game and emit it to server. Then
     * get it back with `id`.
     */
    emitGame: "emit_game",
    /**
     * This event is mean when a player mark to table, this will emit the message and
     * listen to this event, then opposite player can catch the change.
     */
    emitMark: "emit_mark",
    /**
     * This event is mean a player join a game, this will emit the message and listen to this event.
     * So a player join a game, and opposite player will know about it.
     */
    joinGame: "join_game",
    /**
     * This event is mean a player leave the game, this will emit the message and listen to this event.
     * If a player leave the game, opposite player will know and app will calculate and re-render to sync with state.
     */
    leaveGame: "leave_game",
    /**
     * This event is mean the game has player. When player hit the table and win the game, this event will be fired.
     * Sending new information of mark and winner.
     */
    emitWinner: "emit_winner",
    /**
     * This event is mean the game move to new round. When the round has winner, host will be click the start new round
     * in the right bottom corner. This event will send the message to another player to tell them start new round.
     */
    startNewRound: "start_new_round",
    /**
     * This event is mean a player connection status to a game. If player connection status is change, send message
     * to another player.
     */
    gameConnectionStatus: "game_connection_status",
    /**
     * This event is mean player get games in server. When a player create a game, its data will store (fast solution) in
     * server. So if another player go to Game Rooms Page, they will see multiple Game Rooms.
     */
    getGames: "get_games"
  };

  constructor() {
    // Apply singleton pattern.
    if(__private__) return __private__;
    this._socket = io(API_ROOT);
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
   * Use this method to init socket.
   * @param cb 
   */
  init(cb: (message: Message<InitialEventDataType>) => void) {
    if(!MySocket._canInit) return;
    // Set up initial event to do something at first.
    this._socket.on(MySocket.EventNames.initial, (message: Message<InitialEventDataType>) => {
      cb(message);
    });
    MySocket._canInit = false;
  }

  /**
   * Use this method to say hello to caro server and get socketId.
   */
  handshake() {
    this._socket.emit(MySocket.EventNames.initial, "Hello from client app of caro-game");
  }

  /**
   * Use this method to disconnect socket connection without reconnect.
   */
  disconnect() {
    MySocket._canInit = true;
    this._socket.removeListener(MySocket.EventNames.initial);
    this._socket.disconnect();
  }

  /**
   * Use this method to add an event listener to socket.
   * @param name 
   * @param listener 
   */
  addEventListener(name: string, listener: (...args: Array<any>) => void) {
    this._socket.on(name, listener);
    return listener;
  }

  /**
   * Use this method to remove a specific listener.
   * @param name 
   * @param listener 
   */
  removeEventListener(name?: string, listener?: (...args: Array<any>) => void) {
    this._socket.removeListener(name, listener);
  }

  /**
   * Use this method to send message to `name` event with a `message`. Neither the socket is connected nor isn't connected.
   * @param name 
   * @param message 
   */
  emit<T>(message?: Message<T>): void;
  emit<T>(name?: string | Message<T>, message?: Message<T>): void;
  emit<T>(_?: string | Message<T>, message?: Message<T>) {
    if(typeof _ === "string") {
      this._socket.emit(_, message);
      return;
    } else {
      this._socket.emit(_?.eventName!, _);
    }
  }

  /**
   * Use this method to send message to `name` event with a `message` when the `socket.connected` is true, if not,
   * socket will terminate message.
   * @param name 
   * @param message 
   */
  emitVolatilely<T>(message?: Message<T>): void;
  emitVolatilely<T>(name?: string | Message<T>, message?: Message<T>): void;
  emitVolatilely<T>(_?: string | Message<T>, message?: Message<T>) {
    if(typeof _ === "string") {
      this._socket.volatile.emit(_, message);
      return;
    } else {
      this._socket.volatile.emit(_?.eventName!, _);
    }
  }
}

// Create private instance
if(!__private__) __private__ = new MySocket();

/**
 * A `MySocket` instance, use to commuticate in socket conversation.
 */
export const mySocket = new MySocket();