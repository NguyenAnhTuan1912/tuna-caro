"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitMarkSELWrapperInfo = void 0;
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Provide a listener to listen event `emit_mark`. When a player is hit the table, they will send a message
 * about new mark to server, and this will send to opposite player.
 */
exports.EmitMarkSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.emitMark,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __EMITMARK__(message) {
      try {
        let data = message.data;
        let game = o.gameList.getGame(data.gameId);
        // Switch turn
        game.switchTurn();
        // Send message to opposite player.
        socket.
        broadcast.
        to(data.gameId).
        emit(MySocket_1.MySocket.EventNames.emitMark, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.emitMark, undefined, {
          coor: data.coor,
          mark: data.mark
        }));
      }
      catch (error) {
        return;
      }
    };
  })
};