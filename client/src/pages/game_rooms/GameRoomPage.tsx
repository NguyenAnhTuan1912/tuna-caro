import React from 'react'
import { useNavigate } from 'react-router-dom';

// Import from classes
import { GameRoomType } from 'src/classes/Game';

// Import from api/soket
import { mySocket, MySocket } from 'src/apis/socket';

// Import hooks
import { usePlayer } from 'src/hooks/usePlayer';
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import utils
import { OtherUtils } from 'src/utils/other';

// Import from components
import DataTable from 'src/components/data_table/DataTable';

// Import data for testing
import gameRoomsTestData from 'src/assets/data/game_rooms.json';

// Locally Import
import { GameRoomsStateConfigs } from './state/game_rooms';
import { GameRoomsSocketEventListeners } from './socket_events/game_rooms';

import GameRow from './GameRow';

// Import types
import { GameRoomPageProps } from './GameRoomPage.props';

// Import styles
import './GameRoom.styles.css';

async function getDataAsync() {
  await OtherUtils.wait(2000);
  return gameRoomsTestData.asyncData as Array<GameRoomType>;
}

/**
 * Component renders a page that contains a list of game rooms in server.
 * @param props 
 * @returns 
 */
export default function GameRoomPage(props: GameRoomPageProps) {
  const limit = 5;

  const { player } = usePlayer();
  const [ gameRoomsState, gameRoomsStateFns ] = useStateWESSFns(
    GameRoomsStateConfigs.getInitialState(),
    GameRoomsStateConfigs.getStateFns
  );

  const navigate = useNavigate();
  const { changeData } = useGlobalData();

  // Use to set up socket
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
        stateFns: gameRoomsStateFns
      })
    );

    gameRoomsStateFns.setGames(gameRoomsTestData.data as GameRoomType[]);

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
      mySocket.removeEventListener(MySocket.EventNames.getGames, getGamesListener);
    }
  }, []);

  return (
    <div className="game-room-page p-2">
      <h1>Các phòng</h1>
      <DataTable
        data={gameRoomsState.data}
        renderHeader={() => (
          <tr>
            <td><strong>No</strong></td>
            <td><strong>Tên phòng</strong></td>
            <td><strong>Người chơi</strong></td>
            <td><strong>Mật khẩu</strong></td>
            <td><strong>Trạng thái</strong></td>
          </tr>
        )}
        getDataAsync={async () => {
          let data = await getDataAsync();
          return data;
        }}
        renderRowData={(piece, index) => (
          <GameRow
            key={piece.id}
            data={piece}
            index={index}
            player={player}
          />
        )}
      />
    </div>
  )
}