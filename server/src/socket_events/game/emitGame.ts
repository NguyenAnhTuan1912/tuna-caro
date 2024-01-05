// Import ENV
import { env } from "env";

// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { Game, GameType } from "classes/Game";
import { Player, PlayerType } from "classes/Player";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

interface EmitGameMessageDataType {
  game: GameType;
  player: PlayerType;
}

/**
 * Containing event name and listener for `emit_game` event.
 */
export const EmitGameSELWrapperInfo = {
  name: MySocket.EventNames.emitGame,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return function __EMITGAME__(message: Message<EmitGameMessageDataType>) {
      try {
        const { game, player } = message.data!;
        const newGame = new Game(game);

        // Set host
        // Because this is the first player, this player will consider as host.
        newGame.setPlayer(new Player(player));

        // Set password
        if(game.password) newGame.setPassword(game.password);

        // Add game.
        // Room will be created in this stage.
        o.gameList.addGame(socket, newGame.id, newGame);

        // After the game is added to list and create a socket room, message back to player.
        socket.emit(
          MySocket.EventNames.emitGame,
          MySocket.createMessage(
            MySocket.EventNames.emitGame,
            env.WS_MESSAGE_KEYS.CREATE_GAME_SUCCESSFULLY,
            newGame
          )
        );
      } catch (error: any) {
        return;
      }
    }
  })
};