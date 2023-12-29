// Import ENV
import { env } from "env";

// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { GameType } from "classes/Game";
import { Player, PlayerType } from "classes/Player";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

type ReconnectGameMessageDataType = {
  game: GameType;
  player: PlayerType;
};

/**
 * Containing event name and listener for `reconnect_game` event.
 */
export const ReconnectGameSELWrapperInfo = {
  name: MySocket.EventNames.reconnectGame,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return async function __RECONNECTGAME__(message: Message<ReconnectGameMessageDataType>) {
      try {
        const { player, game } = message.data!;
        const addedGame = o.gameList.getGame(game.id)!;
        const reconnectPlayer = new Player(player);

        // Check if game is not exist
        if(!addedGame) throw new Error(env.WS_MESSAGE_KEYS.NOT_EXIST_ROOM);

        // Remove the game removing timeout
        clearTimeout(o.dataRemoveCBs.get(game.id));
        o.dataRemoveCBs.delete(game.id);

        // Modify something
        addedGame.updatePlayer(reconnectPlayer);

        // Add to socket room
        socket.join(addedGame.id);

        // Send to player who reconnect the game.
        socket.emit(
          MySocket.EventNames.reconnectGame,
          MySocket.createMessage(
            MySocket.EventNames.reconnectGame,
            env.WS_MESSAGE_KEYS.RECONNECTED_GAME_SUCCESSFULLY
          )
        );
      } catch (error: any) {
        console.log("Error ~ RECONNECTGAME SEvent: ", error);

        socket.emit(
          MySocket.EventNames.reconnectGame,
          MySocket.createMessage(
            MySocket.EventNames.reconnectGame,
            error.message,
            undefined,
            true
          )
        );
      }
    }
  }) 
};