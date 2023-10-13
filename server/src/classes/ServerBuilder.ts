import { Router } from "express";
import { Socket } from "socket.io";

import MyServer from "./MyServer";

// Import from classes
import { MySocket, ListenerFn } from "./MySocket";

// Import from templates
import { CreateSEListenerWrapperCallback } from "templates/socket_events"; 

// Import from types
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

  buildSocketEvent(name: string, listener: ListenerFn) {
    this.server.socketIO.addEventListener(name, listener);
  }

  buildSocketEventWrapper(name: string, wrapper: CreateSEListenerWrapperCallback) {
    this.server.socketIO.addEventListenerWrapper(name, wrapper);
  }
}