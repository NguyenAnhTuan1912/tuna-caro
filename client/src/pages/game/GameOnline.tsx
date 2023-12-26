/**
 * This is a GameCore Wrapper Component named GameOnline.
 * Its responsibility is handle online game:
 * - Receive and set up some information about game and players.
 * - Handle socket events (send and receive message).
*/
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

// Import from apis
import { MySocket, mySocket } from 'src/apis/socket';

// Import from hooks
import { usePlayer } from 'src/hooks/usePlayer';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import from utils
import { ROUTES } from 'src/utils/constant';

// Import from components
import GameCore from './GameCore';

// Locally Import
import { GameOnlineSocketEvents } from './socket_events/game_online';

// Import types
import { EmitMarkMessageDataType, EmitWinnerMessageDataType } from './Game.props';

/**
 * This component depend on `GamePage` to render an online game.
 * @returns 
 */
export default function GameOnline() {
  /*
    Player will only has 3 properties are treated as global state:
    - Id: id code of player.
    - Name: name of player.
    - Img: image of character.
    - SocketId: id code of socket.

    So the player's information must be cloned before create the game.
  */
  const { player } = usePlayer();
  const { getData } = useGlobalData();
  const navigate = useNavigate();
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
        let timeoutFunc: number = 0;
        let handleOfflineOnWindow = function() {
          // If the disconnect is lost too long, navigate to home.
          timeoutFunc = setTimeout(() => {
            // Navigate to Home Page.
            console.log("Navigate to Home Page");
            navigate(ROUTES.Home);
          }, data.maxDisconnectionDuration);
        };
        let handleOnlineOnWindow = function() {
          clearTimeout(timeoutFunc);
        };
        let connectListener = function(socket: Socket) {
          // Try to reconnect to game.
          if(!socket.recovered)
            mySocket.emit(
              MySocket.EventNames.reconnectGame,
              MySocket.createMessage(
                MySocket.EventNames.reconnectGame,
                undefined,
                {
                  game: data.game,
                  player
                }
              )
            );
        };

        // Set up `emit_mark` listener.
        let emitMarkListener = mySocket.addEventListener(
          MySocket.EventNames.emitMark,
          GameOnlineSocketEvents.getEmitMarkListener({
            useEffectArgs: args
          })
        );
    
        // Set up `join_game` listener.
        let joinGameListener = mySocket.addEventListener(
          MySocket.EventNames.joinGame,
          GameOnlineSocketEvents.getJoinGameListener({
            useEffectArgs: args
          })
        );
    
        // Set up `leave_game` listener.
        let leaveGameListener = mySocket.addEventListener(
          MySocket.EventNames.leaveGame,
          GameOnlineSocketEvents.getLeaveGameListener({
            useEffectArgs: args,
            navigate: navigate
          })
        );

        let reconnectGameListener = mySocket.addEventListener(
          MySocket.EventNames.reconnectGame,
          GameOnlineSocketEvents.getReconnectGameListener({
            useEffectArgs: args,
            navigate: navigate,
            player
          })
        );

        // Set up `emit_winner` listener.
        let emitWinnerListener = mySocket.addEventListener(
          MySocket.EventNames.emitWinner,
          GameOnlineSocketEvents.getEmitWinnerListener({
            useEffectArgs: args
          })
        );

        // Set up `lost_game_connection`.
        let gameConnectionStatusListener = mySocket.addEventListener(
          MySocket.EventNames.gameConnectionStatus,
          GameOnlineSocketEvents.getGameConnectionStatusListener()
        );

        // Set up `start_new_round`.
        let startNewRoundListener = mySocket.addEventListener(
          MySocket.EventNames.startNewRound,
          GameOnlineSocketEvents.getStartNewRoundListener({
            useEffectArgs: args
          })
        );

        // Listen to `connect` event of socket.
        mySocket.connect(connectListener);

        // Listen to `offline` event from `window`.
        window.addEventListener("offline", handleOfflineOnWindow);
        window.addEventListener("online", handleOnlineOnWindow);
    
        return function() {
          console.log("Leave the game.");
          // Leave the game
          mySocket.emitVolatilely(
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
          mySocket.removeEventListener(MySocket.EventNames.leaveGame, reconnectGameListener);
          mySocket.removeEventListener(MySocket.EventNames.emitWinner, emitWinnerListener);
          mySocket.removeEventListener(MySocket.EventNames.emitWinner, gameConnectionStatusListener);
          mySocket.removeEventListener(MySocket.EventNames.startNewRound, startNewRoundListener);
          mySocket.removeEventListener("connect", connectListener);

          // Remove another event listener
          window.removeEventListener("offline", handleOfflineOnWindow);
          window.removeEventListener("online", handleOnlineOnWindow);
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

      /*
        TO DO: When player A click/press the table, the information of mark must be
        transfer to player B to sync with the game state of player A.

        There 2 ways:
        - If game has winner, so update the game state of player A, that's mean game in player A is stopped. Then
        emit information of winner to player B, so game state of player B will be updated.
        - If not, game will be continued.
      */
      onAddMark={function (x, y, _, currentTurn, winner) {
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

      // Pass initial data for game.
      game={data.game!}
      /*
        Handle main player. There are 2 cases:
        - Main player created the game. That fine, because the data dont need to modify before create game.
        - Main player maybe the one who join the game. So data of them maybe different than default.

        Either case 1 or case 2, the data of player in game object must be found out to merge with `mainPlayer`.
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