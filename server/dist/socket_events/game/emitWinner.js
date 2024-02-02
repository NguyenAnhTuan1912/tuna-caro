"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitWinnerSELWrapperInfo = void 0;
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Provide a listener to listen event `emit_winner`. When a player know they are win, they will send
 * a message to server and server will send this message to opposite player.
 */
exports.EmitWinnerSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.emitWinner,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __EMITWINNER__(message) {
      try {
        let data = message.data;
        // Send message to opposite player.
        socket.
        broadcast.
        to(data.gameId).
        emit(MySocket_1.MySocket.EventNames.emitWinner, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.emitWinner, undefined, {
          coor: data.coor,
          mark: data.mark,
          winner: data.winner
        }));
      }
      catch (error) {
        return;
      }
    };
  })
};