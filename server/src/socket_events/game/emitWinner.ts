// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { Coordinate, MarkType, ResultType } from "classes/Game";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

interface EmitWinnerMessageDataType {
  mark: MarkType;
  coor: Coordinate;
  gameId: string;
  winner: ResultType;
}

/**
 * Provide a listener to listen event `emit_winner`. When a player know they are win, they will send
 * a message to server and server will send this message to opposite player.
 */
export const EmitWinnerSELWrapperInfo = {
  name: MySocket.EventNames.emitWinner,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return function __EMITWINNER__(message: Message<EmitWinnerMessageDataType>) {
      try {
        let data = message.data!;

        // Send message to opposite player.
        socket
        .broadcast
        .to(data.gameId)
        .emit(
          MySocket.EventNames.emitWinner,
          MySocket.createMessage(
            MySocket.EventNames.emitWinner,
            undefined,
            {
              coor: data.coor,
              mark: data.mark,
              winner: data.winner
            }
          )
        );
      } catch (error: any) {
        console.log("Error ~ EmitWinner SEvent: ", error);
      }
    }
  })
};