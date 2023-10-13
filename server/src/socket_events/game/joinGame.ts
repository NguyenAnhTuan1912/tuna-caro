// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { GameType } from "classes/Game";
import { Player, PlayerType } from "classes/Player";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

interface JoinGameMessageDataType {
  game: GameType;
  player: PlayerType;
}

/**
 * Containing event name and listener for `join_game` event.
 */
export const JoinGameSELWrapperInfo = {
  name: MySocket.EventNames.joinGame,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return async function(message: Message<JoinGameMessageDataType>) {
      try {
        const { player, game } = message.data!;
        const addedGame = o.gameList.getGame(game.id)!;
        const wannaJoinPlayer = new Player(player);
        let checkPassword = true;

        // Checkpassword
        if(addedGame?.hasPassword()) {
          checkPassword = await addedGame.comparePassword(game.password!);
        }

        if(!checkPassword) {
          socket.emit(
            MySocket.EventNames.joinGame,
            MySocket.createMessage(
              MySocket.EventNames.joinGame,
              "Sai mật khẩu!"
            )
          );
          return;
        }

        // Modify something
        addedGame.setPlayer(wannaJoinPlayer);
        addedGame.status = "Playing";

        // After the game is added to list and create a socket room, message back to player.
        // Send to host.
        io
        .to(addedGame?.host.socketId!)
        .emit(
          MySocket.EventNames.joinGame,
          MySocket.createMessage(
            MySocket.EventNames.joinGame,
            `${wannaJoinPlayer.name} vừa mới vào game.`,
            wannaJoinPlayer
          )
        );

        // Send to player who join the game.
        socket.emit(
          MySocket.EventNames.joinGame,
          MySocket.createMessage(
            MySocket.EventNames.joinGame,
            "Tham gia game thành công!",
            addedGame
          )
        );
      } catch (error: any) {
        console.log("Error ~ JOIN GAME: ", error.message);
      }
    }
  }) 
};