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
exports.ReconnectGameSELWrapperInfo = void 0;
// Import ENV
const env_1 = require("../../env");
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
const Player_1 = require("../../classes/Player");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Containing event name and listener for `reconnect_game` event.
 */
exports.ReconnectGameSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.reconnectGame,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __RECONNECTGAME__(message) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const { player, game } = message.data;
          const addedGame = o.gameList.getGame(game.id);
          const reconnectPlayer = new Player_1.Player(player);
          // Check if game is not exist
          if (!addedGame)
          throw new Error(env_1.env.WS_MESSAGE_KEYS.NOT_EXIST_ROOM);
          // Remove the game removing timeout
          clearTimeout(o.dataRemoveCBs.get(game.id));
          o.dataRemoveCBs.delete(game.id);
          // Modify something
          addedGame.updatePlayer(reconnectPlayer);
          // Add to socket room
          socket.join(addedGame.id);
          // Send to player who reconnect the game.
          socket.emit(MySocket_1.MySocket.EventNames.reconnectGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.reconnectGame, env_1.env.WS_MESSAGE_KEYS.RECONNECTED_GAME_SUCCESSFULLY));
        }
        catch (error) {
          socket.emit(MySocket_1.MySocket.EventNames.reconnectGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.reconnectGame, error.message, undefined, true));
        }
      });
    };
  })
};