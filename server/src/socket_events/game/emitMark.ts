// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { Coordinate, MarkType } from "classes/Game";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

interface EmitMarkMessageDataType {
  mark: MarkType;
  coor: Coordinate;
  gameId: string;
}

/**
 * Provide a listener to listen event `emit_mark`. This will send message to host that will
 * tell them a player has just joined the game.
 */
export const EmitMarkSELWrapperInfo = {
  name: MySocket.EventNames.emitMark,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return function(message: Message<EmitMarkMessageDataType>) {
      let data = message.data!;
      let game = o.gameList.getGame(data.gameId)!;

      // Switch turn
      game.switchTurn();

      // Send message to opposite player.
      socket
      .broadcast
      .to(data.gameId)
      .emit(
        MySocket.EventNames.emitMark,
        MySocket.createMessage(
          MySocket.EventNames.emitMark,
          undefined,
          {
            coor: data.coor,
            mark: data.mark
          }
        )
      );
    }
  })
};