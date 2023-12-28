// Import ENV
import { env } from "env";

// Import from classes
import { Message, MySocket } from "classes/MySocket";
import { Player, PlayerType } from "classes/Player";

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
    return function __LEAVEGAME__(message: Message<LeaveGameMessageDataType>) {
      try {
        let { gameId, player } = message.data!;
        let game = o.gameList.getGame(gameId)!;

        if(!game) return;

        let remainPlayer = game.getPlayerByExceptedId(player.id);
        let leavePlayer = game.getPlayerById(player.id)!;

        // Remove player from game.
        game.leaveGame(player.id);

        // Change status of game.
        game.status = "Waiting";

        // Disconnect from room
        socket.leave(game.id);

        // Send message to players
        // Send message to player still in game.
        if(remainPlayer)
          io
          .to(remainPlayer.socketId!)
          .emit(
            MySocket.EventNames.leaveGame,
            MySocket.createMessage(
              MySocket.EventNames.leaveGame,
              env.WS_MESSAGE_KEYS.LEAVE_GAME,
              {
                playerId: leavePlayer.id,
                isHostLeaved: leavePlayer.id === game.host.id
              }
            )
          );

        // Send message to player who leave the game.
        socket
        .emit(
          MySocket.EventNames.leaveGame,
          MySocket.createMessage(
            MySocket.EventNames.leaveGame,
            env.WS_MESSAGE_KEYS.LEAVE_GAME
          )
        );
        console.log("Socket rooms (after leave): ", socket.rooms);
        console.log("Players: ", game.getPlayers(true));

        // Check if there are no players in this room, then remove this game from list.
        if(game.isEmpty()) o.gameList.removeGame(game.id);
      } catch (error: any) {
        console.log("Error ~ LeaveGame SEvent: ", error);
      }
    }
  })
};