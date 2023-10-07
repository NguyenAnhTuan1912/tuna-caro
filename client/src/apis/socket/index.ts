import { io, Socket } from "socket.io-client";

// Import constant
import { API_ROOT } from 'src/utils/constant';

export class MySocket {
  private _socket!: Socket;
  static EventNames = {
    /**
     * Init a connection between client and server.
     */
    initial: "initial"
  };

  constructor() {
    this._socket = io(API_ROOT);
    this._init();
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
}

const socket = new MySocket();
export { socket };