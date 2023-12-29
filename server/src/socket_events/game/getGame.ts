// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { GameRoomType } from "classes/Game";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

interface GetGamesMessageDataType {
  limit: number;
  skip: number;
}

/**
 * Provide a listener to listen event `emit_mark`. When a player is hit the table, they will send a message
 * about new mark to server, and this will send to opposite player.
 */
export const GetGamesSELWrapperInfo = {
  name: MySocket.EventNames.getGames,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return function __GETGAMES__(message: Message<GetGamesMessageDataType>) {
      try {
        let { skip = 0, limit = 5 } = message.data!;
        let from = skip;
        let to = skip + limit;

        let games = o.gameList.map<GameRoomType | undefined>(function(game, key, index) {
          if(index >= from && index < to) {
            return {
              id: game?.id,
              playerName: game?.host.name,
              hasPassword: game?.hasPassword(),
              name: game?.name,
              status: game?.status
            } as GameRoomType
          }
        });

        // Send message to player.
        socket
        .emit(
          MySocket.EventNames.getGames,
          MySocket.createMessage(
            MySocket.EventNames.getGames,
            undefined,
            games
          )
        );
      } catch (error: any) {
        console.log("Error ~ GetGame SEvent: ", error);
      }
    }
  })
};