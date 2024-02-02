"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitGameSELWrapperInfo = void 0;
// Import ENV
const env_1 = require("../../env");
// Import from classes
const MySocket_1 = require("../../classes/MySocket");
const Game_1 = require("../../classes/Game");
const Player_1 = require("../../classes/Player");
// Import from templates
const socket_events_1 = require("../../templates/socket_events");
/**
 * Containing event name and listener for `emit_game` event.
 */
exports.EmitGameSELWrapperInfo = {
  name: MySocket_1.MySocket.EventNames.emitGame,
  wrapper: (0, socket_events_1.createSEListenerWrapper)(function (io, socket, o) {
    return function __EMITGAME__(message) {
      try {
        const { game, player } = message.data;
        const newGame = new Game_1.Game(game);
        // Set host
        // Because this is the first player, this player will consider as host.
        newGame.setPlayer(new Player_1.Player(player));
        // Set password
        if (game.password)
        newGame.setPassword(game.password);
        // Add game.
        // Room will be created in this stage.
        o.gameList.addGame(socket, newGame.id, newGame);
        // After the game is added to list and create a socket room, message back to player.
        socket.emit(MySocket_1.MySocket.EventNames.emitGame, MySocket_1.MySocket.createMessage(MySocket_1.MySocket.EventNames.emitGame, env_1.env.WS_MESSAGE_KEYS.CREATE_GAME_SUCCESSFULLY, newGame));
      }
      catch (error) {
        return;
      }
    };
  })
};