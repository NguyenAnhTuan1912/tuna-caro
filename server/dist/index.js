"use strict";
/**
 * This is the main file of struct_01.
 * This file used to setup, configure something before starting.
 */
// const bodyParser = require("body-parser");
// const cors = require("cors");
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const Server = require("./classes/Server");
// const ServerBuilder = require("./classes/ServerBuilder");
// const PostRouter = require("./modules/post");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const MyServer_1 = __importDefault(require("./classes/MyServer"));
const ServerBuilder_1 = __importDefault(require("./classes/ServerBuilder"));
// Import env
const env_1 = require("./env");
// DBs
const carogame_1 = __importDefault(require("./db/carogame"));
// Import routers
const characters_1 = __importDefault(require("./modules/characters"));
const drive_1 = __importDefault(require("./modules/drive"));
// Import socket event listener wrappers
const emitGame_1 = require("./socket_events/game/emitGame");
const joinGame_1 = require("./socket_events/game/joinGame");
const emitMark_1 = require("./socket_events/game/emitMark");
const leaveGame_1 = require("./socket_events/game/leaveGame");
const reconnectGame_1 = require("./socket_events/game/reconnectGame");
const emitWinner_1 = require("./socket_events/game/emitWinner");
const startNewRound_1 = require("./socket_events/game/startNewRound");
const getGame_1 = require("./socket_events/game/getGame");
const ExpressServer = new MyServer_1.default({ port: process.env.PORT || "5000" });
const builder = new ServerBuilder_1.default({ server: ExpressServer });
const base = "/api";
/**
 * The order of build actions is not important.
 */
// Build something before start
// Build middle-wares
builder.buildMiddleWare((0, cors_1.default)({
  // Custom cors.
  origin: function (origin, cb) {
    var _a;
    if (env_1.env.NODE_ENV === "development")
    return cb(null, true);
    if (((_a = env_1.env.AUTHORIZED_DOMAINS) === null || _a === void 0 ? void 0 : _a.indexOf(origin)) !== -1)
    return cb(null, true);
    return cb(new Error(`${origin} is not allowed by CORS.`));
  },
  credentials: true
}));
builder.buildMiddleWare(body_parser_1.default.json());
builder.buildMiddleWare(body_parser_1.default.urlencoded({ extended: true }));
// Build API
// http://localhost:3000/api/post?id=post_01
// http://localhost:3000/api/posts
builder.buildAPI(base, characters_1.default);
builder.buildAPI(base, drive_1.default);
// Build Socket
builder.buildSocketEventWrapper(emitGame_1.EmitGameSELWrapperInfo.name, emitGame_1.EmitGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(joinGame_1.JoinGameSELWrapperInfo.name, joinGame_1.JoinGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(emitMark_1.EmitMarkSELWrapperInfo.name, emitMark_1.EmitMarkSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(leaveGame_1.LeaveGameSELWrapperInfo.name, leaveGame_1.LeaveGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(reconnectGame_1.ReconnectGameSELWrapperInfo.name, reconnectGame_1.ReconnectGameSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(emitWinner_1.EmitWinnerSELWrapperInfo.name, emitWinner_1.EmitWinnerSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(startNewRound_1.StartNewRoundSELWrapperInfo.name, startNewRound_1.StartNewRoundSELWrapperInfo.wrapper);
builder.buildSocketEventWrapper(getGame_1.GetGamesSELWrapperInfo.name, getGame_1.GetGamesSELWrapperInfo.wrapper);
// Connect to DB
builder.buildDBConnection(carogame_1.default.connect());
// Start new server.
ExpressServer.start();