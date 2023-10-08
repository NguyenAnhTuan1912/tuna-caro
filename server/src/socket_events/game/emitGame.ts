// Import classes
import { MySocket } from "classes/MySocket";
import { GameList } from "classes/GameList";
import { Game, GameType } from "classes/Game";

// Import templates
// import { createSocketEvent } from "templates/socket_events";
import { Socket } from "socket.io";

// export const EmitGameSEListener = createSocketEvent<GameList>("emitGame",
//   function(socket, o, gameInfo: GameType) {
//     o.addGame(gameInfo.id, new Game(gameInfo));
//     socket.emit(MySocket.EventNames.emitGame, "");
//   }
// );

export const EmitGameSEListener = {
  name: MySocket.EventNames.emitGame,
  fn: function(socket: Socket, gameList: GameList, gameInfo: GameType) {
    gameList.addGame(socket, gameInfo.id, new Game(gameInfo));

    // After add game to list and create a socket room, message back to player.
    socket.emit(
      MySocket.EventNames.emitGame,
      MySocket.createMessage(
        MySocket.EventNames.emitGame,
        "Create game successfully."
      )
    );
  }
};