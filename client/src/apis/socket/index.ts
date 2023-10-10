import { io, Socket } from "socket.io-client";

// Import constant
import { API_ROOT } from 'src/utils/constant';

export interface Message<T> {
  eventName: string;
  isError: boolean;
  text?: string;
  data?: T
}

export type EventNames = keyof typeof MySocket.EventNames;

export class MySocket {
  private _socket!: Socket;
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
    leaveGame: "leave_game"
  };

  constructor() {
    this._socket = io(API_ROOT);
    this._init();
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

  private _init() {
    this._socket.on(MySocket.EventNames.initial, (message) => {
      console.log(message);
    });
  }

  /**
   * FOR FUN
   * 
   * Use this method to say hello to caro server.
   */
  handshake() {
    this._socket.emit(MySocket.EventNames.initial, "Hello from client app of caro-game");
  }

  /**
   * Use this method to disconnect socket connection without reconnect.
   */
  disconnect() {
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
   * Use this method to send message to `name` event with a `message`.
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
}