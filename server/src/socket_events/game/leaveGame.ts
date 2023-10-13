import { Socket } from "socket.io";

// Import from classes
import { Message, MySocket } from "classes/MySocket";
import { PlayerType } from "classes/Player";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

interface LeaveGameMessageDataType {
  gameId: string;
  player: PlayerType;
}

/**
 * Containing event name and listener for `leave_game` event.
 */
export const LeaveGameSELWrapperInfo = {
  name: MySocket.EventNames.leaveGame,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return function(message: Message<LeaveGameMessageDataType>) {
      let { gameId, player } = message.data!;
      let game = o.gameList.getGame(gameId)!;

      // Remove player from game.
      game.leaveGame(socket, player.id);
    }
  })
};