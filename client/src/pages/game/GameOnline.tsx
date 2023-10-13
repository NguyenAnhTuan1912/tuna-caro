import React from 'react';
import { snackbar } from 'tunangn-react-modal';
import { useNavigate } from 'react-router-dom'; 

// Import from classes
import { Game } from 'src/classes/Game';
import { PlayerType } from 'src/classes/Player';

// Import from apis
import { Message, MySocket, mySocket } from 'src/apis/socket';

// Import hooks
import { usePlayer } from 'src/hooks/usePlayer';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import components
import GameCore from './GameCore';

// Import types
import { MarkSocketMessageType } from './Game.props';

//
/**
 * This component depend on `GamePage` to render an online game.
 * @returns 
 */
export default function GameOnline() {
  const { player } = usePlayer();
  const { getData } = useGlobalData();
  const navigate = useNavigate();
  const data = getData();
  
  console.log("GameOnline ~ Data: ", data);

  return (
    <GameCore
      useEffectCB={function(args) {
        let emitMarkListener = mySocket.addEventListener(
          MySocket.EventNames.emitMark,
          (m: Message<MarkSocketMessageType>) => {
            let data = m.data;
            let { x, y } = data?.coor!;
            args.addMark(x, y, Game.t);
          }
        );
    
        // Set up `join_game` listener for host.
        let joinGameListener = mySocket.addEventListener(
          MySocket.EventNames.joinGame,
          (m: Message<PlayerType>) => {
            let player = m.data!;
            // Add player to game.
            // Because first player always "X", so the second will be "O".
            snackbar({
              color: "#2798BC",
              title: "Join",
              content: m.text
            })
            args.appendPlayer("second", player);
          }
        );
    
        let leaveGameListener = mySocket.addEventListener(
          MySocket.EventNames.leaveGame,
          (m: Message<{ playerId: string }>) => {
            snackbar({
              color: "#2798BC",
              title: "Leave",
              content: m.text
            })
            args.removePlayer(m.data?.playerId!);
          }
        );
    
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
        };
      }}
      onEmitCoordinate={function (x, y, t, currentTurn) {
        mySocket.emit<MarkSocketMessageType>(MySocket.createMessage(
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
      }}
      game={data.game!}
      host={data.game && data.game.host ? data.game.host : player}
    />
  )
}