import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

// Import from classes
import { GameRoomType } from 'src/classes/Game';

// Import from api/soket
import { mySocket, MySocket } from 'src/apis/socket';

// Import hooks
import { useLangState, getLangTextJSON } from 'src/hooks/useLang';
import { usePlayer } from 'src/hooks/usePlayer';
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import utils
// import { OtherUtils } from 'src/utils/other';

// Import from layouts
import BaseLayout from 'src/layouts/base_layout/BaseLayout';

// Import from components
import DataTable from 'src/components/data_table/DataTable';

// Import data for testing
// import gameRoomsTestData from 'src/assets/data/game_rooms.json';

// Locally Import
import { GameRoomsStateConfigs } from './state/game_rooms';
import { GameRoomsSocketEventListeners } from './socket_events/game_rooms';

import GameRow from './GameRow';

// Import types
import { GameRoomPageProps } from './GameRoomPage.props';

// Import styles
import './GameRoom.styles.css';

/**
 * Component renders a page that contains a list of game rooms in server.
 * @param props 
 * @returns 
 */
export default function GameRoomPage(props: GameRoomPageProps) {
  const { player } = usePlayer();
  const { langTextJSON } = useLangState();

  const [ gameRoomsState, gameRoomsStateFns ] = useStateWESSFns(
    GameRoomsStateConfigs.getInitialState(),
    GameRoomsStateConfigs.getStateFns
  );
  
  const navigate = useNavigate();
  const { changeData } = useGlobalData();
  
  const limit = 5;

  /**
   * Use this function to get data from a socket event instead of getting from listener directly.
   */
  const getGamesAsync = React.useCallback(function(skip: number, limit: number) {
    // Emit a message to get data.
    mySocket.emit(
      MySocket.createMessage(
        MySocket.EventNames.getGames,
        undefined,
        {
          limit,
          skip
        }
      )
    );

    return new Promise<Array<GameRoomType>>((res) => {
      let listener = mySocket.addEventListener(
        MySocket.EventNames.getGames,
        GameRoomsSocketEventListeners.getGetGamesListener({
          getData: function(data) {
            res(data);
            // Remove after get data done
            mySocket.removeEventListener(MySocket.EventNames.getGames, listener);
          }
        })
      );
    });
  }, []);

    
  // Use to set up socket events in this page.
  React.useEffect(() => {

    // Emit to get game.
    mySocket.emit(
      MySocket.createMessage(
        MySocket.EventNames.getGames,
        undefined,
        {
          limit,
          skip: gameRoomsState.skip
        }
      )
    );

    // Set up listener.
    let getGamesListener = mySocket.addEventListener(
      MySocket.EventNames.getGames,
      GameRoomsSocketEventListeners.getGetGamesListener({
        getData: function(data) {
          gameRoomsStateFns.setGames(data);

          // Remove after get data.
          mySocket.removeEventListener(MySocket.EventNames.getGames, getGamesListener);
        }
      })
    );

    /*
      Set up `join_game` listener for player who want to join.
      Receive a message from server contains data of player.
      Complete data of player.
    */
    let joinGameListener = mySocket.addEventListener(
      MySocket.EventNames.joinGame,
      GameRoomsSocketEventListeners.getJoinGameListener({
        changeData,
        navigate
      })
    );

    // Unsubscribe events
    return function() {
      mySocket.removeEventListener(MySocket.EventNames.emitGame, joinGameListener);
    }
  }, []);

  return (
    <BaseLayout
      headerTitle={langTextJSON.gameRoomsPage.headerTitle}
    >
      <div className="game-rooms page p-2">
        <h1>{langTextJSON.gameRoomsPage.pageTitle}</h1>
        <DataTable
          data={gameRoomsState.data}
          renderHeader={() => (
            <tr>
              <td><strong>No</strong></td>
              <td><strong>{langTextJSON.gameRoomsPage.tableHeaderRoomNameLabel}</strong></td>
              <td><strong>{langTextJSON.gameRoomsPage.tableHeaderHostLabel}</strong></td>
              <td><strong>{langTextJSON.gameRoomsPage.tableHeaderHasPasswordLabel}</strong></td>
              <td><strong>{langTextJSON.gameRoomsPage.tableHeaderStatusLabel}</strong></td>
            </tr>
          )}
          getDataAsync={getGamesAsync}
          renderRowData={(item, index) => (
            <GameRow
              key={item.id}
              data={item}
              index={index}
              player={player}
            />
          )}
        />
      </div>
    </BaseLayout>
  )
}