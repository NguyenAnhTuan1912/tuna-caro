// const http = require("http");
// const express = require("express");

// const Utils = require("../utils/index");
import http, { Server } from "http";
import express, { Express, Router } from "express";

// Import classes
import { MySocket } from "./MySocket";

// Import utils
import Utils from "utils";

// Import types
import { ServerOptions } from "types";

export default class MyServer {
  port!: string;
  app!: Express;
  instance!: Server;
  socket!: MySocket;

  apis!: Array<{ base: string, router: Router }>;
  middleWares!: Array<any>;
  dbConnections!: Array<Promise<boolean>>

  constructor(options: ServerOptions) {
    this.port = options.port;
    this.app = express();
    this.instance = http.createServer(this.app);
    this.socket = new MySocket({ httpServer: this.instance });

    this.apis = [];
    this.middleWares = [];
    this.dbConnections = [];
  }

  start() {
    // Connect to db first
    Promise.all(this.dbConnections).then(() => {
      // Setup all middleware from middlewares.
      for(let middleWare of this.middleWares) {
        this.app.use(middleWare);
      }

      // Setup all API from apis.
      for(let api of this.apis) {
        this.app.use(api.base, api.router);
      }

      // Setup first API to greet new callers.
      this.app.get("/", function(req, res) {
        try {
          return Utils.RM.responseJSON(
            res,
            200,
            Utils.RM.getResponseMessage(false, {
              id: Utils.Security.getRandomID("carogame")
            }, "Welcome to Tunanguyen Server. You can have perfect experience in here.")
          );
        } catch (error: any) {
          return Utils.RM.responseJSON(
            res,
            500,
            Utils.RM.getResponseMessage(true, undefined, error.message)
          );
        }
      });

      if(this.apis.length === 0) console.warn("There aren't APIs in your server. Please add more APIs before start server.");

      this.instance.listen(this.port, () => { console.log(`You're server is running on http://localhost:${this.port}`); });
    });
  }
}