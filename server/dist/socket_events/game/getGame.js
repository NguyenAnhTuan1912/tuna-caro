"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGamesSELWrapperInfo = void 0;
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Provide a listener to listen event `emit_mark`. When a player is hit the table, they will send a message
 * about new mark to server, and this will send to opposite player.
 */
exports.GetGamesSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.getGames,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __GETGAMES__(message) {
      try {
        let { skip = 0, limit = 5 } = message.data;
        let from = skip;
        let to = skip + limit;
        let games = o.gameList.map(function (game, key, index) {
          if (index >= from && index < to) {
            return {
              id: game === null || game === void 0 ? void 0 : game.id,
              playerName: game === null || game === void 0 ? void 0 : game.host.name,
              hasPassword: game === null || game === void 0 ? void 0 : game.hasPassword(),
              name: game === null || game === void 0 ? void 0 : game.name,
              status: game === null || game === void 0 ? void 0 : game.status
            };
          }
        });
        // Send message to player.
        socket.
        emit(MySocket_1.MySocket.EventNames.getGames, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.getGames, undefined, games));
      }
      catch (error) {
        return;
      }
    };
  })
};