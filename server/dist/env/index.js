"use strict";
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envPaths = [".env", ".env.wsms"];
// Configure environment variables depend of paths.
envPaths.forEach((path) => {
  dotenv_1.default.config({ path });
});
// Define some domains that can have permission to request.
const AUTHORIZED_DOMAINS = (_a = process.env.AUTHORIZED_DOMAINS) === null || _a === void 0 ? void 0 : _a.split(";");
exports.env = {
  AUTHORIZED_DOMAINS,
  NODE_ENV: process.env.NODE_ENV,
  DB_USER_PASSWORDS: {
    CAROGAME: process.env.DB_CAROGAME_PASSWORD
  },
  WS_MESSAGE_KEYS: {
    NOT_EXIST_ROOM: process.env.NOT_EXIST_ROOM,
    FULL_ROOM: process.env.FULL_ROOM,
    WRONG_PASSWORD: process.env.WRONG_PASSWORD,
    CREATE_GAME_SUCCESSFULLY: process.env.CREATE_GAME_SUCCESSFULLY,
    DISCONNECTED: process.env.DISCONNECTED,
    RECONNECTED: process.env.RECONNECTED,
    LEAVE_GAME: process.env.LEAVE_GAME,
    RECONNECTED_GAME_SUCCESSFULLY: process.env.RECONNECTED_GAME_SUCCESSFULLY,
    HANDSHAKE: process.env.HANDSHAKE,
    JOIN_GAME: process.env.JOIN_GAME
  },
  GAPI_CLIENT_ID: process.env.GAPI_CLIENT_ID,
  GAPI_CLIENT_SECRET: process.env.GAPI_CLIENT_SECRET,
  GAPI_REDIRECT_URI: process.env.GAPI_REDIRECT_URI,
  GAPI_REFRESH_TOKEN: process.env.GAPI_REFRESH_TOKEN
};