import { Server } from "http";
import { Server as SocketServer } from "socket.io";

// Import env
import { env } from 'env';

interface MySocketOptions {
  httpServer: Server
}

/**
 * Create a instance to manage all socket events inside app. Like a central of socket events.
 */
export class MySocket {
  private _io!: SocketServer;
  static EventNames = {
    /**
     * Init a connection between client and server.
     */
    initial: "initial"
  };

  constructor(options: MySocketOptions) {
    this._io = new SocketServer(options.httpServer, {
      cors: {
        origin: env.REQUEST_ORIGIN,
        credentials: true
      }
    });

    this._init();
  }

  /**
   * Use this method to basically init configurations for socket.
   */
  private _init() {
    this._io.on("connection", (socket) => {
      socket.on(MySocket.EventNames.initial, (message) => {
        console.log("SocketID: ", socket.id);
        console.log(message);
        socket.emit(MySocket.EventNames.initial, "Hello from Server app of caro game.");
      });
    });
  }

  /**
   * Use this method to add event listener for socket.
   * @param name 
   * @param listener 
   */
  addEvent(name: string, listener: (...args: any[]) => void) {
    this._io.on(name, listener);
  }
}