import { Router } from "express";
import { Socket } from "socket.io";

import MyServer from "./MyServer";

import { ServerBuilderOptions } from "types";

export default class ServerBuilder {
  server!: MyServer

  constructor(options: ServerBuilderOptions) {
    this.server = options.server;
  }

  /**
   * Use to build middleWares.
   * @param middleWare 
   */
  buildMiddleWare(middleWare: any) {
    this.server.middleWares.push(middleWare);
  }

  /**
   * Use to build API in router object.
   * @param {string} base 
   * @param {epxress.Router} router 
   */
  buildAPI(base: string, router: Router) {
    this.server.apis.push({ base, router });
  }

  /**
   * Use to build db connections.
   * @param connection 
   */
  buildDBConnection(connection: Promise<boolean>) {
    this.server.dbConnections.push(connection);
  }

  buildSocketEvent<O>(name: string, listener: (socket: Socket, o: O, ...args: any[]) => void) {
    this.server.socket.addEventListener(name, listener);
  }
}