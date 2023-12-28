// Import ENV
import { env } from "env";

// Import from classes
import { MySocket, Message } from "classes/MySocket";
import { GameType } from "classes/Game";
import { Player, PlayerType } from "classes/Player";

// Import from templates
import { createSEListenerWrapper } from "templates/socket_events";

type JoinGameMessageDataType = {
  game: GameType;
  player: PlayerType;
};

/**
 * Containing event name and listener for `join_game` event.
 */
export const JoinGameSELWrapperInfo = {
  name: MySocket.EventNames.joinGame,
  wrapper: createSEListenerWrapper(function(io, socket, o) {
    return async function __JOINGAME__(message: Message<JoinGameMessageDataType>) {
      try {
        const { player, game } = message.data!;
        const addedGame = o.gameList.getGame(game.id)!;
        const wannaJoinPlayer = new Player(player);
        let checkPassword = true;

        // Check if game is not exist
        if(!addedGame) throw new Error(env.WS_MESSAGE_KEYS.NOT_EXIST_ROOM);

        // Check if room is full
        if(addedGame?.isFull()) throw new Error(env.WS_MESSAGE_KEYS.FULL_ROOM);

        // Checkpassword
        if(addedGame?.hasPassword()) {
          checkPassword = await addedGame.comparePassword(game.password!);
        }

        if(!checkPassword) throw new Error(env.WS_MESSAGE_KEYS.WRONG_PASSWORD);

        // Modify something
        addedGame.setPlayer(wannaJoinPlayer);
        addedGame.status = "Playing";

        // Add to socket room
        socket.join(addedGame.id);

        // After the game is added to list and create a socket room, message back to player.
        // Send to host.
        io
        .to(addedGame?.host.socketId!)
        .emit(
          MySocket.EventNames.joinGame,
          MySocket.createMessage(
            MySocket.EventNames.joinGame,
            env.WS_MESSAGE_KEYS.JOIN_GAME,
            wannaJoinPlayer
          )
        );

        // Send to player who join the game.
        socket.emit(
          MySocket.EventNames.joinGame,
          MySocket.createMessage(
            MySocket.EventNames.joinGame,
            env.WS_MESSAGE_KEYS.JOIN_GAME,
            addedGame
          )
        );
      } catch (error: any) {
        console.log("Error ~ JOINGAME SEvent: ", error);

        socket.emit(
          MySocket.EventNames.joinGame,
          MySocket.createMessage(
            MySocket.EventNames.joinGame,
            error.message,
            undefined,
            true
          )
        );
      }
    }
  }) 
};