// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { Coordinate, MarkType, ResultType } from "classes/Game";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

/**
 * Provide a listener to listen event `start_new_round`. Host want to start a new round, they will send a message
 * to server, and this listener will handle it and send message to opposite player.
 */
export const StartNewRoundSELWrapperInfo = {
  name: MySocket.EventNames.startNewRound,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return function(message: Message<{ gameId: string }>) {
      try {
        let data = message.data!;

        // Send message to opposite player.
        socket
        .broadcast
        .to(data.gameId)
        .emit(
          MySocket.EventNames.startNewRound,
          MySocket.createMessage(
            MySocket.EventNames.startNewRound,
            undefined,
            true
          )
        );
      } catch (error: any) {
        console.log("Error ~ StartNewRound SEvent: ", error);
      }
    }
  })
};