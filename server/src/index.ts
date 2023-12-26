/**
 * This is the main file of struct_01.
 * This file used to setup, configure something before starting.
 */
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const Server = require("./classes/Server");
// const ServerBuilder = require("./classes/ServerBuilder");

// const PostRouter = require("./modules/post");
import bodyParser from "body-parser";
import cors from "cors";

import MyServer from "classes/MyServer";
import ServerBuilder from "classes/ServerBuilder";

// Import env
import { env } from 'env';

// DBs
import CaroGameDB from "db/carogame";

// Import routers
import CharacterRouter from "modules/characters";

// Import socket event listener wrappers
import { EmitGameSELWrapperInfo } from "socket_events/game/emitGame";
import { JoinGameSELWrapperInfo } from "socket_events/game/joinGame";
import { EmitMarkSELWrapperInfo } from "socket_events/game/emitMark";
import { LeaveGameSELWrapperInfo } from "socket_events/game/leaveGame";
import { ReconnectGameSELWrapperInfo } from "socket_events/game/reconnectGame";
import { EmitWinnerSELWrapperInfo } from "socket_events/game/emitWinner";
import { StartNewRoundSELWrapperInfo } from "socket_events/game/startNewRound";
import { GetGamesSELWrapperInfo } from "socket_events/game/getGame";

const ExpressServer = new MyServer({ port: process.env.PORT || "5000" });
const builder = new ServerBuilder({ server: ExpressServer });
const base = "/api";

/**
 * The order of build actions is not important.
 */

// Build something before start
// Build middle-wares
builder.buildMiddleWare(cors({
  // Custom cors.
  origin: function(origin, cb) {
    if(env.NODE_ENV === "development") return cb(null, true);
    if(env.AUTHORIZED_DOMAINS?.indexOf(origin!) !== -1) return cb(null, true);
    return cb(new Error(`${origin} is not allowed by CORS.`));
  },
  credentials: true
}));
builder.buildMiddleWare(bodyParser.json());
builder.buildMiddleWare(bodyParser.urlencoded({ extended: true }));

// Build API
// http://localhost:3000/api/post?id=post_01
// http://localhost:3000/api/posts
builder.buildAPI(base, CharacterRouter);

// Build Socket
builder.buildSocketEventWrapper(EmitGameSELWrapperInfo.name, EmitGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(JoinGameSELWrapperInfo.name, JoinGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(EmitMarkSELWrapperInfo.name, EmitMarkSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(LeaveGameSELWrapperInfo.name, LeaveGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(ReconnectGameSELWrapperInfo.name, ReconnectGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(EmitWinnerSELWrapperInfo.name, EmitWinnerSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(StartNewRoundSELWrapperInfo.name, StartNewRoundSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(GetGamesSELWrapperInfo.name, GetGamesSELWrapperInfo.wrapper);

// Connect to DB
builder.buildDBConnection(CaroGameDB.connect());

// Start new server.
ExpressServer.start();