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
    return function(message: Message<LeaveGameMessageDataType>) {
      let { gameId, player } = message.data!;
      let game = o.gameList.getGame(gameId)!;
      let players = game.getPlayers(true) as Array<Player>;
      let remainPlayer, leavePlayer;
      console.log("Socket rooms (before leave): ", socket.rooms);
      if(players[0] && players[0].id === player.id) {
        leavePlayer = players[0];
        remainPlayer = players[1];
      } else {
        remainPlayer = players[0];
        leavePlayer = players[1];
      }

      // Remove player from game.
      game.leaveGame(player.id);

      // Disconnect from room
      socket.leave(game.id);

      // Send message to players
      if(remainPlayer)
        io
        .to(remainPlayer.socketId!)
        .emit(
          MySocket.EventNames.leaveGame,
          MySocket.createMessage(
            MySocket.EventNames.leaveGame,
            `${leavePlayer.name} đã rời trò chơi.`,
            {
              playerId: leavePlayer.id
            }
          )
        );

      socket
      .emit(
        MySocket.EventNames.leaveGame,
        MySocket.createMessage(
          MySocket.EventNames.leaveGame,
          `Bạn đã rời trò chơi.`
        )
      );
      console.log("Socket rooms (after leave): ", socket.rooms);
      console.log("Players: ", game.getPlayers(true));
      // Check if there are no players in this room
      if(game.isEmpty()) o.gameList.removeGame(game.id);
    }
  })
};