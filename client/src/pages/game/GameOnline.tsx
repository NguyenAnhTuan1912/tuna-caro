/**
 * This is a GameCore Wrapper Component named GameOnline.
 * Its responsibility is handle online game:
 * - Receive and set up some information about game and players.
 * - Handle socket events (send and receive message).
 */

// Import from apis
import { MySocket, mySocket } from 'src/apis/socket';

// Import hooks
import { usePlayer } from 'src/hooks/usePlayer';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import components
import GameCore from './GameCore';

// Locally Import
import { GameOnlineSocketEvents } from './socket_events/game_online';

// Import types
import { EmitMarkMessageDataType, EmitWinnerMessageDataType } from './Game.props';

//
/**
 * This component depend on `GamePage` to render an online game.
 * @returns 
 */
export default function GameOnline() {
  /*
    Player will only has 3 properties are treated as global state:
    - Id: id code of player.
    - Name: name of player.
    - SocketId: id code of socket.

    So the player's information must be cloned before create the game.
  */
  const { player } = usePlayer();
  const { getData } = useGlobalData();
  // Game game data here.
  /*
    Game data can be:
    - Create directly when player create the game.
    - Create and get from server when player join the game.
  */
  const data = getData();

  return (
    <GameCore
      useEffectCB={function(args) {
        let emitMarkListener = mySocket.addEventListener(
          MySocket.EventNames.emitMark,
          GameOnlineSocketEvents.getEmitMarkListener({
            useEffectArgs: args
          })
        );
    
        // Set up `join_game` listener for host.
        let joinGameListener = mySocket.addEventListener(
          MySocket.EventNames.joinGame,
          GameOnlineSocketEvents.getJoinGameListener({
            useEffectArgs: args
          })
        );
    
        // Set up `leave_game` listener for all.
        let leaveGameListener = mySocket.addEventListener(
          MySocket.EventNames.leaveGame,
          GameOnlineSocketEvents.getLeaveGameListener({
            useEffectArgs: args
          })
        );

        // Set up `emit_winner` listener.
        let emitWinnerListener = mySocket.addEventListener(
          MySocket.EventNames.emitWinner,
          GameOnlineSocketEvents.getEmitWinnerListener({
            useEffectArgs: args
          })
        )

        // Set up `start_new_round` for all.
        let startNewRoundListener = mySocket.addEventListener(
          MySocket.EventNames.startNewRound,
          GameOnlineSocketEvents.getStartNewRoundListener({
            useEffectArgs: args
          })
        )
    
        return function() {
          // Leave the game
          mySocket.emit(
            MySocket.EventNames.leaveGame,
            MySocket.createMessage(
              MySocket.EventNames.leaveGame,
              undefined,
              {
                gameId: data.game?.id,
                player
              }
            )
          );

          // Execute when exit game, that mean when GamePage is destroyed.
          mySocket.removeEventListener(MySocket.EventNames.emitMark, emitMarkListener);
          mySocket.removeEventListener(MySocket.EventNames.joinGame, joinGameListener);
          mySocket.removeEventListener(MySocket.EventNames.leaveGame, leaveGameListener);
          mySocket.removeEventListener(MySocket.EventNames.emitWinner, emitWinnerListener);
          mySocket.removeEventListener(MySocket.EventNames.startNewRound, startNewRoundListener);
        };
      }}

      onResetClick={function() {
        // Emit an message to server that the game is move to new round.
        mySocket.emit<{ gameId: string }>(MySocket.createMessage(
          MySocket.EventNames.startNewRound,
          undefined,
          {
            gameId: data.game!.id
          }
        ));
      }}

      onAddMark={function (x, y, t, currentTurn, winner) {
        // If the game has winner, emit winner with new mark.
        if(winner) {
          mySocket.emit<EmitWinnerMessageDataType>(MySocket.createMessage(
            MySocket.EventNames.emitWinner,
            undefined,
            {
              coor: {
                x, y
              },
              mark: currentTurn,
              gameId: data.game!.id,
              winner: winner
            }
          ));
        } else {
          // Emit mark.
          mySocket.emit<EmitMarkMessageDataType>(MySocket.createMessage(
            MySocket.EventNames.emitMark,
            undefined,
            {
              coor: {
                x, y
              },
              mark: currentTurn,
              gameId: data.game!.id
            }
          ));
        }
      }}

      game={data.game!}
      /*
        Handle main player. There are 2 cases:
        - Main player created the game. That fine, because the data dont need to modify before create game.
        - Main player maybe the one who join the game. So data of them maybe different than default.

        Either case 1 or case 2, the data of player in game object must be find out to merge with `mainPlayer`.
      */
      mainPlayer={(function() {
        let game = data.game!;
        let mainPlayer = { ...player };

        for(let key in game._players) {
          if(mainPlayer.id === game._players[key]!.id) {
            mainPlayer = Object.assign(mainPlayer, game._players[key]);
            break;
          }
        }

        return mainPlayer;
      })()}
      host={data.game && data.game.host ? data.game.host : player}
    />
  )
}