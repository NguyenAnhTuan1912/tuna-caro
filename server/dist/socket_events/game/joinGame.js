"use strict";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {return value instanceof P ? value : new P(function (resolve) {resolve(value);});}
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
    function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
    function step(result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGameSELWrapperInfo = void 0;
// Import ENV
const env_1 = require("../../env");
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
const Player_1 = require("../../classes/Player");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Containing event name and listener for `join_game` event.
 */
exports.JoinGameSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.joinGame,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __JOINGAME__(message) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const { player, game } = message.data;
          const addedGame = o.gameList.getGame(game.id);
          const wannaJoinPlayer = new Player_1.Player(player);
          let checkPassword = true;
          // Check if game is not exist
          if (!addedGame)
          throw new Error(env_1.env.WS_MESSAGE_KEYS.NOT_EXIST_ROOM);
          // Check if room is full
          if (addedGame === null || addedGame === void 0 ? void 0 : addedGame.isFull())
          throw new Error(env_1.env.WS_MESSAGE_KEYS.FULL_ROOM);
          // Checkpassword
          if (addedGame === null || addedGame === void 0 ? void 0 : addedGame.hasPassword()) {
            checkPassword = yield addedGame.comparePassword(game.password);
          }
          if (!checkPassword)
          throw new Error(env_1.env.WS_MESSAGE_KEYS.WRONG_PASSWORD);
          // Modify something
          addedGame.setPlayer(wannaJoinPlayer);
          addedGame.status = "Playing";
          // Add to socket room
          socket.join(addedGame.id);
          // After the game is added to list and create a socket room, message back to player.
          // Send to host.
          io.
          to(addedGame === null || addedGame === void 0 ? void 0 : addedGame.host.socketId).
          emit(MySocket_1.MySocket.EventNames.joinGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.joinGame, env_1.env.WS_MESSAGE_KEYS.JOIN_GAME, wannaJoinPlayer));
          // Send to player who join the game.
          socket.emit(MySocket_1.MySocket.EventNames.joinGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.joinGame, env_1.env.WS_MESSAGE_KEYS.JOIN_GAME, addedGame));
        }
        catch (error) {
          socket.emit(MySocket_1.MySocket.EventNames.joinGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.joinGame, error.message, undefined, true));
        }
      });
    };
  })
};