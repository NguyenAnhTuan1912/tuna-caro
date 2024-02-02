"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveGameSELWrapperInfo = void 0;
// Import ENV
const env_1 = require("../../env");
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Containing event name and listener for `leave_game` event.
 */
exports.LeaveGameSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.leaveGame,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __LEAVEGAME__(message) {
      try {
        let { gameId, player } = message.data;
        let game = o.gameList.getGame(gameId);
        if (!game)
        return;
        let remainPlayer = game.getPlayerByExceptedId(player.id);
        let leavePlayer = game.getPlayerById(player.id);
        // Remove player from game.
        game.leaveGame(player.id);
        // Change status of game.
        game.status = "Waiting";
        // Disconnect from room
        socket.leave(game.id);
        // Send message to players
        // Send message to player still in game.
        if (remainPlayer)
        io.
        to(remainPlayer.socketId).
        emit(MySocket_1.MySocket.EventNames.leaveGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.leaveGame, env_1.env.WS_MESSAGE_KEYS.LEAVE_GAME, {
          playerId: leavePlayer.id,
          playerName: player.name,
          isHostLeaved: leavePlayer.id === game.host.id
        }));
        // Send message to player who leave the game.
        socket.
        emit(MySocket_1.MySocket.EventNames.leaveGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.leaveGame, env_1.env.WS_MESSAGE_KEYS.LEAVE_GAME));
        // Check if there are no players in this room, then remove this game from list.
        if (game.isEmpty())
        o.gameList.removeGame(game.id);
      }
      catch (error) {
        return;
      }
    };
  })
};