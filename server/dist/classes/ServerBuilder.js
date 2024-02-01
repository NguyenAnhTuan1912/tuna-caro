"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerBuilder {
  constructor(options) {
    this.server = options.server;
  }
  /**
   * Use to build middleWares.
   * @param middleWare
   */
  buildMiddleWare(middleWare) {
    this.server.middleWares.push(middleWare);
  }
  /**
   * Use to build API in router object.
   * @param {string} base
   * @param {epxress.Router} router
   */
  buildAPI(base, router) {
    this.server.apis.push({ base, router });
  }
  /**
   * Use to build db connections.
   * @param connection
   */
  buildDBConnection(connection) {
    this.server.dbConnections.push(connection);
  }
  buildSocketEvent(name, listener) {
    this.server.socketIO.addEventListener(name, listener);
  }
  buildSocketEventWrapper(name, wrapper) {
    this.server.socketIO.addEventListenerWrapper(name, wrapper);
  }
}
exports.default = ServerBuilder;