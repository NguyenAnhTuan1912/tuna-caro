"use strict";
// const http = require("http");
// const express = require("express");
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const Utils = require("../utils/index");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
// Import classes
const MySocket_1 = require("./MySocket");
// Import utils
const utils_1 = __importDefault(require("../utils"));
class MyServer {
  constructor(options) {
    this.port = options.port;
    this.app = (0, express_1.default)();
    this.instance = http_1.default.createServer(this.app);
    this.socketIO = new MySocket_1.MySocket({ httpServer: this.instance });
    this.apis = [];
    this.middleWares = [];
    this.dbConnections = [];
  }
  start() {
    // Connect to db first
    Promise.all(this.dbConnections).then(() => {
      // Setup all middleware from middlewares.
      for (let middleWare of this.middleWares) {
        this.app.use(middleWare);
      }
      // Setup all API from apis.
      for (let api of this.apis) {
        this.app.use(api.base, api.router);
      }
      // Setup first API to greet new callers.
      this.app.get("/", function (req, res) {
        try {
          return utils_1.default.RM.responseJSON(res, 200, utils_1.default.RM.getResponseMessage(false, {
            id: utils_1.default.Security.getRandomID("", 2, 8)
          }, "This is the server of caro-game. An application in Nguyen Anh Tuan's Project."));
        }
        catch (error) {
          return utils_1.default.RM.responseJSON(res, 500, utils_1.default.RM.getResponseMessage(true, undefined, error.message));
        }
      });
      if (this.apis.length === 0)
      console.warn("There aren't APIs in your server. Please add more APIs before start server.");
      this.instance.listen(this.port, () => {console.log(`You're server is running on http://localhost:${this.port}`);});
    });
  }
}
exports.default = MyServer;