import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";

// Import env
import { env } from 'env';

// Import classes
import { GameList } from "./GameList";

interface MySocketOptions {
  httpServer: Server
}

interface Message<T> {
  eventName: string;
  isError: boolean;
  text?: string;
  data?: T
}

export type EventNames = keyof typeof MySocket.EventNames;


interface Listener<O, T> {
  name: string;
  fn: (socket: Socket, o: O, ...args: any[]) => void;
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
    initial: "initial",
    emitGame: "emit_game"
  };

  // Objects
  private _gameList!: GameList;
  private _listeners: Array<Listener<any, any>> | null;

  constructor(options: MySocketOptions) {
    this._io = new SocketServer(options.httpServer, {
      cors: {
        origin: env.REQUEST_ORIGIN,
        credentials: true
      }
    });
    this._gameList = new GameList();
    this._listeners = [];

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
      socket.on(MySocket.EventNames.initial, (message) => {
        console.log("SocketID: ", socket.id);
        console.log(message);

        socket.emit(MySocket.EventNames.initial, "Hello from Server app of caro game.");

        this._listeners?.forEach((data) => {
          socket.on(data.name, (...args) => {
            data.fn(socket, args);
          });
        });

        if(this._listeners) this._listeners = null;
      });
    });
  }

  /**
   * Use this method to add event listener for socket.
   * @param name 
   * @param listener 
   */
  addEventListener<O>
  (name: string, listener: (socket: Socket, o: O, ...args: any[]) => void)
  {
    switch(name) {
      case MySocket.EventNames.emitGame: {
        this._listeners!.push({ name, fn: (socket, ...args: any[]) => { listener(socket, this._gameList as O, ...args) } });
        return;
      }
    }
  }
}