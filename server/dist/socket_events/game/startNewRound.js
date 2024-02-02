"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartNewRoundSELWrapperInfo = void 0;
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Provide a listener to listen event `start_new_round`. Host want to start a new round, they will send a message
 * to server, and this listener will handle it and send message to opposite player.
 */
exports.StartNewRoundSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.startNewRound,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function (message) {
      try {
        let data = message.data;
        // Send message to opposite player.
        socket.
        broadcast.
        to(data.gameId).
        emit(MySocket_1.MySocket.EventNames.startNewRound, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.startNewRound, undefined, true));
      }
      catch (error) {
        return;
      }
    };
  })
};