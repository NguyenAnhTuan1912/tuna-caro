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
    emitGame: "emit_game"
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
   * Use this method to add an event listener to socket.
   * @param name 
   * @param listener 
   */
  addEventListener(name: string, listener: (...args: Array<any>) => void) {
    this._socket.on(name, listener);
  }

  /**
   * Use this method to send message to `name` event with a `message`.
   * @param name 
   * @param message 
   */
  emit<T>(name: string, message?: Message<T>) {
    this._socket.emit(name, message);
  }
}

const socket = new MySocket();
export { socket };