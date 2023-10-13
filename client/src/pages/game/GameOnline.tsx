import React from 'react';
import { snackbar } from 'tunangn-react-modal';

// Import from classes
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
  const { data } = useGlobalData();
  
  return (
    <GameCore
      useEffectCB={function(args) {
        let emitMarkListener = mySocket.addEventListener(
          MySocket.EventNames.emitMark,
          (m: Message<MarkSocketMessageType>) => {
            
          }
        );
    
        // Set up `join_game` listener for host.
        let joinGameListener = mySocket.addEventListener(
          MySocket.EventNames.joinGame,
          (m: Message<PlayerType>) => {
            let player = m.data!;
            // Add player to game.
            // Because first player always "X", so the second will be "O".
            console.log("[GameOnline] Message: ", m);
            snackbar({
              color: "primary",
              title: m.text
            })
            args.appendPlayer("O", player);
          }
        );
    
        let leaveGameListener = mySocket.addEventListener(
          MySocket.EventNames.leaveGame,
          (m: Message<string>) => {
    
          }
        );
    
        return function() {
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
            mark: currentTurn
          }
        ));
      }}
      game={data.game!}
      playerX={{
        id: player.id,
        name: player.name,
        isWinner: false,
        score: 0,
        mark: "X"
      }}
      playerO={{
        id: "",
        name: "",
        isWinner: false,
        score: 0,
        mark: "O"
      }}
    />
  )
}